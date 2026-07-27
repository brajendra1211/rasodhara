import { prisma } from "@/lib/prisma";

export const ICON_PATHS: Record<string, string> = {
  leaf: "M12 3c-4 3-7 6-7 10a7 7 0 0014 0c0-4-3-7-7-10z",
  shield: "M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z",
  truck: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  refresh: "M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-5M20 15a8 8 0 01-14 5",
  sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 100 10 5 5 0 000-10z",
  home: "M4 11l8-7 8 7M6 10v9h12v-9",
  flask: "M9 3h6M10 3v6l-5.5 9.5A1.5 1.5 0 005.8 21h12.4a1.5 1.5 0 001.3-2.5L14 9V3",
  chat: "M4 4h16v12H8l-4 4V4z",
  ban: "M12 3a9 9 0 100 18 9 9 0 000-18zM5.6 5.6l12.8 12.8",
  badge: "M12 2l2.3 4.6 5.1.7-3.7 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.7-3.6 5.1-.7L12 2z",
  hand: "M8 12V5a1.7 1.7 0 013.4 0v5M11.4 10V4a1.7 1.7 0 013.4 0v6M14.8 10V6a1.7 1.7 0 013.4 0v6M8 12a4 4 0 004 8h2.4a5 5 0 005-5v-2.5",
};

const FALLBACK_BADGES = [
  { id: "secure", label: "Secure Payments", icon: "shield" },
  { id: "authentic", label: "100% Authentic Products", icon: "leaf" },
  { id: "shipping", label: "Fast & Safe Delivery", icon: "truck" },
  { id: "returns", label: "Easy Returns", icon: "refresh" },
  { id: "chat", label: "Need Help? Chat with us", icon: "chat" },
];

export async function TrustBadges() {
  const rows = await prisma.trustBadge.findMany({ where: { active: true }, orderBy: { order: "asc" } });
  const badges = rows.length > 0 ? rows : FALLBACK_BADGES;

  return (
    <section className="border-y border-amber-100 bg-amber-50/70 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-5 sm:px-6">
        {badges.map((badge) => (
          <div key={badge.id} className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-olive-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d={ICON_PATHS[badge.icon] ?? ICON_PATHS.leaf} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-medium text-[#5c4a3a] dark:text-zinc-400 sm:text-sm">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
