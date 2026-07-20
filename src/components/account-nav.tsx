import Link from "next/link";

const TABS = [
  { label: "Overview", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Profile", href: "/account/profile" },
];

export function AccountNav({ active }: { active: string }) {
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
