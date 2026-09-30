import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
export function CatalogGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
