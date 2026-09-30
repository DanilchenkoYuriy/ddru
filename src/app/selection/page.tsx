import { PageIntro } from "@/components/ui/PageIntro";
import { SelectionWizard } from "@/components/selection/SelectionWizard";
import { getProducts } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Подбор скакалки и комплекта",
  "Несколько вопросов о спортсменах, задачах и уровне подготовки — отправная точка для личного подбора DDRu.",
  "/selection",
);
export default function SelectionPage() {
  return (
    <div className="container selection-page">
      <PageIntro
        eyebrow="DDRu / персональный подбор"
        title="Начнём с вашей задачи."
      >
        <p>
          Для первых прыжков, нового элемента или целой секции.
          <br />
          Ответьте на несколько вопросов — дальше разберёмся вместе.
        </p>
      </PageIntro>
      <SelectionWizard products={getProducts()} />
    </div>
  );
}
