import Link from "next/link";
import { ProductMedia } from "@/components/catalog/ProductMedia";
import type { Product } from "@/types/product";

export function HomeHero({ products }: { products: Product[] }) {
  return (
    <section className="container home-hero">
      <div className="hero-copy">
        <p className="eyebrow">Double Dutch Russia / Инвентарь</p>
        <h1 className="hero-title">
          <span className="hero-title-line">Ваша тренировка.</span>
          <span className="hero-title-line">Правильная скакалка.</span>
          <span className="hero-title-line hero-title-accent">
            Лучший результат.
          </span>
        </h1>
        <p className="hero-subtitle">
          <span className="hero-subtitle-line">
            Прыгай выше. Беги быстрей. Становись сильнее.
          </span>
          <span className="hero-subtitle-line">
            Профессиональные скакалки с тренерским опытом.
          </span>
        </p>
        <div className="button-row">
          <Link className="button" href="/catalog">
            Выбрать скакалку ↗
          </Link>
          <Link className="text-link" href="/selection">
            Подобрать ↗
          </Link>
        </div>
      </div>
      <div className="hero-media">
        <ProductMedia
          image={products[1].mainImage}
          label="Бисерная скакалка"
          index="DDRu"
          priority
        />
      </div>
    </section>
  );
}
