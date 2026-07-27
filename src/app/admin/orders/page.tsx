import Link from "next/link";
import NextForm from "next/form";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

const PAGE_SIZE = 20;
const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const { q, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const where = {
    ...(status ? { status: status as (typeof STATUSES)[number] } : {}),
    ...(q ? { user: { name: { contains: q } } } : {}),
  };

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    params.set("page", String(targetPage));
    return `/admin/orders?${params.toString()}`;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders ({totalCount})</h1>
        <a
          href="/api/admin/export/orders"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Export CSV
        </a>
      </div>

      <NextForm action="/admin/orders" className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-sm font-medium">
            Customer name
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Customer name"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ""}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Filter
        </button>
        {(q || status) && (
          <Link href="/admin/orders" className="text-sm text-zinc-500 hover:underline">
            Clear
          </Link>
        )}
      </NextForm>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Items</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-3 pr-4 font-medium">
                  <Link href={`/admin/orders/${order.id}`} className="text-amber-700 hover:underline dark:text-amber-400">
                    #{order.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-zinc-500">
                  {order.user?.name ?? order.shippingName}
                  {!order.user && <span className="ml-1 text-xs text-zinc-400">(guest)</span>}
                  <br />
                  <span className="text-xs">{order.shippingPhone}</span>
                </td>
                <td className="py-3 pr-4">{order.items.length}</td>
                <td className="py-3 pr-4">{formatINR(order.totalAmount)}</td>
                <td className="py-3 pr-4">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="py-6 text-sm text-zinc-500">
            {q || status ? "No orders match your filters." : "No orders yet."}
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link
            href={pageHref(page - 1)}
            aria-disabled={page <= 1}
            className={`rounded-full border border-zinc-300 px-4 py-1.5 dark:border-zinc-700 ${
              page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            Previous
          </Link>
          <span className="text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <Link
            href={pageHref(page + 1)}
            aria-disabled={page >= totalPages}
            className={`rounded-full border border-zinc-300 px-4 py-1.5 dark:border-zinc-700 ${
              page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
