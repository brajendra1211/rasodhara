import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteHeroSlide } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminHeroSlidesPage() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Hero Slides" />

      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/settings/hero/new"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          New slide
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="py-2 pr-4">Order</th>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {slides.map((slide) => (
              <tr key={slide.id}>
                <td className="py-3 pr-4">{slide.order}</td>
                <td className="py-3 pr-4 font-medium">{slide.title}</td>
                <td className="py-3 pr-4 text-zinc-500">{slide.active ? "Active" : "Hidden"}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/settings/hero/${slide.id}`} className="text-amber-700 hover:underline dark:text-amber-400">
                      Edit
                    </Link>
                    <form action={deleteHeroSlide.bind(null, slide.id)}>
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
        {slides.length === 0 && (
          <p className="py-6 text-sm text-zinc-500">
            No slides yet &mdash; the home page will show a default fallback slide until you add one.
          </p>
        )}
      </div>
    </div>
  );
}
