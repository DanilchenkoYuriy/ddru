import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container not-found">
      <p className="eyebrow">404 / Вне маршрута</p>
      <h1>Здесь пока пусто.</h1>
      <p>Вернёмся туда, где есть подходящий инвентарь.</p>
      <Link className="button" href="/catalog">
        Открыть каталог ↗
      </Link>
    </div>
  );
}
