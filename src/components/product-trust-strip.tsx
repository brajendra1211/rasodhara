import { prisma } from "@/lib/prisma";
import { ICON_PATHS } from "@/components/trust-badges";

const FALLBACK_BADGES = [
  { id: "natural", label: "100% Natural", icon: "leaf" },
  { id: "secure", label: "Secure Payments", icon: "shield" },
  { id: "shipping", label: "Pan-India Shipping", icon: "truck" },
];

export async function ProductTrustStrip({
  productBadges,
}: {
  productBadges?: { id: string; label: string; icon: string }[];
}) {
  let badges = productBadges;
  if (!badges || badges.length === 0) {
    const rows = await prisma.trustBadge.findMany({ where: { active: true }, orderBy: { order: "asc" }, take: 3 });
    badges = rows.length > 0 ? rows : FALLBACK_BADGES;
  }

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      {badges.map((badge) => (
        <div key={badge.id} className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-700 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d={ICON_PATHS[badge.icon] ?? ICON_PATHS.leaf} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {badge.label}
        </div>
      ))}
    </div>
  );
}
