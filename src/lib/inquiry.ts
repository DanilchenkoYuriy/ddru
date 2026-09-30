import type {
  InquiryContext,
  InquiryDraft,
  PreparedInquiry,
} from "../types/inquiry.ts";
import type { Product } from "../types/product.ts";
import { getSelectedSeries, seriesLabel } from "./product-series.ts";
import {
  isGroupSelection,
  ropeLengthGuidance,
  validQuantity,
} from "./selection.ts";
export function inquiryValid(draft: InquiryDraft): boolean {
  return (
    Boolean(draft.name.trim() && draft.phoneOrContact.trim()) &&
    validQuantity(draft.quantity)
  );
}
export function buildInquiryData(
  draft: InquiryDraft,
  context: InquiryContext,
  products: Product[],
  url: string,
  timestamp = new Date().toISOString(),
): PreparedInquiry {
  const product = products.find((item) => item.id === draft.product);
  const series = product ? getSelectedSeries(product, draft.series) : undefined;
  const variant = series?.variants.find((item) => item.id === draft.variant);
  const cartQuantity = (context.cartItems ?? []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const cartWholesale = cartQuantity >= 30;
  const cartItems = (context.cartItems ?? []).flatMap((item) => {
    const cartProduct = products.find((entry) => entry.id === item.productId);
    if (!cartProduct) return [];
    const cartSeries = getSelectedSeries(cartProduct, item.series);
    const cartVariant = cartSeries.variants.find(
      (entry) => entry.id === item.variant,
    );
    return [
      {
        ...item,
        series: cartSeries.series,
        variant: cartVariant?.id ?? "",
        productName: cartSeries.name,
        color: cartVariant?.colorName ?? null,
        unitLabel: cartProduct.unitLabel,
        unitPrice: cartWholesale
          ? cartProduct.wholesalePrice
          : cartProduct.retailPrice,
      },
    ];
  });
  const source = new URL(url);
  const utm = Object.fromEntries(
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].flatMap((key) => {
      const value = source.searchParams.get(key);
      return value ? [[key, value]] : [];
    }),
  );
  return {
    ...draft,
    name: draft.name.trim(),
    phoneOrContact: draft.phoneOrContact.trim(),
    city: draft.city.trim(),
    comment: draft.comment.trim(),
    series: series?.series,
    variant: variant?.id ?? "",
    product: product?.id ?? "",
    inquiryType:
      context.inquiryType ??
      (context.cartItems
        ? "cart"
        : context.selection
          ? "selection"
          : product
            ? "product"
            : "general"),
    productId: product?.id ?? null,
    productName: series?.name ?? null,
    color: variant?.colorName ?? null,
    retailPrice: product?.retailPrice ?? null,
    wholesalePrice: product?.wholesalePrice ?? null,
    wholesaleMinQuantity: product?.wholesaleMinQuantity ?? null,
    unitPrice: product
      ? draft.quantity !== null &&
        draft.quantity >= product.wholesaleMinQuantity
        ? product.wholesalePrice
        : product.retailPrice
      : null,
    selectionAnswers: context.selection ?? null,
    selection: context.selection,
    recommendedProductIds: [
      ...new Set(context.recommendedProductIds ?? []),
    ].filter((id) => products.some((item) => item.id === id)),
    cartItems,
    cartTotal: cartItems.length
      ? cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      : null,
    cartWholesale,
    sourcePage: source.pathname,
    utm,
    utmSource: utm.utm_source ?? null,
    utmMedium: utm.utm_medium ?? null,
    utmCampaign: utm.utm_campaign ?? null,
    utmContent: utm.utm_content ?? null,
    utmTerm: utm.utm_term ?? null,
    timestamp,
    preparedAt: timestamp,
  };
}
export function buildInquirySummary(
  inquiry: PreparedInquiry,
  products: Product[],
): string {
  const product = products.find((item) => item.id === inquiry.productId);
  const selection = inquiry.selectionAnswers;
  return [
    "Заявка DDRu",
    inquiry.cartItems.length
      ? "Корзина"
      : (inquiry.productName ?? "Нужен подбор комплекта"),
    inquiry.series ? `Серия / ручки: ${seriesLabel(inquiry.series)}` : "",
    inquiry.color ? `Цвет: ${inquiry.color}` : "",
    inquiry.cartItems.length
      ? inquiry.cartItems
          .map(
            (item, index) =>
              `${index + 1}. ${item.productName}; ручки ${seriesLabel(item.series)}${item.color ? `; цвет ${item.color}` : ""}; количество ${item.quantity} ${item.unitLabel}; цена ${item.unitPrice.toLocaleString("ru-RU")} ₽`,
          )
          .join("\n")
      : inquiry.quantity === null
        ? "Количество: уточнить состав"
        : `Количество: ${inquiry.quantity} ${product?.unitLabel ?? "ед."}`,
    inquiry.cartItems.length
      ? `${inquiry.cartWholesale ? "Оптовые цены" : "Розничные цены"}. Общая стоимость: ${inquiry.cartTotal?.toLocaleString("ru-RU")} ₽`
      : "",
    `Имя: ${inquiry.name}`,
    `Контакт: ${inquiry.phoneOrContact}`,
    inquiry.city ? `Город: ${inquiry.city}` : "",
    inquiry.customerType ? `Клиент: ${inquiry.customerType}` : "",
    selection
      ? `Подбор: возраст ${selection.age}; рост ${selection.heightCm}${isGroupSelection(selection) ? `–${selection.heightMaxCm}` : ""} см${isGroupSelection(selection) ? `; спортсменов ${selection.athleteCount}` : ""}; ${selection.disciplines.join(", ")}; уровень ${selection.level}; инвентарь: ${selection.equipment.join(", ")}`
      : "",
    ...(selection ? ropeLengthGuidance(selection) : []),
    inquiry.recommendedProductIds.length
      ? `Рекомендуемые модели: ${products
          .filter((p) => inquiry.recommendedProductIds.includes(p.id))
          .map((p) => p.name)
          .join(", ")}`
      : "",
    inquiry.comment ? `Комментарий: ${inquiry.comment}` : "",
    `Предпочтительная связь: ${inquiry.preferredMessenger === "phone" ? "Телефон" : inquiry.preferredMessenger}`,
  ]
    .filter(Boolean)
    .join("\n");
}
export const inquiryText = buildInquirySummary;
