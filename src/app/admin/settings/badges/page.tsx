import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteTrustBadge } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminTrustBadgesPage() {
  const badges = await prisma.trustBadge.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Trust Badges" />

      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/settings/badges/new"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          New badge
        </Link>
      </div>

      <table className="w-full max-w-xl text-left text-sm">
        <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
          <tr>
            <th className="py-2 pr-4">Order</th>
            <th className="py-2 pr-4">Label</th>
            <th className="py-2 pr-4">Icon</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {badges.map((badge) => (
            <tr key={badge.id}>
              <td className="py-3 pr-4">{badge.order}</td>
              <td className="py-3 pr-4 font-medium">{badge.label}</td>
              <td className="py-3 pr-4 text-zinc-500">{badge.icon}</td>
              <td className="py-3 pr-4 text-zinc-500">{badge.active ? "Active" : "Hidden"}</td>
              <td className="py-3 pr-4">
                <div className="flex gap-3">
                  <Link href={`/admin/settings/badges/${badge.id}`} className="text-amber-700 hover:underline dark:text-amber-400">
                    Edit
                  </Link>
                  <form action={deleteTrustBadge.bind(null, badge.id)}>
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
      {badges.length === 0 && (
        <p className="py-6 text-sm text-zinc-500">No badges yet &mdash; default fallback badges are shown on the site.</p>
      )}
    </div>
  );
}
