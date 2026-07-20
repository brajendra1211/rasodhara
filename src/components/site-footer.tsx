import Link from "next/link";
import { TrustBadges } from "@/components/trust-badges";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Cold-pressed oils", href: "/shop?category=cold-pressed-oils" },
      { label: "Ghee & dairy", href: "/shop?category=ghee-dairy" },
      { label: "Spices & masalas", href: "/shop?category=spices-masalas" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Your orders", href: "/account/orders" },
      { label: "Wishlist", href: "/account/wishlist" },
      { label: "Cart", href: "/cart" },
      { label: "Login", href: "/login" },
    ],
  },
];

const SOCIAL_ICONS = {
  instagramUrl: {
    label: "Instagram",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  facebookUrl: {
    label: "Facebook",
    path: <path d="M14 9h2V6h-2c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V9z" />,
  },
  twitterUrl: {
    label: "Twitter / X",
    path: <path d="M4 4l7.5 9.3L4.4 20h2.3l5.8-5.7L17 20h3l-7.8-9.7L19.5 4h-2.3l-5.4 5.3L9 4H4z" />,
  },
  youtubeUrl: {
    label: "YouTube",
    path: (
      <>
        <rect x="2.5" y="6" width="19" height="12" rx="3" />
        <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
      </>
    ),
  },
} as const;

export async function SiteFooter() {
  const [settings, legalPages] = await Promise.all([
    getSiteSettings(),
    prisma.legalPage.findMany({ orderBy: { title: "asc" } }),
  ]);

  const socialLinks = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[])
    .map((key) => ({ key, url: settings[key], ...SOCIAL_ICONS[key] }))
    .filter((s): s is typeof s & { url: string } => Boolean(s.url));

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <TrustBadges />

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-5 sm:px-6">
        <div className="col-span-2 flex flex-col gap-2 sm:col-span-2">
          <span className="text-lg font-semibold tracking-tight text-amber-700 dark:text-amber-400">
            {settings.siteName}
          </span>
          {settings.tagline && <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">{settings.tagline}</p>}
          {(settings.contactEmail || settings.contactPhone || settings.contactAddress) && (
            <div className="mt-2 flex flex-col gap-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              {settings.contactEmail && <span>{settings.contactEmail}</span>}
              {settings.contactPhone && <span>{settings.contactPhone}</span>}
              {settings.contactAddress && <span>{settings.contactAddress}</span>}
            </div>
          )}

          {socialLinks.length > 0 && (
            <div className="mt-2 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 hover:border-amber-600 hover:text-amber-700 dark:border-zinc-700 dark:hover:text-amber-400"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    {social.path}
                  </svg>
                </a>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 018 0v3" strokeLinecap="round" />
            </svg>
            Secure checkout powered by Razorpay
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{column.title}</h3>
            {column.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-500 hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        {legalPages.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Policies</h3>
            {legalPages.map((page) => (
              <Link
                key={page.slug}
                href={`/legal/${page.slug}`}
                className="text-sm text-zinc-500 hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
              >
                {page.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        {settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.`}
      </div>
    </footer>
  );
}
