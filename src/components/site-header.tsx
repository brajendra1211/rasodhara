import Link from "next/link";
import NextForm from "next/form";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { AnnouncementBar } from "@/components/announcement-bar";
import { HeaderActions } from "@/components/header-actions";
import { MobileMenuButton } from "@/components/mobile-menu-button";
import { MobileMenu } from "@/components/mobile-menu";

export async function SiteHeader() {
  const [categories, tasteRows, oilRows, settings] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { tasteProfile: { not: null } },
      select: { tasteProfile: true },
      distinct: ["tasteProfile"],
    }),
    prisma.product.findMany({
      where: { oilType: { not: null } },
      select: { oilType: true },
      distinct: ["oilType"],
    }),
    getSiteSettings(),
  ]);

  const tastes = tasteRows.map((r) => r.tasteProfile).filter((t): t is string => !!t);
  const oilTypes = oilRows.map((r) => r.oilType).filter((t): t is string => !!t);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-cream dark:border-zinc-800 dark:bg-black">
      <AnnouncementBar />

      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6">
        <MobileMenuButton />

        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-amber-700 dark:text-amber-400">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt={settings.siteName} className="h-8 w-8 rounded-full object-cover" />
          ) : null}
          {settings.siteName}
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 md:flex">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
              Shop
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="absolute left-0 top-full z-50 mt-1 flex gap-8 rounded-md border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex min-w-40 flex-col gap-0.5">
                <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Category</h3>
                <Link href="/shop" className="rounded-md px-2 py-1.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-950">
                  All products
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop?category=${c.slug}`}
                    className="rounded-md px-2 py-1.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-950"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>

              {oilTypes.length > 0 && (
                <div className="flex min-w-36 flex-col gap-0.5">
                  <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Oil Type</h3>
                  {oilTypes.map((o) => (
                    <Link
                      key={o}
                      href={`/shop?oil=${encodeURIComponent(o)}`}
                      className="rounded-md px-2 py-1.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-950"
                    >
                      {o}
                    </Link>
                  ))}
                </div>
              )}

              {tastes.length > 0 && (
                <div className="flex min-w-36 flex-col gap-0.5">
                  <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Taste</h3>
                  {tastes.map((t) => (
                    <Link
                      key={t}
                      href={`/shop?taste=${encodeURIComponent(t)}`}
                      className="rounded-md px-2 py-1.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-950"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex min-w-36 flex-col gap-0.5">
                <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Dietary</h3>
                <Link href="/shop?jain=1" className="rounded-md px-2 py-1.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-950">
                  Jain Friendly
                </Link>
              </div>
            </div>
          </details>

          <Link href="/shop?jain=1" className="rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Jain Friendly
          </Link>
          <Link href="/our-story" className="rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Our Story
          </Link>
          <Link href="/blog" className="rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Blog
          </Link>
        </nav>

        <NextForm action="/shop" className="ml-auto hidden max-w-xs flex-1 sm:flex">
          <input
            type="search"
            name="q"
            placeholder="Search products"
            className="w-full rounded-full border border-zinc-300 bg-zinc-50 px-4 py-1.5 text-sm focus:border-amber-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
        </NextForm>

        <div className="ml-auto sm:ml-0">
          <HeaderActions />
        </div>
      </div>

      <div className="border-t border-zinc-100 px-4 py-2 dark:border-zinc-900 md:hidden">
        <NextForm action="/shop" className="flex">
          <input
            type="search"
            name="q"
            placeholder="Search products"
            className="w-full rounded-full border border-zinc-300 bg-zinc-50 px-4 py-1.5 text-sm focus:border-amber-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
        </NextForm>
      </div>

      <MobileMenu categories={categories} oilTypes={oilTypes} tastes={tastes} />
    </header>
  );
}
