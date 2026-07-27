import { prisma } from "@/lib/prisma";
import { ICON_PATHS } from "@/components/trust-badges";

const FALLBACK_WHY_ITEMS = [
  { id: "ingredients", label: "Premium Ingredients", description: "We source the finest quality ingredients for authentic taste.", icon: "leaf" },
  { id: "sunmatured", label: "Naturally Sun Matured", description: "Traditional sun-drying process locks in flavor and nutrition.", icon: "sun" },
  { id: "homemade", label: "Homemade Recipes", description: "Made using age-old recipes passed down generations.", icon: "home" },
  { id: "labtested", label: "NABL Accredited Lab Tested", description: "Every batch is lab tested for safety and quality.", icon: "flask" },
  { id: "nobacteria", label: "No Harmful Bacteria", description: "Rigorously tested to ensure every batch is safe to eat.", icon: "shield" },
  { id: "nochemical", label: "No Chemical Preservatives", description: "Preserved the traditional way, without artificial chemicals.", icon: "ban" },
  { id: "qualitytested", label: "Quality Tested", description: "Every batch undergoes strict quality testing for consistency.", icon: "badge" },
  { id: "handcrafted", label: "Handcrafted in Small Batches", description: "Freshly prepared with care and attention to detail.", icon: "hand" },
];

export async function WhyShopWithUs() {
  const rows = await prisma.trustBadge.findMany({ where: { active: true, description: { not: null } }, orderBy: { order: "asc" } });
  const badges = rows.length > 0 ? rows : FALLBACK_WHY_ITEMS;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d={ICON_PATHS[badge.icon] ?? ICON_PATHS.leaf} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#3f2d20] sm:text-sm dark:text-zinc-100">
              {badge.label}
            </h3>
            {badge.description && <p className="text-sm text-[#5c4a3a] dark:text-zinc-400">{badge.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
