import type { ProductSeries } from "./product";

export type CartItem = {
  key: string;
  productId: string;
  series: ProductSeries;
  variant: string;
  quantity: number;
};

export type PreparedCartItem = CartItem & {
  productName: string;
  color: string | null;
  unitLabel: "шт." | "комплект";
  unitPrice: number;
};
