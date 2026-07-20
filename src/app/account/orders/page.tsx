import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import { AccountNav } from "@/components/account-nav";

export const metadata: Metadata = {
  title: "Your Orders",
  robots: { index: false, follow: false },
};

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Your account</h1>
      <AccountNav active="Orders" />

      {orders.length === 0 ? (
        <p className="text-sm text-zinc-500">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/shop" className="font-medium text-amber-700 dark:text-amber-400">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {orders.map((order) => (
            <li key={order.id} className="py-4">
              <Link href={`/order/${order.id}`} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-zinc-500">
                    {order.items.length} item(s) &middot; {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatINR(order.totalAmount)}</p>
                  <p className="text-zinc-500">{order.status}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
