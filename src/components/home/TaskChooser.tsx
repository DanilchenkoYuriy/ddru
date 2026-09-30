import Link from "next/link";
const tasks = [
  {
    name: "Первые тренировки",
    href: "/catalog/beaded-rope",
  },
  {
    name: "Вольные",
    href: "/catalog/pvc-rope",
  },
  {
    name: "Скорость/Двойные/Тройные",
    href: "/catalog/speed-rope",
  },
  {
    name: "Китайское колесо",
    href: "/catalog/beaded-rope",
  },
  {
    name: "Дабл Датч",
    href: "/double-dutch",
  },
];

export function TaskChooser() {
  return (
    <section className="container task-section">
      <div>
        <p className="eyebrow">02 / Осознанный выбор</p>
        <h2>
          Какую скакалку
          <br />
          выбрать?
        </h2>
        <p>Расскажите о целях — мы подберём модель.</p>
        <Link className="button button-outline" href="/selection">
          Пройти подбор ↗
        </Link>
      </div>
      <div className="task-list">
        {tasks.map((task, index) => (
          <Link href={task.href} key={task.name}>
            <span className="task-number">0{index + 1}</span>
            <div>
              <h3>{task.name}</h3>
            </div>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
