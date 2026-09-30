"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/types/cart";
import { addCartItem, validCartItem } from "@/lib/cart";

const storageKey = "ddru-cart";

type CartValue = {
  items: CartItem[];
  count: number;
  add: (item: CartItem) => void;
  updateQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored: unknown = JSON.parse(
          localStorage.getItem(storageKey) ?? "[]",
        );
        if (Array.isArray(stored)) setItems(stored.filter(validCartItem));
      } catch {
        localStorage.removeItem(storageKey);
      }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      add: (item) => setItems((current) => addCartItem(current, item)),
      updateQuantity: (key, quantity) =>
        setItems((current) =>
          current.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.max(1, Math.min(10000, quantity)) }
              : item,
          ),
        ),
      remove: (key) =>
        setItems((current) => current.filter((item) => item.key !== key)),
      clear: () => setItems([]),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
