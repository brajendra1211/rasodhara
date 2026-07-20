"use client";

import { useState } from "react";

export type ProductInfoTab = {
  label: string;
  content: React.ReactNode;
};

export function ProductInfoTabs({ tabs }: { tabs: ProductInfoTab[] }) {
  const [active, setActive] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 px-1 pb-2 text-sm font-medium ${
              i === active
                ? "border-amber-600 text-amber-700 dark:text-amber-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{tabs[active].content}</div>
    </div>
  );
}
