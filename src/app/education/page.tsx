import { PageIntro } from "@/components/ui/PageIntro";
import { InquiryModal } from "@/components/inquiry/InquiryModal";
import { getProducts } from "@/lib/catalog";
import { educationServices } from "@/data/education";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Обучение и поддержка тренеров",
  "Обучение, методические материалы, консультации, мастер-классы и запуск секции с поддержкой DDRu.",
  "/education",
);
export default function EducationPage() {
  return (
    <div className="container">
      <PageIntro
        eyebrow="DDRu / знания в движении"
        title="Инвентарь — только начало."
      >
        <p>
          Помогаем тренерам превращать комплект скакалок в понятную
          тренировочную практику. От запуска первой группы до развития секции.
        </p>
      </PageIntro>
      <section className="service-grid" aria-label="Направления обучения">
        {educationServices.map((service, index) => (
          <article id={service.id} key={service.id}>
            <span className="eyebrow">0{index + 1} / Практика</span>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <InquiryModal
              products={getProducts()}
              label="Обсудить формат"
              className="text-link"
              context={{
                customerType: "Тренер",
                comment: `Интересует: ${service.title}.`,
              }}
            />
          </article>
        ))}
      </section>
      <section className="section-banner">
        <div>
          <p className="eyebrow">Программа под вашу задачу</p>
          <h2>
            Начнём с того,
            <br />
            что нужно вашей группе.
          </h2>
          <p>Формат, содержание и сроки обучения согласуем лично.</p>
        </div>
        <InquiryModal
          products={getProducts()}
          label="Обсудить обучение"
          context={{
            customerType: "Тренер",
            comment: "Нужна консультация по обучению.",
          }}
        />
      </section>
    </div>
  );
}
