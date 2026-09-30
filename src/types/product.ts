export type ProductCategory = "pvc" | "beaded" | "speed" | "double-dutch";
export type ProductSeries = "ddru" | "loop";
export type ProductAvailability =
  "draft" | "on-request" | "available" | "unavailable";
export type ProductImage = { src: string; alt: string };
export type ProductDescriptionParagraph = {
  text: string;
  emphasizedTerm?: string;
};
export type ProductSpecificationGroup = {
  title: string;
  items: { label: string; value: string }[];
};
export type ProductVariant = {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  image: ProductImage | null;
  gallery: ProductImage[];
  /** null — наличие ещё не подтверждено. */
  available: boolean | null;
  priceOverride?: number | null;
};

/**
 * Серия ручек внутри базовой категории. Черновая серия может хранить свои
 * фотографии, варианты, описание и цены, не попадая в публичный каталог.
 */
export type ProductSeriesConfig = {
  id: string;
  productId: string;
  category: ProductCategory;
  series: ProductSeries;
  handleType: ProductSeries;
  name: string;
  description: string;
  mainImage: ProductImage | null;
  gallery: ProductImage[];
  variants: ProductVariant[];
  retailPriceOverride: number | null;
  wholesalePriceOverride: number | null;
  availability: ProductAvailability;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  series: ProductSeries;
  handleType: ProductSeries;
  shortDescription: string;
  description: string;
  descriptionLead?: string;
  descriptionParagraphs?: ProductDescriptionParagraph[];
  retailPrice: number;
  wholesalePrice: number;
  wholesaleMinQuantity: number;
  unitLabel: "шт." | "комплект";
  mainImage: ProductImage | null;
  gallery: ProductImage[];
  variants: ProductVariant[];
  specifications: { label: string; value: string }[];
  specificationGroups?: ProductSpecificationGroup[];
  /** Дополнительные серии ручек; цены наследуются от товара. */
  seriesOptions?: ProductSeriesConfig[];
  disciplines: string[];
  recommendedFor: string[];
  features: string[];
  coachRecommendation: string;
  contents: string[];
  availability: Exclude<ProductAvailability, "draft">;
  sortOrder: number;
};
