import type { Product, ProductSeries } from "../types/product.ts";

export const seriesLabel = (series: ProductSeries) =>
  series === "ddru" ? "DDRu" : "LOOP";

export function getProductSeries(product: Product) {
  return [
    {
      series: product.series,
      handleType: product.handleType,
      name: product.name,
      description: product.shortDescription,
      mainImage: product.mainImage,
      gallery: product.gallery,
      variants: product.variants,
      availability: product.availability,
    },
    ...(product.seriesOptions ?? []).filter(
      (item) => item.availability !== "draft",
    ),
  ];
}

export function getSelectedSeries(product: Product, series?: ProductSeries) {
  const options = getProductSeries(product);
  return options.find((item) => item.series === series) ?? options[0];
}
