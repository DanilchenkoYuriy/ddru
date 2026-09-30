import Link from "next/link";

export function EducationPreview() {
  return (
    <section className="container education-preview">
      <div className="section-heading">
        <div>
          <p className="eyebrow">06 / Делимся секретами</p>
          <h2>Помогаем двигаться дальше.</h2>
        </div>
        <Link className="text-link" href="/education">
          Обучение и поддержка ↗
        </Link>
      </div>
      <div className="service-strip">
        {[
          "Обучение",
          "Методика",
          "Консультации",
          "Запуск группы",
        ].map((name, index) => (
          <Link key={name} href="/education">
            <span>0{index + 1}</span>
            <h3>{name}</h3>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
