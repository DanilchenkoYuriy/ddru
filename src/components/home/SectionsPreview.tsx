import Link from "next/link";

export function SectionsPreview() {
  return (
    <section className="container section-banner home-sections">
      <div>
        <p className="eyebrow">04 / Для секций, школ и федераций</p>
        <h2>Укомплектуем ваш заказ</h2>
        <p>
          Подберём смешанный комплект по возрасту, дисциплинам и числу
          спортсменов.
        </p>
        <Link className="button" href="/for-sections">
          Подобрать для секции ↗
        </Link>
      </div>
      <div className="wholesale-mark">
        <strong>
          30<span>+</span>
        </strong>
        <p>единиц — оптовые условия</p>
      </div>
    </section>
  );
}
