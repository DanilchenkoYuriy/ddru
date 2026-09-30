import Link from "next/link";

export function ExpertiseSection() {
  return (
    <section className="expertise-section">
      <div className="container expertise-inner">
        <p className="eyebrow">03 / За выбором — практика</p>
        <h2>
          Инвентарь, который
          <br />
          знают <em>все.</em>
        </h2>
        <div>
          <p className="expertise-lead">Подходит для всех видов спорта</p>
          <p>
            Подбираем скакалки с позиции практикующего тренера. Тренировки,
            соревнования и методическая работа помогают понять, что нужно
            спортсмену на каждом этапе.
          </p>
          <Link className="text-link" href="/about">
            О подходе DDRu ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
