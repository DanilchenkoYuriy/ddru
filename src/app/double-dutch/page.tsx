import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { InquiryModal } from "@/components/inquiry/InquiryModal";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getProduct, getProducts } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Double Dutch для вашей секции",
  "Командные прыжки через две скакалки: запуск группы, подбор комплектов и поддержка тренеров DDRu.",
  "/double-dutch",
);
export default function DoubleDutchPage() {
  const product = getProduct("double-dutch-rope")!;
  return (
    <div className="container">
      <PageIntro
        eyebrow="DDRu / командный формат"
        title="Две скакалки. Общий ритм."
      >
        <p>
          Double Dutch — прыжки через две скакалки, которые партнёры вращают
          навстречу друг другу. Здесь важны и прыгающие, и вращающие: результат
          создаёт вся команда.
        </p>
      </PageIntro>
      <div className="dd-page-visual dd-typography" aria-hidden="true">
        <span>
          DOUBLE DUTCH<span className="dd-dot">●</span>
        </span>
        <small>ДВИЖЕНИЕ, КОТОРОЕ ОБЪЕДИНЯЕТ</small>
      </div>
      <section className="content-section">
        <div className="info-grid">
          {[
            [
              "Командная работа",
              "Участники учатся держать общий ритм, договариваться и менять роли.",
            ],
            [
              "Вовлечённая группа",
              "Можно организовать несколько рабочих мест и ротацию, чтобы каждый участвовал в тренировке.",
            ],
            [
              "Зрелищность и перспектива",
              "От простых совместных прыжков — к вольным композициям, скоростным дисциплинам и соревнованиям.",
            ],
          ].map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="content-section dd-equipment">
        <div>
          <p className="eyebrow">Инвентарь для старта</p>
          <h2>
            Один комплект —<br />
            одно место вращения.
          </h2>
          <p>
            Комплект включает две бисерные скакалки по 4,2 м. Количество
            комплектов зависит от числа одновременно работающих групп,
            пространства и плана ротации.
          </p>
          <p>
            Расскажите о составе секции — поможем определить количество
            инвентаря и обсудить первые занятия.
          </p>
          <InquiryModal
            products={getProducts()}
            label="Запустить Double Dutch в своей секции"
            context={{
              product: product.id,
              customerType: "Тренер",
              comment:
                "Хочу запустить Double Dutch. Нужна помощь с количеством комплектов и планом старта.",
            }}
          />
          <Link className="text-link back-result" href="/education">
            Обучение и поддержка ↗
          </Link>
        </div>
        <ProductCard product={product} />
      </section>
    </div>
  );
}
