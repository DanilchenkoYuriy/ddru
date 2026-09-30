"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import type { Product } from "@/types/product";
import { getSelectedSeries, seriesLabel } from "@/lib/product-series";
import { ProductMedia } from "@/components/catalog/ProductMedia";
import { InquiryModal } from "@/components/inquiry/InquiryModal";
import { formatPrice } from "@/lib/catalog";

export function CartPage({ products }: { products: Product[] }) {
  const { items, updateQuantity, remove, clear } = useCart();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const wholesale = totalQuantity >= 30;
  const total = items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) return sum;
    const unitPrice = wholesale ? product.wholesalePrice : product.retailPrice;
    return sum + unitPrice * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Корзина пока пуста.</h2>
        <p>Добавьте подходящие скакалки, чтобы отправить один общий запрос.</p>
        <Link className="button" href="/catalog">
          Перейти в каталог ↗
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="cart-list">
        {items.map((item) => {
          const product = products.find((entry) => entry.id === item.productId);
          if (!product) return null;
          const series = getSelectedSeries(product, item.series);
          const variant = series.variants.find((entry) => entry.id === item.variant);
          const image = variant?.image ?? series.mainImage;
          const unitPrice = wholesale
            ? product.wholesalePrice
            : product.retailPrice;
          return (
            <article className="cart-item" key={item.key}>
              <Link href={`/catalog/${product.slug}`}>
                <ProductMedia image={image} label={series.name} />
              </Link>
              <div className="cart-item-copy">
                <p className="eyebrow">{product.shortName}</p>
                <h2>{series.name}</h2>
                <p>
                  Ручки: {seriesLabel(item.series)}
                  {variant ? ` · Цвет: ${variant.colorName}` : ""}
                </p>
              </div>
              <label className="cart-quantity">
                Количество {product.unitLabel === "комплект" ? "комплектов" : "шт."}
                <input
                  type="number"
                  min={1}
                  max={10000}
                  step={1}
                  value={item.quantity}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isInteger(value)) updateQuantity(item.key, value);
                  }}
                />
              </label>
              <div className="cart-item-price">
                <strong>{formatPrice(unitPrice)}</strong>
                <span>за {product.unitLabel}</span>
                <small>{formatPrice(unitPrice * item.quantity)}</small>
              </div>
              <button className="text-link cart-remove" onClick={() => remove(item.key)}>
                Удалить
              </button>
            </article>
          );
        })}
      </div>
      <div className="cart-total" aria-live="polite">
        <div>
          <p className="eyebrow">
            {wholesale ? "Оптовые условия" : "Розничные цены"}
          </p>
          <p>
            {totalQuantity} {totalQuantity === 1 ? "единица" : "единиц"}
            {!wholesale && " · оптовые цены применятся от 30 единиц"}
          </p>
        </div>
        <p>
          <span>Общая стоимость</span>
          <strong>{formatPrice(total)}</strong>
        </p>
      </div>
      <div className="cart-actions">
        <button className="text-link" onClick={clear}>Очистить корзину</button>
        <InquiryModal
          products={products}
          mode="cart"
          context={{ cartItems: items }}
          label="Подготовить общий запрос"
          title="Запрос по корзине"
        />
      </div>
    </>
  );
}
