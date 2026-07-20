import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import { cancelOrder } from "@/lib/actions/orders";

export const metadata: Metadata = {
  title: "Order Details",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const isOwner = Boolean(session?.user && order.userId === session.user.id);
  const isGuestWithToken = Boolean(!order.userId && token && order.guestAccessToken === token);

  if (!isOwner && !isGuestWithToken) {
    if (!session?.user) redirect(`/login?callbackUrl=/order/${id}`);
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-2xl font-semibold">
        {order.status === "PAID" ? "Order confirmed" : "Order status"}
      </h1>
      <p className="mb-6 text-sm text-zinc-500">
        Order #{order.id.slice(-8).toUpperCase()} &middot; {order.status}
        {order.paymentMethod === "COD" && " · Cash on Delivery"}
      </p>

      <ul className="mb-6 flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between py-3 text-sm">
            <span>
              {item.product.name}
              {item.variantLabel ? ` (${item.variantLabel})` : ""} &times; {item.quantity}
            </span>
            <span>{formatINR(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mb-2 flex justify-between text-sm text-zinc-500">
        <span>Subtotal</span>
        <span>{formatINR(order.subtotal || order.totalAmount)}</span>
      </div>
      {order.couponCode && (
        <div className="mb-2 flex justify-between text-sm text-green-700 dark:text-green-400">
          <span>Coupon &ldquo;{order.couponCode}&rdquo;</span>
          <span>&minus;{formatINR(order.discountAmount)}</span>
        </div>
      )}
      <div className="mb-2 flex justify-between text-sm text-zinc-500">
        <span>Shipping</span>
        <span>{order.shippingFee > 0 ? formatINR(order.shippingFee) : "Free"}</span>
      </div>
      {order.taxAmount > 0 && (
        <div className="mb-2 flex justify-between text-sm text-zinc-500">
          <span>GST</span>
          <span>{formatINR(order.taxAmount)}</span>
        </div>
      )}
      <div className="mb-8 flex justify-between border-t border-zinc-200 pt-4 text-base font-semibold dark:border-zinc-800">
        <span>Total</span>
        <span>{formatINR(order.totalAmount)}</span>
      </div>

      <div className="mb-8 rounded-md bg-zinc-100 p-4 text-sm dark:bg-zinc-900">
        <p className="font-medium">{order.shippingName}</p>
        <p>{order.shippingPhone}</p>
        <p className="whitespace-pre-line">{order.shippingAddress}</p>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/shop" className="text-sm font-medium text-amber-700 dark:text-amber-400">
          Continue shopping
        </Link>
        <Link
          href={`/order/${order.id}/invoice${token ? `?token=${token}` : ""}`}
          className="text-sm font-medium text-amber-700 dark:text-amber-400"
        >
          View invoice
        </Link>
        {(order.status === "PENDING" || order.status === "PAID") && (
          <form action={cancelOrder.bind(null, order.id, token ?? null)}>
            <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
              Cancel order
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
