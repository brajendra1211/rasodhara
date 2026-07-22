"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/store/cart";
import { useCartUi } from "@/store/cart-ui";

function tabClass(active: boolean) {
  return `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium ${
    active ? "text-amber-700 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-400"
  }`;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const itemCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCartUi((s) => s.open);

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/shop");
  const isWishlist = pathname.startsWith("/account/wishlist");
  const isAccount = pathname.startsWith("/account") && !isWishlist;

  return (
    <nav
      aria-label="Mobile navigation"
      className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden"
    >
      <Link href="/" className={tabClass(isHome)}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={isHome ? 2 : 1.6}>
          <path d="M4 11.5L12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10v9a1 1 0 001 1h3v-5h4v5h3a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Home
      </Link>

      <Link href="/shop" className={tabClass(isShop)}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={isShop ? 2 : 1.6}>
          <path d="M4 8l1.5-4h13L20 8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 8h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V8z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12a3 3 0 006 0" strokeLinecap="round" />
        </svg>
        Shop
      </Link>

      <button type="button" onClick={openCart} className={tabClass(false)}>
        <span className="relative">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="20" r="1.3" />
            <circle cx="18" cy="20" r="1.3" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-semibold text-white">
              {itemCount}
            </span>
          )}
        </span>
        Cart
      </button>

      <Link href="/account/wishlist" className={tabClass(isWishlist)}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={isWishlist ? 2 : 1.6}>
          <path
            d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 5c-2.5 4.6-9.5 9-9.5 9z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Wishlist
      </Link>

      {session?.user ? (
        <Link href="/account" className={tabClass(isAccount)}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={isAccount ? 2 : 1.6}>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20c1.5-4 4-6 7.5-6s6 2 7.5 6" strokeLinecap="round" />
          </svg>
          Account
        </Link>
      ) : (
        <Link href="/login" className={tabClass(pathname.startsWith("/login"))}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={pathname.startsWith("/login") ? 2 : 1.6}>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20c1.5-4 4-6 7.5-6s6 2 7.5 6" strokeLinecap="round" />
          </svg>
          Login
        </Link>
      )}
    </nav>
  );
}
