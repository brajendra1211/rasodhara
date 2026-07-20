"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleWishlist } from "@/lib/actions/wishlist";

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={active ? "#b45309" : "none"}
      stroke={active ? "#b45309" : "currentColor"}
      strokeWidth={1.8}
    >
      <path
        d="M12 20s-7-4.35-9.5-8.8C1 8 2.5 4.5 6 4.5c2 0 3.5 1.2 4.5 2.7 1-1.5 2.5-2.7 4.5-2.7 3.5 0 5 3.5 3.5 6.7C19 15.65 12 20 12 20z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WishlistButton({
  productId,
  path,
  initialActive,
  loggedIn,
  variant = "card",
}: {
  productId: string;
  path: string;
  initialActive: boolean;
  loggedIn: boolean;
  variant?: "card" | "inline";
}) {
  const [active, setActive] = useState(initialActive);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!loggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(path)}`);
      return;
    }
    setActive((a) => !a);
    startTransition(async () => {
      await toggleWishlist(productId, path);
      router.refresh();
    });
  }

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={active}
        className="flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        <HeartIcon active={active} />
        {active ? "Saved to wishlist" : "Save for later"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={active ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={active}
      className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white dark:bg-zinc-900/90 dark:hover:bg-zinc-900"
    >
      <HeartIcon active={active} />
    </button>
  );
}
