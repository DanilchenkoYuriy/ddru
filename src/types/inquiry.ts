import type { Messenger } from "../config/site.ts";
import type { ProductSeries } from "./product.ts";
import type { CartItem, PreparedCartItem } from "./cart.ts";
export const customerTypes = [
  "Спортсмен",
  "Родитель",
  "Тренер",
  "Клуб / секция",
  "Федерация",
] as const;
export type CustomerType = (typeof customerTypes)[number];
export const inquiryCustomerTypes = [
  ...customerTypes,
  "Секция",
  "Клуб",
  "Школа",
  "Другое",
] as const;
export type InquiryCustomerType = (typeof inquiryCustomerTypes)[number];
export type InquiryType =
  "product" | "selection" | "section" | "cart" | "general";
export type ContactMethod = Messenger | "phone";
export const disciplines = [
  "Первые тренировки",
  "Скорость",
  "Вольные",
  "Двойные и тройные прыжки",
  "Трюки",
  "Танцы",
  "Командные дисциплины",
  "Double Dutch",
  "Китайское колесо",
  "Общая подготовка",
  "Школьная лига",
  "Участие в соревнованиях",
] as const;
export type Discipline = (typeof disciplines)[number];
export const levels = [
  "Начинающие",
  "Продолжающие",
  "Соревновательный",
] as const;
export type SelectionState = {
  customerType: CustomerType | "";
  age: string;
  heightCm: number | null;
  heightMaxCm: number | null;
  athleteCount: number;
  disciplines: Discipline[];
  level: (typeof levels)[number] | "";
  equipment: string[];
};
export type InquiryDraft = {
  series?: ProductSeries;
  name: string;
  phoneOrContact: string;
  city: string;
  customerType: InquiryCustomerType | "";
  product: string;
  variant: string;
  quantity: number | null;
  comment: string;
  preferredMessenger: ContactMethod;
};
export type InquiryContext = {
  inquiryType?: InquiryType;
  recommendedProductIds?: string[];
  series?: ProductSeries;
  product?: string;
  variant?: string;
  customerType?: InquiryCustomerType;
  quantity?: number;
  comment?: string;
  selection?: SelectionState;
  cartItems?: CartItem[];
};
export type PreparedInquiry = InquiryDraft & {
  inquiryType: InquiryType;
  productId: string | null;
  productName: string | null;
  color: string | null;
  retailPrice: number | null;
  wholesalePrice: number | null;
  wholesaleMinQuantity: number | null;
  unitPrice: number | null;
  selectionAnswers: SelectionState | null;
  recommendedProductIds: string[];
  cartItems: PreparedCartItem[];
  cartTotal: number | null;
  cartWholesale: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  timestamp: string;
  leadId?: string;
  selection?: SelectionState;
  sourcePage: string;
  utm: Record<string, string>;
  preparedAt: string;
  // Номер заявки добавляет будущий серверный адаптер после сохранения.
  inquiryNumber?: string;
};

export const equipmentOptions = [
  "Бисерные",
  "ПВХ",
  "Скоростные",
  "Double Dutch",
  "Пока ничего",
] as const;
