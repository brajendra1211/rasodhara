import Link from "next/link";

const TABS = [
  { label: "General", href: "/admin/settings" },
  { label: "Theme Color", href: "/admin/settings/theme" },
  { label: "SEO", href: "/admin/settings/seo" },
  { label: "Announcements", href: "/admin/settings/announcements" },
  { label: "Our Story", href: "/admin/settings/story" },
  { label: "Why Us", href: "/admin/settings/why-us" },
  { label: "Hero Slides", href: "/admin/settings/hero" },
  { label: "Trust Badges", href: "/admin/settings/badges" },
  { label: "Testimonials", href: "/admin/settings/testimonials" },
  { label: "Recipes", href: "/admin/settings/recipes" },
  { label: "Legal Pages", href: "/admin/settings/legal" },
  { label: "Shipping & Tax", href: "/admin/settings/shipping" },
];

export function SettingsSubNav({ active }: { active: string }) {
  return (
    <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 border-b border-zinc-200 dark:border-zinc-800">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`-mb-px border-b-2 px-1 pb-3 text-sm font-medium ${
            tab.label === active
              ? "border-amber-600 text-amber-700 dark:text-amber-400"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
