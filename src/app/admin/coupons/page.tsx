import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import { deleteCoupon } from "@/lib/actions/coupons";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <Link
          href="/admin/coupons/new"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          New coupon
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="py-2 pr-4">Code</th>
              <th className="py-2 pr-4">Discount</th>
              <th className="py-2 pr-4">Min order</th>
              <th className="py-2 pr-4">Uses</th>
              <th className="py-2 pr-4">Expires</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {coupons.map((coupon) => (
              <tr key={coupon.id}>
                <td className="py-3 pr-4 font-medium">{coupon.code}</td>
                <td className="py-3 pr-4">
                  {coupon.type === "PERCENT" ? `${coupon.value}%` : formatINR(coupon.value)}
                </td>
                <td className="py-3 pr-4 text-zinc-500">
                  {coupon.minOrderAmount ? formatINR(coupon.minOrderAmount) : "—"}
                </td>
                <td className="py-3 pr-4 text-zinc-500">
                  {coupon.usedCount}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                </td>
                <td className="py-3 pr-4 text-zinc-500">
                  {coupon.expiresAt ? coupon.expiresAt.toLocaleDateString("en-IN") : "—"}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      coupon.active
                        ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {coupon.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/coupons/${coupon.id}`} className="text-amber-700 hover:underline dark:text-amber-400">
                      Edit
                    </Link>
                    <form action={deleteCoupon.bind(null, coupon.id)}>
                      <button type="submit" className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="py-6 text-sm text-zinc-500">No coupons yet.</p>}
      </div>
    </div>
  );
}
