import { PageIntro } from "@/components/ui/PageIntro";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { SectionCTA } from "@/components/ui/SectionCTA";
import { getProducts } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Каталог скакалок",
  "ПВХ, бисерные, скоростные скакалки и комплекты Double Dutch. Выберите модель и обсудите подбор с тренером.",
  "/catalog",
);
export default function CatalogPage() {
  return (
    <>
      <div className="container editorial-catalog">
        <PageIntro eyebrow="Каталог" title="Скакалки под разные задачи.">
          <p>
            Четыре модели. Разные задачи. Один подход —
            <br className="desktop-break" /> инвентарь, который работает вместе
            с вами.
          </p>
        </PageIntro>
        <CatalogGrid products={getProducts()} />
        <div className="catalog-footnote">
          <p>
            Для секций — оптовые условия от 30 единиц.
            <br />
            Double Dutch: одна единица — комплект из двух скакалок.
          </p>
        </div>
      </div>
      <SectionCTA title="Выбираете для себя или команды?" />
    </>
  );
}
