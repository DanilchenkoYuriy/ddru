import type { CartItem } from "../types/cart.ts";
import type { ProductSeries } from "../types/product.ts";

export const cartItemKey = (
  productId: string,
  series: ProductSeries,
  variant: string,
) => `${productId}:${series}:${variant || "default"}`;

export function addCartItem(items: CartItem[], incoming: CartItem): CartItem[] {
  const existing = items.find((item) => item.key === incoming.key);
  if (!existing) return [...items, incoming];
  return items.map((item) =>
    item.key === incoming.key
      ? { ...item, quantity: Math.min(10000, item.quantity + incoming.quantity) }
      : item,
  );
}

export function validCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.key === "string" &&
    typeof item.productId === "string" &&
    (item.series === "ddru" || item.series === "loop") &&
    typeof item.variant === "string" &&
    Number.isInteger(item.quantity) &&
    Number(item.quantity) >= 1 &&
    Number(item.quantity) <= 10000
  );
}
