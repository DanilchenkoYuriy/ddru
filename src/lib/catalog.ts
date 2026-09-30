import { products } from "../data/products.ts";
import type { Product } from "../types/product.ts";

// Точка замены локального источника на серверный репозиторий данных.
export function getProducts(): Product[] {
  return [...products].sort((a, b) => a.sortOrder - b.sortOrder);
}
export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
export function getRelatedProducts(slug: string): Product[] {
  return getProducts()
    .filter((product) => product.slug !== slug)
    .slice(0, 3);
}
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
export function wholesaleLabel(product: Product): string {
  return product.unitLabel === "комплект"
    ? `Оптовые условия: ${formatPrice(product.wholesalePrice)} / комплект от ${product.wholesaleMinQuantity} комплектов`
    : `Оптовые условия: ${formatPrice(product.wholesalePrice)} от ${product.wholesaleMinQuantity} шт.`;
}
