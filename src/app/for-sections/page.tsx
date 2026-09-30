import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { InquiryModal } from "@/components/inquiry/InquiryModal";
import { ProductMedia } from "@/components/catalog/ProductMedia";
import { getProducts, formatPrice } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Для секций, школ и федераций",
  "Подбор комплектов для тренеров, секций, школ и федераций. Оптовые условия от 30 единиц.",
  "/for-sections",
);
export default function SectionsPage() {
  const products = getProducts();
  const context = {
    customerType: "Тренер" as const,
    comment:
      "Нужен комплект для группы. Состав и количество подберём индивидуально.",
  };
  return (
    <div className="container sections-page">
      <PageIntro eyebrow="Для секций" title="Соберём комплект под вашу группу">
        <p>
          Подбор скакалок зависит от роста, возраста спортсменов, задач и
          уровня подготовки.
        </p>
        <div className="button-row">
          <InquiryModal
            products={products}
            mode="section"
            label="Получить расчёт"
            context={context}
          />
          <Link className="text-link" href="/selection">
            Подобрать комплект ↗
          </Link>
        </div>
      </PageIntro>
      <p className="section-audience">
        Для тренеров, спортивных секций, клубов, школ, образовательных
        учреждений и региональных федераций.
      </p>
      <section className="section-editorial">
        <div>
          <p className="eyebrow">01 / Под задачу</p>
          <h2>
            Разные скакалки.
            <br />
            Разные задачи.
          </h2>
          <p>Подберём инвентарь под вашу группу.</p>
        </div>
        <div className="section-models">
          {products.map((p) => (
            <article key={p.id}>
              <Link
                href={`/catalog/${p.slug}`}
                aria-label={`Подробнее: ${p.name}`}
              >
                <ProductMedia image={p.mainImage} label={p.name} />
              </Link>
              <div>
                <h3>
                  {p.id === "double-dutch-rope"
                    ? "Double Dutch (Дабл Датч)"
                    : p.shortName}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section-editorial">
        <div>
          <p className="eyebrow">02 / Условия</p>
          <h2>
            Оптовые условия
            <br />
            от 30 единиц
          </h2>
          <p>Скакалки DDRu и LOOP стоят одинаково в рамках модели.</p>
        </div>
        <div>
          <div className="wholesale-prices">
            {products.map((p) => (
              <div key={p.id}>
                <h3>{p.shortName}</h3>
                <p>
                  <strong>{formatPrice(p.wholesalePrice)}</strong>
                  {p.unitLabel === "комплект" && <span> / комплект</span>}
                  <small>Розница {formatPrice(p.retailPrice)}</small>
                </p>
              </div>
            ))}
          </div>
          <p className="form-hint">
            Double Dutch: одна единица — комплект из двух скакалок.
          </p>
        </div>
      </section>
      <section className="section-editorial">
        <div>
          <p className="eyebrow">03 / Пример</p>
          <h2>
            Пример комплекта
            <br />
            для секции
          </h2>
        </div>
        <div>
          <p className="section-large-text">
            30 единиц могут быть смешанными: бисерные, ПВХ, скоростные и Double
            Dutch.
          </p>
          <p>
            Это пример формата, а не универсальная рекомендация. Состав зависит
            от задач группы — его подберём индивидуально. Учтём и тот инвентарь,
            который уже есть.
          </p>
          <Link className="text-link" href="/selection">
            Рассказать о группе ↗
          </Link>
        </div>
      </section>
      <section className="section-editorial">
        <div>
          <p className="eyebrow">04 / Сопровождение</p>
          <h2>Не только инвентарь.</h2>
        </div>
        <div className="editorial-list">
          {[
            [
              "Помощь в подборе",
              "Сопоставим возраст, задачи и имеющиеся скакалки. Дадим рекомендации по использованию.",
            ],
            ["Запуск Double Dutch", "Обсудим старт группы и вопросы тренера."],
            [
              "Методика и обучение",
              "На консультации обсудим доступные методические материалы и возможность обучения тренера. Формат и условия согласуем отдельно.",
            ],
          ].map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-process">
        <p className="eyebrow">05 / Как это работает</p>
        <h2>От группы — к комплекту.</h2>
        <ol>
          {[
            "Рассказываете о группе",
            "Подбираем комплект",
            "Согласовываем состав и стоимость",
            "Счёт / договор / отправка",
          ].map((text, i) => (
            <li key={text}>
              <span>0{i + 1}</span>
              <h3>{text}</h3>
            </li>
          ))}
        </ol>
      </section>
      <section className="section-final">
        <div>
          <p className="eyebrow">Начнём с вашей группы</p>
          <h2>Состав подберём вместе.</h2>
          <p>
            Расскажите о спортсменах и задачах. Подготовим основу для расчёта.
          </p>
        </div>
        <InquiryModal
          products={products}
          mode="section"
          label="Получить расчёт для секции"
          context={context}
        />
      </section>
    </div>
  );
}
