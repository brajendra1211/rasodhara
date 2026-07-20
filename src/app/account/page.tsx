import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import { AccountNav } from "@/components/account-nav";

export const metadata: Metadata = {
  title: "Your Account",
  robots: { index: false, follow: false },
};

export default async function AccountOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const [orderCount, wishlistCount, addressCount, recentOrders] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.wishlist.count({ where: { userId: session.user.id } }),
    prisma.address.count({ where: { userId: session.user.id } }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const stats = [
    { label: "Orders", value: orderCount, href: "/account/orders" },
    { label: "Wishlist", value: wishlistCount, href: "/account/wishlist" },
    { label: "Saved addresses", value: addressCount, href: "/account/addresses" },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Your account</h1>
      <AccountNav active="Overview" />

      <p className="mb-6 text-sm text-zinc-500">
        Welcome back, {session.user.name ?? session.user.email}.
      </p>

      <div className="mb-10 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-zinc-200 p-4 text-center hover:border-amber-600 dark:border-zinc-800"
          >
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-sm text-zinc-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent orders</h2>
        <Link href="/account/orders" className="text-sm font-medium text-amber-700 dark:text-amber-400">
          View all
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <p className="text-sm text-zinc-500">
          You haven&apos;t placed any orders yet.{" "}
          <Link href="/shop" className="font-medium text-amber-700 dark:text-amber-400">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {recentOrders.map((order) => (
            <li key={order.id} className="py-3">
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
