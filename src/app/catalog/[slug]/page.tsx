import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProduct,
  getProducts,
  getRelatedProducts,
  wholesaleLabel,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
import { ProductDetail } from "@/components/catalog/ProductDetail";
import { ProductCard } from "@/components/catalog/ProductCard";
import { InquiryModal } from "@/components/inquiry/InquiryModal";
import type { ProductDescriptionParagraph } from "@/types/product";

function DescriptionParagraph({
  paragraph,
}: {
  paragraph: ProductDescriptionParagraph;
}) {
  if (!paragraph.emphasizedTerm) return <p>{paragraph.text}</p>;
  const [before, after = ""] = paragraph.text.split(paragraph.emphasizedTerm);
  return (
    <p>
      {before}
      <strong>{paragraph.emphasizedTerm}</strong>
      {after}
    </p>
  );
}

export const dynamicParams = false;
export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = getProduct((await params).slug);
  return product
    ? pageMetadata(
        product.name,
        product.shortDescription,
        `/catalog/${product.slug}`,
      )
    : {};
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  return (
    <div className="container product-page">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <span aria-hidden="true">/</span>
        <Link href="/catalog">Каталог</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.shortName}</span>
      </nav>
      <ProductDetail product={product} products={getProducts()} />
      <section className="product-editorial product-purpose">
        <div>
          <p className="eyebrow">01 / В тренировке</p>
          <h2>Для чего подходит</h2>
          {product.seriesOptions?.length ? (
            <p className="form-hint">Об исполнении DDRu</p>
          ) : null}
        </div>
        <div>
          {product.descriptionLead ? (
            <div className="product-long-description">
              <p>
                <strong>{product.descriptionLead}</strong>
              </p>
              {product.descriptionParagraphs?.map((paragraph) => (
                <DescriptionParagraph
                  key={paragraph.text}
                  paragraph={paragraph}
                />
              ))}
            </div>
          ) : (
            <>
              <p>{product.description}</p>
              <ul className="plain-list">
                {product.recommendedFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          <p className="form-hint">
            Дисциплины: {product.disciplines.join(" · ")}
          </p>
        </div>
      </section>
      <section className="product-editorial product-facts">
        <div>
          <p className="eyebrow">02 / В деталях</p>
          <h2>Характеристики</h2>
          {product.seriesOptions?.length ? (
            <p className="form-hint">
              Характеристики исполнения DDRu. Параметры LOOP уточним при
              общении.
            </p>
          ) : null}
        </div>
        <div>
          {product.specificationGroups ? (
            <div className="specification-groups">
              {product.specificationGroups.map((group) => (
                <section className="specification-group" key={group.title}>
                  <h3>{group.title}</h3>
                  <dl className="specifications">
                    {group.items.map(({ label, value }) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          ) : (
            <>
              <dl className="specifications">
                {product.specifications.map(({ label, value }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <h3>Комплектация</h3>
              <ul className="plain-list">
                {product.contents.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
      <aside className="product-editorial coach-note">
        <div>
          <p className="eyebrow">03 / Взгляд тренера</p>
          <h2>Рекомендация тренера</h2>
        </div>
        <p>{product.coachRecommendation}</p>
      </aside>
      <section className="section-banner">
        <div>
          <p className="eyebrow">04 / Для секций</p>
          <h2>Нужно 30 и больше?</h2>
          <p>
            {wholesaleLabel(product)} — для секций, школ, клубов и федераций.
          </p>
        </div>
        <InquiryModal
          mode="section"
          products={getProducts()}
          label="Получить расчёт"
          context={{
            product: product.id,
            customerType: "Тренер",
            quantity: product.wholesaleMinQuantity,
          }}
        />
      </section>
      <section className="related-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">05 / Коллекция</p>
            <h2>Другие модели</h2>
          </div>
          <Link className="text-link" href="/catalog">
            Весь каталог ↗
          </Link>
        </div>
        <div className="product-grid three-columns">
          {getRelatedProducts(product.slug).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
