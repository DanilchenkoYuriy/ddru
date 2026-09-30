import { contacts } from "@/config/site";
import { PageIntro } from "@/components/ui/PageIntro";
import { MessengerLinks } from "@/components/ui/MessengerLinks";
import { LeadForm } from "@/components/inquiry/LeadForm";
import { getProducts } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Контакты DDRu",
  "Обсудите подбор скакалки, комплект для секции или обучение. Telegram, VK и MAX — удобный способ начать разговор с DDRu.",
  "/contacts",
);
export default function ContactsPage() {
  return (
    <div className="container">
      <PageIntro eyebrow="DDRu / на связи" title="Давайте познакомимся.">
        <p>
          Есть модель на примете или только идея для новой группы?
          <br />
          Начнём с разговора.
        </p>
      </PageIntro>
      <div className="contacts-layout">
        <section>
          <h2>Выберите удобный канал.</h2>
          <MessengerLinks />
          <dl className="contact-details">
            <div>
              <dt>Телефон</dt>
              <dd>
                {contacts.phone ? (
                  <a href={`tel:${contacts.phone.replace(/[^+\d]/g, "")}`}>
                    {contacts.phone}
                  </a>
                ) : (
                  "Скоро появится"
                )}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                {contacts.email ? (
                  <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
                ) : (
                  "Скоро появится"
                )}
              </dd>
            </div>
          </dl>
          <p className="form-hint">
            Уточним наличие, подберём состав комплекта и обсудим доставку в ваш
            город.
          </p>
        </section>
        <section className="contact-form-panel">
          <p className="eyebrow">Начните здесь</p>
          <h2>Расскажите о задаче.</h2>
          <LeadForm products={getProducts()} />
        </section>
      </div>
    </div>
  );
}
