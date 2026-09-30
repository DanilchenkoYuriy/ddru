import type {
  ProductCategory,
  ProductSeriesConfig,
  ProductVariant,
} from "../types/product.ts";

function loopVariant(
  id: string,
  colorName: string,
  colorHex: string,
  filename: string,
  category: ProductCategory,
): ProductVariant {
  return {
    id,
    name: colorName,
    colorName,
    colorHex,
    image: {
      src: `/assets/products/loop/${filename}`,
      alt: `${category === "beaded" ? "Бисерная" : "ПВХ"} скакалка серии LOOP — ${colorName.toLowerCase()} ручки`,
    },
    gallery: [],
    available: null,
    priceOverride: null,
  };
}

/** LOOP наследует цену товара. Наличие уточняется при общении. */
const beadedLoopVariants = [
  loopVariant(
    "blue-handle",
    "Синие",
    "#5375b7",
    "beaded-rope-loop-blue.jpg",
    "beaded",
  ),
  loopVariant(
    "pink-handle",
    "Розовые",
    "#dca7bd",
    "beaded-rope-loop-pink.jpg",
    "beaded",
  ),
];

const pvcLoopVariants = [
  loopVariant(
    "blue-handle",
    "Синие",
    "#5375b7",
    "pvc-rope-loop-blue.jpg",
    "pvc",
  ),
  loopVariant(
    "pink-handle",
    "Розовые",
    "#dca7bd",
    "pvc-rope-loop-pink.jpg",
    "pvc",
  ),
];

export const loopSeries: ProductSeriesConfig[] = [
  {
    id: "beaded-rope-loop",
    productId: "beaded-rope",
    category: "beaded",
    series: "loop",
    handleType: "loop",
    name: "Бисерная скакалка LOOP",
    description: "Бисерная скакалка с ручками LOOP. Синие или розовые ручки.",
    mainImage: beadedLoopVariants[0].image,
    gallery: [],
    variants: beadedLoopVariants,
    retailPriceOverride: null,
    wholesalePriceOverride: null,
    availability: "on-request",
  },
  {
    id: "pvc-rope-loop",
    productId: "pvc-rope",
    category: "pvc",
    series: "loop",
    handleType: "loop",
    name: "ПВХ скакалка LOOP",
    description: "ПВХ скакалка с ручками LOOP. Синие или розовые ручки.",
    mainImage: pvcLoopVariants[0].image,
    gallery: [],
    variants: pvcLoopVariants,
    retailPriceOverride: null,
    wholesalePriceOverride: null,
    availability: "on-request",
  },
];
