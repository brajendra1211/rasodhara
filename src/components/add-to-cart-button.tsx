"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useCartUi } from "@/store/cart-ui";
import { formatINR } from "@/lib/format";
import { ConfettiBurst, generateConfettiDots, type ConfettiDot } from "@/components/confetti-burst";

export type ProductVariantOption = {
  id: string;
  label: string;
  price: number;
  mrp: number;
  stock: number;
};

export function AddToCartButton({
  productId,
  name,
  slug,
  price,
  mrp,
  image,
  stock,
  variants = [],
}: {
  productId: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string;
  stock: number;
  variants?: ProductVariantOption[];
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCartUi((s) => s.open);
  const router = useRouter();

  const defaultVariantId = variants.length > 0 ? variants[0].id : undefined;
  const [variantId, setVariantId] = useState<string | undefined>(defaultVariantId);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const [confettiDots, setConfettiDots] = useState<ConfettiDot[]>([]);

  const selected = useMemo(() => {
    if (variants.length === 0) return { id: undefined, label: undefined, price, mrp, stock };
    const variant = variants.find((v) => v.id === variantId) ?? variants[0];
    return { id: variant.id, label: variant.label, price: variant.price, mrp: variant.mrp, stock: variant.stock };
  }, [variantId, variants, price, mrp, stock]);

  const discount =
    selected.mrp > selected.price ? Math.round((1 - selected.price / selected.mrp) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {variants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariantId(v.id)}
              disabled={v.stock <= 0}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
                variantId === v.id
                  ? "border-amber-600 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-300"
                  : "border-zinc-300 text-zinc-700 hover:border-amber-500 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {v.label} &middot; {formatINR(v.price)}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-semibold">{formatINR(selected.price)}</span>
        {discount > 0 && (
          <>
            <span className="text-base text-zinc-400 line-through">{formatINR(selected.mrp)}</span>
            <span className="text-sm font-medium text-amber-700 dark:text-amber-400">{discount}% off</span>
          </>
        )}
      </div>

      {selected.stock <= 0 ? (
        <button
          disabled
          className="w-fit rounded-full bg-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        >
          Out of stock
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          {selected.stock <= 5 && (
            <p className="text-xs font-medium text-red-600">Only {selected.stock} left in stock</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-zinc-300 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1.5 text-sm"
              aria-label="Decrease quantity"
            >
              &minus;
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(selected.stock, q + 1))}
              className="px-3 py-1.5 text-sm"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="relative">
            <ConfettiBurst burstId={burstId} dots={confettiDots} />
            <button
              type="button"
              onClick={() => {
                addItem(
                  { productId, variantId: selected.id, variantLabel: selected.label, name, slug, price: selected.price, image },
                  quantity
                );
                setAdded(true);
                setConfettiDots(generateConfettiDots());
                setBurstId((id) => id + 1);
                openCart();
                setTimeout(() => setAdded(false), 1500);
              }}
              className={`rounded-full bg-amber-600 px-6 py-2.5 text-sm font-medium text-white transition-transform hover:bg-amber-700 ${
                added ? "scale-105" : ""
              }`}
            >
              {added ? "Added! ✓" : "Add to cart"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              addItem(
                { productId, variantId: selected.id, variantLabel: selected.label, name, slug, price: selected.price, image },
                quantity
              );
              router.push("/cart");
            }}
            className="rounded-full border border-amber-600 px-6 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
          >
            Buy now
          </button>
          </div>
        </div>
      )}
    </div>
  );
}
