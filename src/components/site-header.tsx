import Link from "next/link";
import NextForm from "next/form";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { AnnouncementBar } from "@/components/announcement-bar";
import { HeaderActions } from "@/components/header-actions";
import { MobileMenuButton } from "@/components/mobile-menu-button";
import { MobileMenu } from "@/components/mobile-menu";
import { ShopDropdown } from "@/components/shop-dropdown";

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

        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-semibold tracking-tight text-amber-700 dark:text-amber-400">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt={settings.siteName} className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14" />
          ) : null}
          {settings.siteName}
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 md:flex">
          <ShopDropdown categories={categories} oilTypes={oilTypes} tastes={tastes} />

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
