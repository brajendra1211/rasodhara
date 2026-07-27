"use client";

import { useCart } from "@/store/cart";
import { useCartUi } from "@/store/cart-ui";

export function QuickAddButton({
  productId,
  variantId,
  variantLabel,
  name,
  slug,
  price,
  image,
  disabled,
}: {
  productId: string;
  variantId?: string;
  variantLabel?: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  disabled?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCartUi((s) => s.open);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({ productId, variantId, variantLabel, name, slug, price, image }, 1);
        openCart();
      }}
      className="mt-2 w-full rounded-full bg-amber-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
    >
      {disabled ? "Out of stock" : "Add to Cart"}
    </button>
  );
}
