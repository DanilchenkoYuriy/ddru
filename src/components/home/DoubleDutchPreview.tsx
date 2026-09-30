import Link from "next/link";

export function DoubleDutchPreview() {
  return (
    <>
      <p className="container dd-direction-note">
        05 / Запуск направления Double Dutch.
      </p>
      <section className="container double-dutch-feature">
        <div className="dd-typography" aria-hidden="true">
          <span>DOUBLE</span>
          <span>
            DUTCH<span className="dd-dot">●</span>
          </span>
          <small>
            Командная дисциплина с двумя скакалками, которые одновременно
            вращают два участника, а один или несколько спортсменов выполняют
            прыжки и элементы внутри.
          </small>
        </div>
        <div>
          <h2>
            Больше, чем
            <br />
            прыжки.
          </h2>
          <p>
            Две скакалки, общая задача и внимание друг к другу. Командный
            формат, который объединяет группу — от первой тренировки до
            выступления.
          </p>
          <Link className="button button-outline" href="/double-dutch">
            Открыть Double Dutch ↗
          </Link>
        </div>
      </section>
    </>
  );
}
