import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/types/product";

export function HomeCollection({ products }: { products: Product[] }) {
  return (
    <section className="container home-catalog">
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / Коллекция</p>
          <h2>
            Четыре модели.
            <br />
            Под ваши задачи.
          </h2>
        </div>
        <Link className="text-link" href="/catalog">
          Весь каталог ↗
        </Link>
      </div>
      <div className="product-grid four-columns">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
