import Link from "next/link";
import { MessengerLinks } from "./MessengerLinks";
export function SectionCTA({
  title = "Ваша задача. Наш опыт.",
  description = "Расскажите, для кого выбираете скакалку. Поможем с моделью, комплектом и следующими шагами.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="contact-section container">
      <div>
        <p className="eyebrow">Давайте начнём с разговора</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <Link className="text-link" href="/selection">
          Начать подбор <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <MessengerLinks />
    </section>
  );
}
