"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product, ProductSeries } from "@/types/product";
import {
  getProductSeries,
  getSelectedSeries,
  seriesLabel,
} from "@/lib/product-series";
import { formatPrice, wholesaleLabel } from "@/lib/catalog";
import { ProductMedia } from "./ProductMedia";
import { InquiryModal } from "@/components/inquiry/InquiryModal";
import { useCart } from "@/components/cart/CartProvider";
import { cartItemKey } from "@/lib/cart";
export function ProductDetail({
  product,
  products,
}: {
  product: Product;
  products: Product[];
}) {
  const [seriesId, setSeriesId] = useState<ProductSeries>(product.series);
  const [quantity, setQuantity] = useState(1);
  const [selectedColors, setSelectedColors] = useState<
    Partial<Record<ProductSeries, string>>
  >({});
  const seriesOptions = getProductSeries(product);
  const series = getSelectedSeries(product, seriesId);
  const variantId =
    selectedColors[seriesId] ??
    series.variants.find((item) => item.available !== false)?.id ??
    "";
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const cart = useCart();
  const variant = series.variants.find((item) => item.id === variantId);
  // Не показываем фото другого цвета, если у выбранного варианта пока нет изображения.
  const images = variant
    ? [...(variant.image ? [variant.image] : []), ...variant.gallery]
    : [...(series.mainImage ? [series.mainImage] : []), ...series.gallery];
  const uniqueImages = images.filter(
    (item, index) =>
      images.findIndex((other) => other.src === item.src) === index,
  );
  return (
    <div className="product-detail">
      <div className="product-gallery">
        <ProductMedia
          image={uniqueImages[imageIndex] ?? null}
          label={`${product.shortName}${variant ? ` / ${variant.colorName}` : ""}`}
          index={String(product.sortOrder).padStart(2, "0")}
          priority
        />
        {uniqueImages.length > 1 && (
          <div
            className="gallery-thumbs"
            role="group"
            aria-label="Фотографии товара"
          >
            {uniqueImages.map((item, index) => (
              <button
                key={item.src}
                aria-label={`Фото ${index + 1}: ${item.alt}`}
                aria-pressed={index === imageIndex}
                onClick={() => setImageIndex(index)}
              >
                <ProductMedia image={item} label={item.alt} />
              </button>
            ))}
          </div>
        )}
        <p className="gallery-note">
          {variant
            ? "Оттенок и наличие выбранного цвета уточняются при общении."
            : "Внешний вид и наличие уточняются при общении."}
        </p>
      </div>
      <div className="product-info">
        <p className="eyebrow">{product.shortName} / Инвентарь</p>
        <h1>{series.name}</h1>
        <p className="product-description">{series.description}</p>
        <p className="detail-price">
          {formatPrice(
            quantity >= product.wholesaleMinQuantity
              ? product.wholesalePrice
              : product.retailPrice,
          )}
          <span>
            {" "}
            /{" "}
            {product.unitLabel === "комплект"
              ? "комплект из 2 скакалок"
              : "шт."}
          </span>
        </p>
        <p className="wholesale-note">{wholesaleLabel(product)}</p>
        {seriesOptions.length > 1 && (
          <fieldset className="series-selector">
            <legend>Серия / ручки</legend>
            <div>
              {seriesOptions.map((option) => (
                <button
                  type="button"
                  key={option.series}
                  aria-pressed={seriesId === option.series}
                  disabled={option.availability === "unavailable"}
                  onClick={() => {
                    setSeriesId(option.series);
                    setImageIndex(0);
                  }}
                >
                  {seriesLabel(option.series)}
                </button>
              ))}
            </div>
          </fieldset>
        )}
        {series.variants.length > 0 ? (
          <fieldset className="variant-fieldset">
            <legend>
              Цвет{" "}
              <strong aria-live="polite">
                {variant?.colorName ?? "Уточнить"}
              </strong>
            </legend>
            <div className="swatches">
              {series.variants.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="swatch"
                  style={{ "--swatch": item.colorHex } as React.CSSProperties}
                  aria-label={item.colorName}
                  title={item.colorName}
                  aria-pressed={item.id === variantId}
                  disabled={item.available === false}
                  onClick={() => {
                    setSelectedColors((previous) => ({
                      ...previous,
                      [seriesId]: item.id,
                    }));
                    setImageIndex(0);
                  }}
                />
              ))}
            </div>
          </fieldset>
        ) : (
          <p className="gallery-note">
            Цвет и доступные варианты уточним при подборе.
          </p>
        )}
        <div className="detail-actions">
          <label className="product-quantity">
            Количество{" "}
            {product.unitLabel === "комплект" ? "комплектов" : "единиц"}
            <input
              type="number"
              min={1}
              max={10000}
              step={1}
              value={quantity || ""}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </label>
          {quantity >= product.wholesaleMinQuantity && (
            <p className="form-hint" role="status">
              Для этого количества действуют оптовые условия.
            </p>
          )}
          <InquiryModal
            mode="product"
            products={products}
            context={{
              product: product.id,
              series: seriesId,
              quantity:
                Number.isInteger(quantity) && quantity >= 1 && quantity <= 10000
                  ? quantity
                  : undefined,
              variant: variantId,
            }}
            label="Заказать / уточнить наличие"
            title="Уточним детали и наличие"
          />
          <button
            type="button"
            className="button button-outline"
            disabled={
              !Number.isInteger(quantity) || quantity < 1 || quantity > 10000
            }
            onClick={() => {
              cart.add({
                key: cartItemKey(product.id, seriesId, variantId),
                productId: product.id,
                series: seriesId,
                variant: variantId,
                quantity,
              });
              setAdded(true);
            }}
          >
            Добавить в корзину
          </button>
          {added && (
            <p className="form-hint" role="status">
              Добавлено. <Link href="/cart">Открыть корзину →</Link>
            </p>
          )}
          <InquiryModal
            mode="section"
            products={products}
            context={{
              product: product.id,
              series: seriesId,
              variant: variantId,
              customerType: "Тренер",
              quantity: product.wholesaleMinQuantity,
            }}
            label="Подобрать для группы"
            className="button button-outline"
          />
        </div>
        <p className="availability">
          <span aria-hidden="true" />
          {series.availability === "available"
            ? "Наличие подтверждено"
            : series.availability === "unavailable"
              ? "Временно недоступно — обсудим альтернативу"
              : "Наличие уточним лично"}
        </p>
        <ul className="feature-list">
          {(seriesId === product.series ? product.features : []).map(
            (feature) => (
              <li key={feature}>{feature}</li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
