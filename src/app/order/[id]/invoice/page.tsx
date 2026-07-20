import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import { getSiteSettings } from "@/lib/settings";
import { PrintButton } from "@/components/print-button";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false, follow: false },
};

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;
  const [session, settings] = await Promise.all([auth(), getSiteSettings()]);

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const isOwner = Boolean(session?.user && order.userId === session.user.id);
  const isGuestWithToken = Boolean(!order.userId && token && order.guestAccessToken === token);

  if (!isOwner && !isGuestWithToken) {
    if (!session?.user) redirect(`/login?callbackUrl=/order/${id}/invoice`);
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="text-2xl font-semibold">Invoice</h1>
        <PrintButton />
      </div>

      <div className="rounded-lg border border-zinc-200 p-8 dark:border-zinc-800 print:border-none print:p-0">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold text-amber-700 dark:text-amber-400">{settings.siteName}</p>
            {settings.contactAddress && (
              <p className="whitespace-pre-line text-sm text-zinc-500">{settings.contactAddress}</p>
            )}
            {settings.contactEmail && <p className="text-sm text-zinc-500">{settings.contactEmail}</p>}
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500">Invoice for order</p>
            <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-zinc-500">Billed to</p>
          <p className="font-medium">{order.shippingName}</p>
          <p className="text-sm text-zinc-500">{order.shippingPhone}</p>
          <p className="whitespace-pre-line text-sm text-zinc-500">{order.shippingAddress}</p>
        </div>

        <table className="mb-6 w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="py-2">Item</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2">
                  {item.product.name}
                  {item.variantLabel ? ` (${item.variantLabel})` : ""}
                </td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatINR(item.price)}</td>
                <td className="py-2 text-right">{formatINR(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto flex max-w-xs flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Subtotal</span>
            <span>{formatINR(order.subtotal || order.totalAmount)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-700 dark:text-green-400">
              <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
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
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold dark:border-zinc-800">
            <span>Total</span>
            <span>{formatINR(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Payment method</span>
            <span>{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online payment"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
