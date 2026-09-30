import type { ProductVariant } from "../types/product.ts";

// Фотографии пользователя, без изменений. Оттенки образцов приблизительные.
// terakot в имени исходного файла — бирюзовый цвет на фотографии.
const colors = [
  {
    id: "black",
    colorName: "Чёрный",
    colorHex: "#151b1e",
    filename: "beaded-rope-ddru-black.jpg",
  },
  {
    id: "blue",
    colorName: "Синий",
    colorHex: "#087bc7",
    filename: "beaded-rope-ddru-blue.jpg",
  },
  {
    id: "darkblue-blue-handle",
    colorName: "Тёмно-синий / синие ручки",
    colorHex: "#172c91",
    filename: "beaded-rope-ddru-darkblue-blue-handle.jpg",
  },
  {
    id: "green",
    colorName: "Зелёный",
    colorHex: "#078b39",
    filename: "beaded-rope-ddru-green.jpg",
  },
  {
    id: "lightgreen-blackhandle",
    colorName: "Светло-зелёный / чёрные ручки",
    colorHex: "#42d828",
    filename: "beaded-rope-ddru-lightgreen-blackhandle.jpg",
  },
  {
    id: "neongreen-whitehandle",
    colorName: "Неоновый жёлто-зелёный / белые ручки",
    colorHex: "#e2ef3b",
    filename: "beaded-rope-ddru-neongreen-whitehandle.jpg",
  },
  {
    id: "neonpink",
    colorName: "Неоновый розовый",
    colorHex: "#f5007e",
    filename: "beaded-rope-ddru-neonpink.jpg",
  },
  {
    id: "orange-blackhandle",
    colorName: "Оранжевый / чёрные ручки",
    colorHex: "#f04b0c",
    filename: "beaded-rope-ddru-orange-blackhandle.jpg",
  },
  {
    id: "orange",
    colorName: "Оранжевый",
    colorHex: "#f26416",
    filename: "beaded-rope-ddru-orange.jpg",
  },
  {
    id: "pastelpink-whitehandle",
    colorName: "Пастельный розовый / белые ручки",
    colorHex: "#d986a0",
    filename: "beaded-rope-ddru-pastelpink-whitehandle.jpg",
  },
  {
    id: "purple",
    colorName: "Фиолетовый",
    colorHex: "#8124b4",
    filename: "beaded-rope-ddru-purple.jpg",
  },
  {
    id: "red",
    colorName: "Красный",
    colorHex: "#ce102a",
    filename: "beaded-rope-ddru-rad.jpg",
  },
  {
    id: "turquoise",
    colorName: "Бирюзовый",
    colorHex: "#14b6c1",
    filename: "beaded-rope-ddru-terakot.jpg",
  },
  {
    id: "white",
    colorName: "Белый",
    colorHex: "#f5f5f1",
    filename: "beaded-rope-ddru-white.jpg",
  },
  {
    id: "yellow",
    colorName: "Жёлтый",
    colorHex: "#f4d310",
    filename: "beaded-rope-ddru-yellow.jpg",
  },
];

export const beadedVariants: ProductVariant[] = colors.map(
  ({ id, colorName, colorHex, filename }) => ({
    id,
    name: colorName,
    colorName,
    colorHex,
    image: {
      src: `/assets/products/${filename}`,
      alt: `Бисерная скакалка DDRu — ${colorName.toLowerCase()}`,
    },
    gallery: [],
    available: null,
  }),
);
