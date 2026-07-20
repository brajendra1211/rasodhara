"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/store/cart";
import { useCartUi } from "@/store/cart-ui";

export function HeaderActions() {
  const { data: session } = useSession();
  const itemCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCartUi((s) => s.open);

  const [bump, setBump] = useState(false);
  const prevCount = useRef(itemCount);

  useEffect(() => {
    const increased = itemCount > prevCount.current;
    prevCount.current = itemCount;

    if (increased) {
      setBump(true);
      const timeout = setTimeout(() => setBump(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [itemCount]);

  return (
    <div className="flex items-center gap-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
      {session?.user?.role === "ADMIN" && (
        <Link href="/admin" className="hidden hover:text-amber-700 dark:hover:text-amber-400 sm:inline">
          Admin
        </Link>
      )}

      {session?.user ? (
        <div className="flex items-center gap-3">
          <Link href="/account/wishlist" className="hidden hover:text-amber-700 dark:hover:text-amber-400 sm:inline">
            Wishlist
          </Link>
          <Link href="/account" className="hidden hover:text-amber-700 dark:hover:text-amber-400 sm:inline">
            {session.user.name ?? "Account"}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Sign out
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          aria-label="Login"
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20c1.5-4 4-6 7.5-6s6 2 7.5 6" strokeLinecap="round" />
          </svg>
        </Link>
      )}

      <button
        type="button"
        onClick={openCart}
        aria-label="Cart"
        className={`relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
          bump ? "animate-cart-bump" : ""
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6L5 3H2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="20" r="1.3" />
          <circle cx="18" cy="20" r="1.3" />
        </svg>
        {itemCount > 0 && (
          <span
            className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-semibold text-white ${
              bump ? "animate-cart-bump" : ""
            }`}
          >
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
}
