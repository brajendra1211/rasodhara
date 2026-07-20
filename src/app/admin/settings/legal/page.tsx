import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteLegalPage } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminLegalPagesPage() {
  const pages = await prisma.legalPage.findMany({ orderBy: { title: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Legal Pages" />

      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        Terms, privacy, refund and shipping policies shown at <code>/legal/[slug]</code> and linked from the footer.
      </p>

      <div className="mb-6">
        <Link
          href="/admin/settings/legal/new"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          New page
        </Link>
      </div>

      <table className="w-full max-w-xl text-left text-sm">
        <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
          <tr>
            <th className="py-2 pr-4">Title</th>
            <th className="py-2 pr-4">Slug</th>
            <th className="py-2 pr-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {pages.map((page) => (
            <tr key={page.id}>
              <td className="py-3 pr-4 font-medium">{page.title}</td>
              <td className="py-3 pr-4 text-zinc-500">/legal/{page.slug}</td>
              <td className="py-3 pr-4">
                <div className="flex gap-3">
                  <Link href={`/admin/settings/legal/${page.id}`} className="text-amber-700 hover:underline dark:text-amber-400">
                    Edit
                  </Link>
                  <form action={deleteLegalPage.bind(null, page.id)}>
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
      {pages.length === 0 && <p className="py-6 text-sm text-zinc-500">No legal pages yet.</p>}
    </div>
  );
}
