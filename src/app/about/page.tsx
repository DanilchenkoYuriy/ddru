import { PageIntro } from "@/components/ui/PageIntro";
import { SectionCTA } from "@/components/ui/SectionCTA";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "О проекте Double Dutch Russia",
  "DDRu — подбор инвентаря с позиции практикующего тренера. Тренерская и методическая работа, соревнования и Double Dutch.",
  "/about",
);
export default function AboutPage() {
  return (
    <>
      <div className="container">
        <PageIntro
          eyebrow="DDRu / за инвентарём — человек"
          title="Выбор из практики."
        >
          <p>
            Инвентарь подбирает и использует практикующий тренер. В основе DDRu
            — понимание того, как скакалка работает в руках спортсмена и что
            помогает группе двигаться дальше.
          </p>
        </PageIntro>
        <section className="about-story">
          <div className="editorial-placeholder">
            <span className="eyebrow">Из тренировочной практики</span>
            <p>
              Здесь появится
              <br />
              фото тренера.
            </p>
            <span>Double Dutch Russia</span>
          </div>
          <div>
            <p className="eyebrow">Наш подход</p>
            <h2>
              Сначала задача.
              <br />
              Потом модель.
            </h2>
            <p>
              Для первых тренировок, изучения элементов и скоростной работы
              нужен разный подход. Поэтому мы начинаем с вопросов об опыте,
              дисциплине и составе группы.
            </p>
            <p>
              Помогаем выбрать инвентарь, разобраться с его настройкой и
              продумать следующий шаг — для одного спортсмена или целой секции.
            </p>
          </div>
        </section>
        <section className="content-section">
          <h2>Работа, которая стоит за выбором.</h2>
          <div className="info-grid about-areas">
            {[
              [
                "Тренерская работа",
                "Инвентарь в ежедневной практике и помощь спортсменам.",
              ],
              [
                "Методическая работа",
                "Последовательность обучения и поддержка тренеров.",
              ],
              [
                "Работа с федерацией",
                "Место для подтверждённых совместных проектов и материалов.",
              ],
              [
                "Соревнования",
                "Место для репортажей и опыта применения инвентаря.",
              ],
              ["Double Dutch", "Командный формат и помощь в запуске групп."],
              [
                "Фото и видео",
                "Материалы с тренировок и выступлений появятся здесь.",
              ],
            ].map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <SectionCTA title="Познакомимся через вашу задачу." />
    </>
  );
}
