import { prisma } from "@/lib/prisma";

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({ where: { active: true }, orderBy: { order: "asc" } });

  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-zinc-200 bg-zinc-50 py-14 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-semibold">What Our Customers Say</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-amber-500">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</span>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto text-sm font-medium">
                {t.authorName}
                {t.productName && <span className="font-normal text-zinc-500"> &middot; {t.productName}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
