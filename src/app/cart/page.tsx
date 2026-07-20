"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatINR } from "@/lib/format";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Link href="/shop" className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-700">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Your cart</h1>

      <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
        {items.map((item) => (
          <li key={`${item.productId}-${item.variantId ?? "base"}`} className="flex items-center gap-4 py-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <Link href={`/product/${item.slug}`} className="text-sm font-medium hover:text-amber-700 dark:hover:text-amber-400">
                {item.name}
              </Link>
              {item.variantLabel && <span className="text-xs text-zinc-500">{item.variantLabel}</span>}
              <span className="text-sm text-zinc-500">{formatINR(item.price)}</span>

              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center rounded-full border border-zinc-300 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.variantId)}
                    className="px-2.5 py-1 text-sm"
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                    className="px-2.5 py-1 text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>

            <span className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-end gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <div className="flex w-full max-w-xs justify-between text-base font-semibold">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="rounded-full bg-amber-600 px-8 py-2.5 text-sm font-medium text-white hover:bg-amber-700"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
