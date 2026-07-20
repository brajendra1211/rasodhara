import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import { SalesChart } from "@/components/admin/sales-chart";

const LOW_STOCK_THRESHOLD = 10;
const SALES_CHART_DAYS = 30;

function getDaysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function buildDailyRevenue(orders: { createdAt: Date; totalAmount: number }[], days: number) {
  const totals = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    totals.set(d.toISOString().slice(0, 10), 0);
  }
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    if (totals.has(key)) {
      totals.set(key, (totals.get(key) ?? 0) + order.totalAmount);
    }
  }
  return Array.from(totals.entries()).map(([date, total]) => ({ date, total }));
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  PAID: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export default async function AdminDashboard() {
  const salesChartStart = getDaysAgo(SALES_CHART_DAYS);

  const [
    productCount,
    categoryCount,
    orderCount,
    revenue,
    recentOrders,
    lowStockProducts,
    lowStockVariants,
    salesOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalAmount: true } }),
    prisma.order.findMany({
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { variants: { none: {} }, stock: { lte: LOW_STOCK_THRESHOLD } },
      orderBy: { stock: "asc" },
      take: 10,
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: LOW_STOCK_THRESHOLD } },
      include: { product: true },
      orderBy: { stock: "asc" },
      take: 10,
    }),
    prisma.order.findMany({
      where: { status: "PAID", createdAt: { gte: salesChartStart } },
      select: { createdAt: true, totalAmount: true },
    }),
  ]);

  const dailyRevenue = buildDailyRevenue(salesOrders, SALES_CHART_DAYS);
  const chartTotal = dailyRevenue.reduce((sum, d) => sum + d.total, 0);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Categories", value: categoryCount, href: "/admin/categories" },
    { label: "Orders", value: orderCount, href: "/admin/orders" },
    { label: "Revenue (paid)", value: formatINR(revenue._sum.totalAmount ?? 0), href: "/admin/orders" },
  ];

  const lowStockItems = [
    ...lowStockProducts.map((p) => ({
      id: p.id,
      name: p.name,
      variantLabel: null as string | null,
      stock: p.stock,
      href: `/admin/products/${p.id}`,
    })),
    ...lowStockVariants.map((v) => ({
      id: v.id,
      name: v.product.name,
      variantLabel: v.label,
      stock: v.stock,
      href: `/admin/products/${v.productId}`,
    })),
  ].sort((a, b) => a.stock - b.stock);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-zinc-200 p-4 hover:border-amber-600 dark:border-zinc-800"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Sales &middot; last {SALES_CHART_DAYS} days</h2>
          <span className="text-sm text-zinc-500">{formatINR(chartTotal)} total</span>
        </div>
        {chartTotal === 0 ? (
          <p className="text-sm text-zinc-500">No paid orders in this period yet.</p>
        ) : (
          <SalesChart data={dailyRevenue} />
        )}
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-amber-700 dark:text-amber-400">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-zinc-500">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
                  <tr>
                    <th className="py-2 pr-4">Order</th>
                    <th className="py-2 pr-4">Customer</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 pr-4 font-medium">
                        <Link href="/admin/orders" className="hover:underline">
                          #{order.id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-zinc-500">{order.user?.name ?? order.shippingName}</td>
                      <td className="py-3 pr-4">{formatINR(order.totalAmount)}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
            <span className="text-xs text-zinc-500">{LOW_STOCK_THRESHOLD} units or fewer</span>
          </div>

          {lowStockItems.length === 0 ? (
            <p className="text-sm text-zinc-500">Everything is well stocked.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
              {lowStockItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <Link href={item.href} className="hover:text-amber-700 dark:hover:text-amber-400">
                    {item.name}
                    {item.variantLabel && <span className="text-zinc-500"> &middot; {item.variantLabel}</span>}
                  </Link>
                  <span
                    className={`font-medium ${
                      item.stock === 0 ? "text-red-600" : "text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
