"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { Messenger } from "@/config/site";
import { contacts } from "@/config/site";
import {
  customerTypes,
  disciplines,
  levels,
  equipmentOptions,
  type SelectionState,
  type PreparedInquiry,
} from "@/types/inquiry";
import {
  recommendProducts,
  recommendationReasons,
  ropeLengthGuidance,
  selectionStepValid,
  isGroupSelection,
  toggleEquipment,
} from "@/lib/selection";
import { formatPrice } from "@/lib/catalog";
import { buildInquiryData, buildInquirySummary } from "@/lib/inquiry";
import { ProductMedia } from "@/components/catalog/ProductMedia";
const steps = [
  "Как с вами связаться?",
  "Кто вы?",
  "Для кого подбираем?",
  "Задача",
  "Уровень",
  "Что уже есть?",
  "Мы рекомендуем",
];
const ages = [
  "До 7 лет",
  "7–9 лет",
  "10–12 лет",
  "13–15 лет",
  "16+",
  "Взрослые",
];
export function SelectionWizard({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [messenger, setMessenger] = useState<Messenger>("max");
  const [prepared, setPrepared] = useState<PreparedInquiry | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [state, setState] = useState<SelectionState>({
    customerType: "",
    age: "",
    heightCm: null,
    heightMaxCm: null,
    athleteCount: 1,
    disciplines: [],
    level: "",
    equipment: [],
  });
  const heading = useRef<HTMLHeadingElement>(null);
  const initial = useRef(true);
  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    heading.current?.focus();
  }, [step]);
  function set<K extends keyof SelectionState>(
    key: K,
    value: SelectionState[K],
  ) {
    setState((prev) => ({ ...prev, [key]: value }));
  }
  function next(e: FormEvent) {
    e.preventDefault();
    const valid =
      step === 0
        ? Boolean(fullName.trim() && phone.trim())
        : selectionStepValid(step - 1, state);
    if (!valid) return;
    if (step === 5) {
      const recommendedProductIds = recommendProducts(state);
      setPrepared(
        buildInquiryData(
          {
            name: fullName,
            phoneOrContact: phone,
            preferredMessenger: messenger,
            city: "",
            customerType: state.customerType,
            product: "",
            variant: "",
            quantity: null,
            comment: "",
          },
          {
            inquiryType: "selection",
            selection: state,
            recommendedProductIds,
          },
          products,
          window.location.href,
        ),
      );
    }
    setStep(step + 1);
  }
  const recommended = products.filter((p) =>
    recommendProducts(state).includes(p.slug),
  );
  const matchingTasks = recommendProducts({
    ...state,
    equipment: ["Пока ничего"],
  });
  const selectedMessenger = contacts.messengers.find(
    (item) => item.id === messenger,
  );
  const inquiryText = prepared ? buildInquirySummary(prepared, products) : "";
  const lengthAdvice = ropeLengthGuidance(state);
  const oneEachTotal = recommended.reduce((sum, p) => sum + p.retailPrice, 0);
  async function copyInquiry() {
    try {
      await navigator.clipboard.writeText(inquiryText);
      setCopyStatus(
        "Текст запроса скопирован. Вставьте его в чат и отправьте.",
      );
    } catch {
      setCopyStatus(
        "Скопируйте текст запроса из поля ниже и отправьте его в чат.",
      );
    }
  }
  return (
    <div className="selection-layout conversion-wizard">
      <aside className="selection-aside">
        <p className="eyebrow">От задачи к инвентарю</p>
        <ol>
          {steps.map((title, index) => (
            <li
              key={title}
              className={
                index === step ? "current" : index < step ? "complete" : ""
              }
              aria-current={index === step ? "step" : undefined}
            >
              <span>
                {index < step ? "✓" : String(index + 1).padStart(2, "0")}
              </span>
              {title}
            </li>
          ))}
        </ol>
        <p>
          Ответы помогут начать подбор. Состав и количество согласуем лично.
        </p>
      </aside>
      <div className="wizard-panel">
        <div className="wizard-progress" aria-hidden="true">
          <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <p className="eyebrow" aria-live="polite">
          {step + 1} / {steps.length}
        </p>
        <h2 ref={heading} tabIndex={-1}>
          {steps[step]}
        </h2>
        {step < 6 ? (
          <form onSubmit={next}>
            {step === 0 && (
              <div className="selection-contact-fields">
                <p className="form-hint">
                  Заполним контакт один раз. После опроса покажем подбор и
                  подготовим сообщение для выбранного мессенджера.
                </p>
                <label>
                  ФИО
                  <input
                    name="fullName"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                  />
                </label>
                <label>
                  Телефон
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={40}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                </label>
                <fieldset className="wizard-choices messenger-choice">
                  <legend>Где вам удобно получить ответ?</legend>
                  {contacts.messengers.map((item) => (
                    <label className="choice" key={item.id}>
                      <input
                        type="radio"
                        name="preferredMessenger"
                        checked={messenger === item.id}
                        onChange={() => setMessenger(item.id)}
                      />
                      {item.label}
                    </label>
                  ))}
                </fieldset>
              </div>
            )}
            {step === 1 && (
              <fieldset className="wizard-choices">
                <legend className="sr-only">Кто вы?</legend>
                {customerTypes.map((value) => (
                  <label className="choice" key={value}>
                    <input
                      type="radio"
                      name="customerType"
                      checked={state.customerType === value}
                      onChange={() => set("customerType", value)}
                    />
                    {value}
                  </label>
                ))}
              </fieldset>
            )}
            {step === 2 && (
              <>
                <fieldset className="wizard-choices">
                  <legend>Возраст спортсменов</legend>
                  {ages.map((value) => (
                    <label className="choice" key={value}>
                      <input
                        type="radio"
                        name="age"
                        checked={state.age === value}
                        onChange={() => set("age", value)}
                      />
                      {value}
                    </label>
                  ))}
                </fieldset>
                <div className="selection-height-fields">
                  <label>
                    {isGroupSelection(state)
                      ? "Рост спортсменов от, см"
                      : "Рост спортсмена, см"}
                    <input
                      type="number"
                      name="heightCm"
                      min={70}
                      max={220}
                      step={1}
                      required
                      value={state.heightCm ?? ""}
                      onChange={(event) =>
                        set(
                          "heightCm",
                          event.target.value === ""
                            ? null
                            : Number(event.target.value),
                        )
                      }
                    />
                  </label>
                  {isGroupSelection(state) && (
                    <label>
                      Рост спортсменов до, см
                      <input
                        type="number"
                        name="heightMaxCm"
                        min={state.heightCm ?? 70}
                        max={220}
                        step={1}
                        required
                        value={state.heightMaxCm ?? ""}
                        onChange={(event) =>
                          set(
                            "heightMaxCm",
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                          )
                        }
                      />
                    </label>
                  )}
                </div>
                {isGroupSelection(state) && (
                  <label className="group-count">
                    Количество спортсменов
                    <input
                      className="athlete-count"
                      type="number"
                      name="athleteCount"
                      min={1}
                      max={10000}
                      step={1}
                      required
                      value={state.athleteCount || ""}
                      onChange={(e) =>
                        set("athleteCount", Number(e.target.value))
                      }
                    />
                    <span className="form-hint">
                      Количество скакалок и комплектов определим отдельно.
                    </span>
                  </label>
                )}
              </>
            )}
            {step === 3 && (
              <fieldset className="wizard-choices">
                <legend>
                  Можно выбрать несколько задач и форматов участия
                </legend>
                {disciplines.map((value) => (
                  <label className="choice" key={value}>
                    <input
                      type="checkbox"
                      name="disciplines"
                      checked={state.disciplines.includes(value)}
                      onChange={() =>
                        set(
                          "disciplines",
                          state.disciplines.includes(value)
                            ? state.disciplines.filter((item) => item !== value)
                            : [...state.disciplines, value],
                        )
                      }
                    />
                    {value === "Вольные" ? "Вольные упражнения" : value}
                  </label>
                ))}
                <p className="form-hint">
                  Школьная лига и соревнования уточняют цель. Если известна
                  дисциплина, отметьте её тоже — подбор будет точнее.
                </p>
              </fieldset>
            )}
            {step === 4 && (
              <fieldset className="wizard-choices">
                <legend className="sr-only">Уровень подготовки</legend>
                {levels.map((value) => (
                  <label className="choice" key={value}>
                    <input
                      type="radio"
                      name="level"
                      checked={state.level === value}
                      onChange={() => set("level", value)}
                    />
                    {value === "Начинающие"
                      ? "Начинающий"
                      : value === "Продолжающие"
                        ? "Продолжающий"
                        : value}
                  </label>
                ))}
              </fieldset>
            )}
            {step === 5 && (
              <fieldset className="wizard-choices">
                <legend>Отметьте имеющийся инвентарь</legend>
                {equipmentOptions.map((value) => (
                  <label className="choice" key={value}>
                    <input
                      type="checkbox"
                      name="equipment"
                      checked={state.equipment.includes(value)}
                      onChange={() =>
                        set(
                          "equipment",
                          toggleEquipment(state.equipment, value),
                        )
                      }
                    />
                    {value}
                  </label>
                ))}
              </fieldset>
            )}
            <div className="wizard-actions">
              {step > 0 && (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setStep(step - 1)}
                >
                  ← Назад
                </button>
              )}
              <button
                className="button"
                type="submit"
                disabled={
                  step === 0
                    ? !fullName.trim() || !phone.trim()
                    : !selectionStepValid(step - 1, state)
                }
              >
                {step === 5 ? "Посмотреть результат" : "Продолжить"} →
              </button>
            </div>
          </form>
        ) : (
          <div className="selection-result">
            <p>
              {recommended.length > 0
                ? "Эти модели отвечают выбранным задачам и дополняют имеющийся инвентарь. Точный состав, количество каждой модели и ручки DDRu или LOOP обсудим вместе."
                : matchingTasks.length > 0
                  ? "Под выбранные задачи у вас уже есть подходящие модели. Если нужна помощь с составом или количеством, обсудим это вместе."
                  : "Для выбранного формата участия нужно уточнить дисциплину. Сотрудник поможет составить персональный комплект после вашего сообщения."}
            </p>
            <dl className="selection-summary">
              <div>
                <dt>Для кого</dt>
                <dd>
                  {state.customerType} · {state.age}
                  {` · рост ${state.heightCm}${isGroupSelection(state) ? `–${state.heightMaxCm}` : ""} см`}
                  {isGroupSelection(state)
                    ? ` · ${state.athleteCount} чел.`
                    : ""}
                </dd>
              </div>
              <div>
                <dt>Задачи</dt>
                <dd>
                  {state.disciplines.join(", ")} · {state.level}
                </dd>
              </div>
              <div>
                <dt>Уже есть</dt>
                <dd>{state.equipment.join(", ")}</dd>
              </div>
            </dl>
            {lengthAdvice.length > 0 && (
              <div className="selection-length-advice notice">
                <strong>Ориентир по длине</strong>
                {lengthAdvice.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            )}
            {state.level === "Начинающие" &&
              state.disciplines.some((task) => task !== "Double Dutch") && (
                <p className="selection-start-advice">
                  Для первых прыжков начните с бисерной скакалки: её легче
                  ощущать и контролировать. Если она уже есть, используйте её
                  для базы и подберите следующую модель под выбранную задачу.
                </p>
              )}
            <div className="recommendation-list">
              {recommended.map((p) => (
                <article className="recommendation" key={p.id}>
                  <Link
                    href={`/catalog/${p.slug}`}
                    aria-label={`Подробнее: ${p.name}`}
                  >
                    <ProductMedia image={p.mainImage} label={p.name} />
                  </Link>
                  <div>
                    <h3>
                      <Link href={`/catalog/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <p>{recommendationReasons[p.slug]}</p>
                    <p className="price">
                      {formatPrice(p.retailPrice)}
                      {p.unitLabel === "комплект" && <small> / комплект</small>}
                    </p>
                    <p className="form-hint">
                      Опт от {p.wholesaleMinQuantity}:{" "}
                      {formatPrice(p.wholesalePrice)} / {p.unitLabel}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            {recommended.length > 0 && (
              <div className="selection-estimate">
                <strong>Ориентир: {formatPrice(oneEachTotal)}</strong>
                <p>
                  По одной единице каждой рекомендованной модели по розничной
                  цене. Это пример расчёта, не итог заказа. Опт действует от 30
                  единиц; количество спортсменов не определяет количество
                  скакалок автоматически.
                </p>
              </div>
            )}
            {prepared && (
              <div className="selection-handoff">
                <h3>Обсудим точный комплект</h3>
                <p>
                  Ваш запрос подготовлен. Он ещё не отправлен: откройте
                  выбранный чат, вставьте текст и нажмите «Отправить». После
                  этого сотрудник свяжется с вами в {selectedMessenger?.label}.
                </p>
                <label>
                  Текст запроса
                  <textarea readOnly rows={9} value={inquiryText} />
                </label>
                <div className="button-row">
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={copyInquiry}
                  >
                    Скопировать запрос
                  </button>
                  {selectedMessenger?.href && (
                    <a
                      className="button"
                      href={selectedMessenger.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => void copyInquiry()}
                    >
                      Открыть {selectedMessenger.label} ↗
                    </a>
                  )}
                </div>
                <p className="form-hint" role="status">
                  {copyStatus}
                </p>
              </div>
            )}
            <button
              type="button"
              className="text-link back-result"
              onClick={() => {
                setPrepared(null);
                setCopyStatus("");
                setStep(5);
              }}
            >
              ← Изменить ответы
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
