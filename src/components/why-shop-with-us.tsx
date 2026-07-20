import { prisma } from "@/lib/prisma";
import { ICON_PATHS } from "@/components/trust-badges";

export async function WhyShopWithUs() {
  const badges = await prisma.trustBadge.findMany({ where: { active: true, description: { not: null } }, orderBy: { order: "asc" } });

  if (badges.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <h2 className="mb-8 text-center text-2xl font-semibold">Why Shop With Us</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-amber-700 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d={ICON_PATHS[badge.icon] ?? ICON_PATHS.leaf} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="text-sm font-semibold">{badge.label}</h3>
            {badge.description && <p className="text-sm text-zinc-600 dark:text-zinc-400">{badge.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
