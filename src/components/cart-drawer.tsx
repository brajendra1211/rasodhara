"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";
import { useCartUi } from "@/store/cart-ui";
import { formatINR } from "@/lib/format";

export function CartDrawer() {
  const isOpen = useCartUi((s) => s.isOpen);
  const close = useCartUi((s) => s.close);
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label="Cart"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-out dark:bg-zinc-950 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold">Your Cart ({itemCount})</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-zinc-500">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={close}
              className="rounded-full bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-700"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex flex-1 flex-col divide-y divide-zinc-200 overflow-y-auto px-4 dark:divide-zinc-800">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId ?? "base"}`} className="flex items-center gap-3 py-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={close}
                      className="text-sm font-medium hover:text-amber-700 dark:hover:text-amber-400"
                    >
                      {item.name}
                    </Link>
                    {item.variantLabel && <span className="text-xs text-zinc-500">{item.variantLabel}</span>}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-zinc-300 dark:border-zinc-700">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1), item.variantId)}
                          className="px-2 py-0.5 text-sm"
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <span className="w-5 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="px-2 py-0.5 text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
              <div className="flex justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="rounded-full bg-amber-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-amber-700"
              >
                Proceed to checkout
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="text-center text-sm font-medium text-zinc-600 hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
