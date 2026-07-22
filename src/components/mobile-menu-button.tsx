"use client";

import { useMobileMenu } from "@/store/mobile-menu";

export function MobileMenuButton() {
  const isOpen = useMobileMenu((s) => s.isOpen);
  const toggle = useMobileMenu((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 md:hidden"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
        {isOpen ? (
          <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
