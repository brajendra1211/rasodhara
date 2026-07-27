import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-10 sm:px-6">
      <aside className="hidden w-48 shrink-0 flex-col gap-1 sm:flex">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">Admin</h2>
        <Link href="/admin" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Dashboard
        </Link>
        <Link href="/admin/products" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Products
        </Link>
        <Link href="/admin/categories" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Categories
        </Link>
        <Link href="/admin/orders" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Orders
        </Link>
        <Link href="/admin/coupons" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Coupons
        </Link>
        <Link href="/admin/customers" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Customers
        </Link>
        <Link href="/admin/blog" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Blog
        </Link>
        <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />
        <h2 className="mb-1 mt-1 text-sm font-semibold uppercase tracking-wide text-zinc-500">Site Settings</h2>
        <Link href="/admin/settings" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          General
        </Link>
        <Link href="/admin/settings/seo" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          SEO
        </Link>
        <Link href="/admin/settings/announcements" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Announcements
        </Link>
        <Link href="/admin/settings/story" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Our Story
        </Link>
        <Link href="/admin/settings/why-us" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Why Us
        </Link>
        <Link href="/admin/settings/hero" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Hero Slides
        </Link>
        <Link href="/admin/settings/badges" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Trust Badges
        </Link>
        <Link href="/admin/settings/testimonials" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Testimonials
        </Link>
        <Link href="/admin/settings/recipes" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Recipes
        </Link>
        <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />
        <Link href="/admin/newsletter" className="rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900">
          Newsletter
        </Link>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
