import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  lastAdded: string | null;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
};

const keyOf = (i: CartItem) => `${i.id}-${i.size ?? ""}-${i.color ?? ""}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAdded: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item, qty = 1) => {
        const items = [...get().items];
        const key = keyOf({ ...item, quantity: qty } as CartItem);
        const idx = items.findIndex((i) => keyOf(i) === key);
        if (idx > -1) {
          items[idx] = { ...items[idx], quantity: items[idx].quantity + qty };
        } else {
          items.push({ ...item, quantity: qty });
        }
        set({ items, lastAdded: item.id, isOpen: true });
        setTimeout(() => set({ lastAdded: null }), 900);
      },
      remove: (key) =>
        set({ items: get().items.filter((i) => keyOf(i) !== key) }),
      updateQty: (key, qty) =>
        set({
          items: get().items.map((i) =>
            keyOf(i) === key ? { ...i, quantity: Math.max(1, qty) } : i
          ),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "cinematic-cart" }
  )
);

export const cartKey = keyOf;