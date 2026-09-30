"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Product } from "@/types/product";
import {
  inquiryCustomerTypes,
  type InquiryContext,
  type InquiryDraft,
  type PreparedInquiry,
  type ContactMethod,
} from "@/types/inquiry";
import { contacts } from "@/config/site";
import {
  buildInquiryData,
  buildInquirySummary,
  inquiryValid,
} from "@/lib/inquiry";
import { prepareInquiryHandoff } from "@/lib/inquiry-handoff";
import {
  getProductSeries,
  getSelectedSeries,
  seriesLabel,
} from "@/lib/product-series";
import { formatPrice } from "@/lib/catalog";
import { MessengerLinks } from "@/components/ui/MessengerLinks";
const methods: { id: ContactMethod; label: string }[] = [
  { id: "telegram", label: "Telegram" },
  { id: "vk", label: "VK" },
  { id: "max", label: "MAX" },
  { id: "phone", label: "Телефон" },
];
export function LeadForm({
  products,
  context = {},
}: {
  products: Product[];
  context?: InquiryContext;
}) {
  const id = useId();
  const [draft, setDraft] = useState<InquiryDraft>({
    name: "",
    phoneOrContact: "",
    city: "",
    customerType: context.customerType ?? context.selection?.customerType ?? "",
    product: context.product ?? "",
    series:
      context.series ?? products.find((p) => p.id === context.product)?.series,
    variant: context.variant ?? "",
    quantity: context.quantity ?? (context.product ? 1 : null),
    comment: context.comment ?? "",
    preferredMessenger: "telegram",
  });
  const [prepared, setPrepared] = useState<PreparedInquiry | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const preparedHeading = useRef<HTMLHeadingElement>(null);
  const rememberedColors = useRef<Record<string, string>>({});
  useEffect(() => {
    if (prepared) preparedHeading.current?.focus();
  }, [prepared]);
  const product = products.find((p) => p.id === draft.product);
  const series = product ? getSelectedSeries(product, draft.series) : undefined;
  const options = product ? getProductSeries(product) : [];
  const knownProduct = Boolean(context.product);
  const knownCart = Boolean(context.cartItems?.length);
  const wholesale = Boolean(
    draft.quantity !== null &&
    draft.quantity >= (product?.wholesaleMinQuantity ?? 30),
  );
  function set<K extends keyof InquiryDraft>(key: K, value: InquiryDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inquiryValid(draft) || busy) return;
    setBusy(true);
    setError("");
    try {
      const data = buildInquiryData(
        draft,
        context,
        products,
        window.location.href,
      );
      const result = await prepareInquiryHandoff(data);
      setPrepared(result.inquiry);
    } catch {
      setError(
        "Не удалось подготовить запрос. Попробуйте ещё раз — введённые данные сохранены.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (prepared) {
    const text = buildInquirySummary(prepared, products);
    return (
      <div className="prepared-inquiry">
        <p className="eyebrow">Следующий шаг</p>
        <h3 tabIndex={-1} ref={preparedHeading}>
          Запрос подготовлен
        </h3>
        <p>
          Он ещё не отправлен и не сохранён на сервере. Скопируйте текст и
          передайте нам.
        </p>
        <label htmlFor={`${id}-summary`}>Текст запроса</label>
        <textarea id={`${id}-summary`} readOnly value={text} rows={9} />
        <div className="button-row">
          <button
            className="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(text);
                setCopyStatus("Текст скопирован");
              } catch {
                setCopyStatus("Выделите и скопируйте текст из поля выше.");
              }
            }}
          >
            Скопировать текст ↗
          </button>
          <button
            className="text-link"
            onClick={() => {
              setPrepared(null);
              setCopyStatus("");
            }}
          >
            Изменить данные
          </button>
        </div>
        <p role="status" className="form-hint">
          {copyStatus}
        </p>
        <h4>Выберите удобный способ связи</h4>
        <MessengerLinks
          preferred={
            prepared.preferredMessenger === "phone"
              ? undefined
              : prepared.preferredMessenger
          }
        />
        {prepared.preferredMessenger === "phone" && (
          <p className="form-hint">
            Предпочтение «Телефон» и ваш контакт включены в текст.
            Автоматический обратный звонок пока не подключён.
          </p>
        )}
        {contacts.messengers.every((item) => !item.href) && (
          <p className="form-hint">
            Контакты скоро появятся. Пока сохраните текст запроса.
          </p>
        )}
      </div>
    );
  }
  return (
    <form className="lead-form" onSubmit={submit}>
      <p className="form-hint">
        Обязательны только имя и телефон или удобный контакт. Остальные детали
        можно уточнить при общении.
      </p>
      {knownProduct && product && series && (
        <div className="inquiry-product-summary">
          <strong>{series.name}</strong>
          <p>
            Ручки: {seriesLabel(series.series)} · Цвет:{" "}
            {series.variants.find((v) => v.id === draft.variant)?.colorName ??
              "Уточнить"}
          </p>
          <p>
            {formatPrice(
              wholesale ? product.wholesalePrice : product.retailPrice,
            )}{" "}
            / {product.unitLabel}
          </p>
        </div>
      )}
      {context.selection && (
        <div className="inquiry-product-summary">
          <strong>Ваш подбор</strong>
          <p>
            {context.selection.age} · {context.selection.disciplines.join(", ")}
          </p>
          <p>
            Рекомендуем:{" "}
            {products
              .filter((p) => context.recommendedProductIds?.includes(p.id))
              .map((p) => p.shortName)
              .join(", ")}
          </p>
        </div>
      )}
      {knownCart && (
        <div className="inquiry-product-summary cart-inquiry-summary">
          <strong>Выбрано позиций: {context.cartItems?.length}</strong>
          {context.cartItems?.map((item) => {
            const cartProduct = products.find((p) => p.id === item.productId);
            if (!cartProduct) return null;
            const cartSeries = getSelectedSeries(cartProduct, item.series);
            const cartVariant = cartSeries.variants.find(
              (entry) => entry.id === item.variant,
            );
            return (
              <p key={item.key}>
                {cartSeries.name} · {seriesLabel(item.series)}
                {cartVariant ? ` · ${cartVariant.colorName}` : ""} · {item.quantity}{" "}
                {cartProduct.unitLabel}
              </p>
            );
          })}
          <p>
            Итоговая стоимость рассчитывается в корзине с учётом общего
            количества.
          </p>
        </div>
      )}
      <div className="form-grid">
        <label htmlFor={`${id}-name`}>
          Имя
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            pattern=".*\S.*"
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </label>
        <label htmlFor={`${id}-contact`}>
          Телефон или удобный контакт
          <input
            id={`${id}-contact`}
            name="phoneOrContact"
            required
            maxLength={200}
            pattern=".*\S.*"
            placeholder="Номер, @username или ссылка на профиль"
            value={draft.phoneOrContact}
            onChange={(e) => set("phoneOrContact", e.target.value)}
          />
        </label>
        <fieldset className="messenger-choice full-width">
          <legend>Предпочтительный способ связи</legend>
          <div className="choice-row">
            {methods.map((method) => (
              <label className="choice" key={method.id}>
                <input
                  type="radio"
                  name="preferredMessenger"
                  checked={draft.preferredMessenger === method.id}
                  onChange={() => set("preferredMessenger", method.id)}
                />
                {method.label}
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor={`${id}-city`}>
          Город <span className="optional">/ необязательно</span>
          <input
            id={`${id}-city`}
            name="city"
            autoComplete="address-level2"
            maxLength={100}
            value={draft.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </label>
        <label htmlFor={`${id}-type`}>
          Кто вы?
          <select
            id={`${id}-type`}
            name="customerType"
            value={draft.customerType}
            onChange={(e) =>
              set(
                "customerType",
                e.target.value as InquiryDraft["customerType"],
              )
            }
          >
            <option value="">Не указано</option>
            {inquiryCustomerTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        {!knownProduct && !knownCart && (
          <>
            <label htmlFor={`${id}-product`}>
              Товар
              <select
                id={`${id}-product`}
                name="product"
                value={draft.product}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    product: e.target.value,
                    series: products.find((p) => p.id === e.target.value)
                      ?.series,
                    variant: "",
                  }))
                }
              >
                <option value="">Нужен подбор комплекта</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            {options.length > 1 && (
              <fieldset className="series-selector full-width">
                <legend>Серия / ручки</legend>
                <div>
                  {options.map((option) => (
                    <button
                      type="button"
                      key={option.series}
                      aria-pressed={series?.series === option.series}
                      disabled={option.availability === "unavailable"}
                      onClick={() => {
                        if (series)
                          rememberedColors.current[
                            `${draft.product}:${series.series}`
                          ] = draft.variant;
                        setDraft((prev) => ({
                          ...prev,
                          series: option.series,
                          variant:
                            rememberedColors.current[
                              `${draft.product}:${option.series}`
                            ] ?? "",
                        }));
                      }}
                    >
                      {seriesLabel(option.series)}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {series?.variants.length ? (
              <label htmlFor={`${id}-variant`}>
                Цвет
                <select
                  id={`${id}-variant`}
                  name="variant"
                  value={draft.variant}
                  onChange={(e) => set("variant", e.target.value)}
                >
                  <option value="">Уточнить при подборе</option>
                  {series.variants.map((v) => (
                    <option
                      key={v.id}
                      value={v.id}
                      disabled={v.available === false}
                    >
                      {v.colorName}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </>
        )}
        {!knownCart && (
          <label htmlFor={`${id}-quantity`}>
            Количество{" "}
            {product?.unitLabel === "комплект"
              ? "комплектов (по 2 скакалки)"
              : "единиц"}
            <input
              id={`${id}-quantity`}
              name="quantity"
              type="number"
              min={1}
              max={10000}
              step={1}
              placeholder="Уточним вместе"
              value={draft.quantity ?? ""}
              onChange={(e) =>
                set(
                  "quantity",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </label>
        )}
        {wholesale && (
          <p className="notice full-width" role="status">
            Для этого количества действуют оптовые условия.
            {!product && " Состав смешанного комплекта согласуем отдельно."}
          </p>
        )}
        <label className="full-width" htmlFor={`${id}-comment`}>
          Комментарий <span className="optional">/ необязательно</span>
          <textarea
            id={`${id}-comment`}
            name="comment"
            rows={3}
            maxLength={2000}
            placeholder="Задачи, состав группы, пожелания"
            value={draft.comment}
            onChange={(e) => set("comment", e.target.value)}
          />
        </label>
      </div>
      {error && <p role="alert">{error}</p>}
      <button className="button" type="submit" disabled={busy}>
        {busy ? "Готовим запрос…" : "Подготовить запрос"} ↗
      </button>
      <p className="form-hint">
        Данные остаются на этой странице до перезагрузки. Автоматическая
        отправка пока не подключена.
      </p>
    </form>
  );
}
