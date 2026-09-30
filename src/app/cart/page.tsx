import { PageIntro } from "@/components/ui/PageIntro";
import { CartPage } from "@/components/cart/CartPage";
import { getProducts } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Корзина",
  "Список выбранных скакалок для подготовки общего запроса.",
  "/cart",
);

export default function CartRoute() {
  return (
    <div className="container cart-page">
      <PageIntro eyebrow="Корзина" title="Ваш комплект">
        <p>Соберите несколько моделей и отправьте один общий запрос.</p>
      </PageIntro>
      <CartPage products={getProducts()} />
    </div>
  );
}
