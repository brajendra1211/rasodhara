import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  variantId?: string;
  variantLabel?: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clear: () => void;
};

function sameLine(a: { productId: string; variantId?: string }, b: { productId: string; variantId?: string }) {
  return a.productId === b.productId && (a.variantId ?? null) === (b.variantId ?? null);
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => sameLine(i, item));
        if (existing) {
          set({
            items: items.map((i) => (sameLine(i, item) ? { ...i, quantity: i.quantity + quantity } : i)),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },
      removeItem: (productId, variantId) =>
        set({ items: get().items.filter((i) => !sameLine(i, { productId, variantId })) }),
      updateQuantity: (productId, quantity, variantId) =>
        set({
          items: get().items.map((i) => (sameLine(i, { productId, variantId }) ? { ...i, quantity } : i)),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "farmstore-cart" }
  )
);
