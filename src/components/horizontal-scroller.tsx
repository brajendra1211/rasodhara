"use client";

import { useRef } from "react";

export function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200 bg-white text-[#3f2d20] shadow-md hover:bg-amber-50 sm:flex dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div ref={scrollerRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth sm:gap-5">
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 translate-x-3 items-center justify-center rounded-full border border-amber-200 bg-white text-[#3f2d20] shadow-md hover:bg-amber-50 sm:flex dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
