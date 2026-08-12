import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { ShiprocketShipmentPanel } from "@/components/admin/shiprocket-shipment-panel";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: { include: { images: { take: 1 } } } } },
    },
  });

  if (!order) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="text-sm text-amber-700 hover:underline dark:text-amber-400">
            &larr; All orders
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-zinc-500">
            Placed {order.createdAt.toLocaleString()} &middot; {order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay"}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Items</h2>
          <ul className="flex flex-col divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {order.items.map((item) => {
              const image = item.product.images[0]?.url;
              return (
                <li key={item.id} className="flex items-center gap-4 p-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
                    {image ? (
                      <Image src={image} alt={item.product.name} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/admin/products/${item.productId}`}
                      className="font-medium hover:text-amber-700 dark:hover:text-amber-400"
                    >
                      {item.product.name}
                    </Link>
                    {item.variantLabel && <p className="text-sm text-zinc-500">{item.variantLabel}</p>}
                    <p className="text-sm text-zinc-500">
                      {formatINR(item.price)} &times; {item.quantity}
                    </p>
                  </div>
                  <div className="font-medium">{formatINR(item.price * item.quantity)}</div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-col gap-1.5 rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
            <div className="flex justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal || order.totalAmount)}</span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between text-green-700 dark:text-green-400">
                <span>Coupon &ldquo;{order.couponCode}&rdquo;</span>
                <span>&minus;{formatINR(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-500">
              <span>Shipping</span>
              <span>{order.shippingFee > 0 ? formatINR(order.shippingFee) : "Free"}</span>
            </div>
            {order.taxAmount > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span>GST</span>
                <span>{formatINR(order.taxAmount)}</span>
              </div>
            )}
            <div className="mt-1 flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold dark:border-zinc-800">
              <span>Total</span>
              <span>{formatINR(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Customer</h2>
            <div className="rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
              <p className="font-medium">{order.user?.name ?? order.shippingName}</p>
              {!order.user && <p className="text-xs text-zinc-400">Guest checkout</p>}
              {order.user?.email && <p className="text-zinc-500">{order.user.email}</p>}
              {order.guestEmail && <p className="text-zinc-500">{order.guestEmail}</p>}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Shipping address</h2>
            <div className="rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
              <p className="font-medium">{order.shippingName}</p>
              <p>{order.shippingPhone}</p>
              <p className="whitespace-pre-line text-zinc-500">{order.shippingAddress}</p>
              <p className="text-zinc-500">
                {order.shippingCity}, {order.shippingState} &ndash; {order.shippingPincode}
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Shipment</h2>
            <ShiprocketShipmentPanel
              orderId={order.id}
              shiprocketOrderId={order.shiprocketOrderId}
              shiprocketAwbCode={order.shiprocketAwbCode}
              shiprocketCourierName={order.shiprocketCourierName}
              shiprocketTrackingUrl={order.shiprocketTrackingUrl}
              shiprocketError={order.shiprocketError}
            />
          </div>

          {(order.razorpayOrderId || order.razorpayPaymentId) && (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Payment</h2>
              <div className="flex flex-col gap-1 rounded-md border border-zinc-200 p-4 text-xs text-zinc-500 dark:border-zinc-800">
                {order.razorpayOrderId && <p>Razorpay order: {order.razorpayOrderId}</p>}
                {order.razorpayPaymentId && <p>Razorpay payment: {order.razorpayPaymentId}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
