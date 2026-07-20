import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteTestimonial } from "@/lib/actions/settings";
import { SettingsSubNav } from "@/components/admin/settings-sub-nav";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Site Settings</h1>
      <SettingsSubNav active="Testimonials" />

      <p className="mb-4 max-w-xl text-sm text-zinc-500">
        Add real feedback you&apos;ve received from customers (WhatsApp, Google reviews, etc.). Shown on the home page.
      </p>

      <div className="mb-6">
        <Link
          href="/admin/settings/testimonials/new"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          New testimonial
        </Link>
      </div>

      <table className="w-full max-w-2xl text-left text-sm">
        <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
          <tr>
            <th className="py-2 pr-4">Order</th>
            <th className="py-2 pr-4">Customer</th>
            <th className="py-2 pr-4">Quote</th>
            <th className="py-2 pr-4">Rating</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {testimonials.map((t) => (
            <tr key={t.id}>
              <td className="py-3 pr-4">{t.order}</td>
              <td className="py-3 pr-4 font-medium">{t.authorName}</td>
              <td className="py-3 pr-4 text-zinc-500">{t.quote.slice(0, 40)}{t.quote.length > 40 ? "…" : ""}</td>
              <td className="py-3 pr-4">{t.rating}★</td>
              <td className="py-3 pr-4 text-zinc-500">{t.active ? "Active" : "Hidden"}</td>
              <td className="py-3 pr-4">
                <div className="flex gap-3">
                  <Link href={`/admin/settings/testimonials/${t.id}`} className="text-amber-700 hover:underline dark:text-amber-400">
                    Edit
                  </Link>
                  <form action={deleteTestimonial.bind(null, t.id)}>
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
      {testimonials.length === 0 && (
        <p className="py-6 text-sm text-zinc-500">
          No testimonials yet &mdash; this section stays hidden on the home page until you add one.
        </p>
      )}
    </div>
  );
}
