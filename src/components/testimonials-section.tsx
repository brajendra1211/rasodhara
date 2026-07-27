import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";

export async function TestimonialsSection() {
  const testimonials = await prisma.testimonial.findMany({ where: { active: true }, orderBy: { order: "asc" } });

  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-amber-100 bg-amber-50/60 py-14 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading title="Loved by Our Customers" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="mx-auto text-amber-500">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </span>
              <p className="text-sm text-[#5c4a3a] dark:text-zinc-400">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto text-sm font-semibold text-[#3f2d20] dark:text-zinc-100">
                — {t.authorName}
                {t.productName && <span className="font-normal text-[#5c4a3a] dark:text-zinc-500"> &middot; {t.productName}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
