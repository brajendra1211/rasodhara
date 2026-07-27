"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useMobileMenu } from "@/store/mobile-menu";

type MobileMenuProps = {
  categories: { id: string; slug: string; name: string }[];
  oilTypes: string[];
  tastes: string[];
};

export function MobileMenu({ categories, oilTypes, tastes }: MobileMenuProps) {
  const isOpen = useMobileMenu((s) => s.isOpen);
  const close = useMobileMenu((s) => s.close);
  const { data: session } = useSession();

  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label="Menu"
        aria-hidden={!isOpen}
        className={`fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-out dark:bg-zinc-950 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold">Menu</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <Link href="/" onClick={close} className="rounded-md px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950">
            Home
          </Link>
          <Link href="/shop" onClick={close} className="rounded-md px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950">
            All products
          </Link>

          {categories.length > 0 && (
            <div className="mt-2 flex flex-col gap-0.5">
              <h3 className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Category</h3>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}`}
                  onClick={close}
                  className="rounded-md px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {oilTypes.length > 0 && (
            <div className="mt-2 flex flex-col gap-0.5">
              <h3 className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Oil Type</h3>
              {oilTypes.map((o) => (
                <Link
                  key={o}
                  href={`/shop?oil=${encodeURIComponent(o)}`}
                  onClick={close}
                  className="rounded-md px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950"
                >
                  {o}
                </Link>
              ))}
            </div>
          )}

          {tastes.length > 0 && (
            <div className="mt-2 flex flex-col gap-0.5">
              <h3 className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">Taste</h3>
              {tastes.map((t) => (
                <Link
                  key={t}
                  href={`/shop?taste=${encodeURIComponent(t)}`}
                  onClick={close}
                  className="rounded-md px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950"
                >
                  {t}
                </Link>
              ))}
            </div>
          )}

          <Link href="/shop?jain=1" onClick={close} className="mt-2 rounded-md px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950">
            Jain Friendly
          </Link>
          <Link href="/our-story" onClick={close} className="rounded-md px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950">
            Our Story
          </Link>
          <Link href="/blog" onClick={close} className="rounded-md px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950">
            Blog
          </Link>

          <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />

          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" onClick={close} className="rounded-md px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950">
                  Admin
                </Link>
              )}
              <Link href="/account" onClick={close} className="rounded-md px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950">
                {session.user.name ?? "Account"}
              </Link>
              <Link href="/account/orders" onClick={close} className="rounded-md px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950">
                Your orders
              </Link>
              <Link href="/account/wishlist" onClick={close} className="rounded-md px-3 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950">
                Wishlist
              </Link>
              <button
                type="button"
                onClick={() => {
                  close();
                  signOut({ callbackUrl: "/" });
                }}
                className="mt-2 rounded-md border border-zinc-300 px-3 py-2.5 text-left hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={close}
              className="rounded-md bg-amber-600 px-3 py-2.5 text-center font-semibold text-white hover:bg-amber-700"
            >
              Login / Sign up
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}
