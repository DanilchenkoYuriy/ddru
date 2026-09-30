import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/catalog";
import { ProductMedia } from "./ProductMedia";
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link
        href={`/catalog/${product.slug}`}
        className="product-card-image"
        aria-label={`Подробнее: ${product.name}`}
      >
        <ProductMedia
          image={product.mainImage}
          label={product.shortName}
          index={String(product.sortOrder).padStart(2, "0")}
        />
        <span className="round-arrow" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="product-card-meta">
        <span>
          {product.category === "double-dutch"
            ? "Комплект из 2 скакалок"
            : "Одиночная скакалка"}
        </span>
        <span>
          Опт {formatPrice(product.wholesalePrice)} / {product.unitLabel} от{" "}
          {product.wholesaleMinQuantity}{" "}
          {product.unitLabel === "комплект" ? "компл." : "шт."}
        </span>
      </div>
      <h3>
        <Link href={`/catalog/${product.slug}`}>{product.name}</Link>
      </h3>
      <p>{product.shortDescription}</p>
      <div className="product-card-bottom">
        <span className="price">
          {formatPrice(product.retailPrice)}
          {product.unitLabel === "комплект" && <small> / комплект</small>}
        </span>
        <Link className="text-link" href={`/catalog/${product.slug}`}>
          Подробнее <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
