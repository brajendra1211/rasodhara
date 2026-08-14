"use client";

import Link from "next/link";
import { useRef } from "react";

type Category = { id: string; slug: string; name: string };

export function ShopDropdown({
  categories,
  oilTypes,
  tastes,
}: {
  categories: Category[];
  oilTypes: string[];
  tastes: string[];
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function close() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  return (
    <details ref={detailsRef} className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
        Shop
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="absolute left-0 top-full z-50 mt-1 flex gap-8 rounded-md border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex min-w-40 flex-col gap-0.5">
          <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Category</h3>
          <Link href="/shop" onClick={close} className="rounded-md px-2 py-1.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-950">
            All products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              onClick={close}
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
                onClick={close}
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
                onClick={close}
                className="rounded-md px-2 py-1.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-950"
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        <div className="flex min-w-36 flex-col gap-0.5">
          <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Dietary</h3>
          <Link href="/shop?jain=1" onClick={close} className="rounded-md px-2 py-1.5 text-sm hover:bg-amber-50 dark:hover:bg-amber-950">
            Jain Friendly
          </Link>
        </div>
      </div>
    </details>
  );
}
