import { prisma } from "@/lib/prisma";

export const ICON_PATHS: Record<string, string> = {
  leaf: "M12 3c-4 3-7 6-7 10a7 7 0 0014 0c0-4-3-7-7-10z",
  shield: "M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z",
  truck: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  refresh: "M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-5M20 15a8 8 0 01-14 5",
};

const FALLBACK_BADGES = [
  { id: "natural", label: "100% Natural, No Preservatives", icon: "leaf" },
  { id: "secure", label: "Secure Payments", icon: "shield" },
  { id: "shipping", label: "Pan-India Shipping", icon: "truck" },
  { id: "returns", label: "Easy Returns", icon: "refresh" },
];

export async function TrustBadges() {
  const rows = await prisma.trustBadge.findMany({ where: { active: true }, orderBy: { order: "asc" } });
  const badges = rows.length > 0 ? rows : FALLBACK_BADGES;

  return (
    <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
        {badges.map((badge) => (
          <div key={badge.id} className="flex flex-col items-center gap-2 text-center">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-amber-700 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d={ICON_PATHS[badge.icon] ?? ICON_PATHS.leaf} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 sm:text-sm">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
