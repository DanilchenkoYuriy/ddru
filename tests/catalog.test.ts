import test from "node:test";
import assert from "node:assert/strict";
import { getProducts, getProduct, wholesaleLabel } from "../src/lib/catalog.ts";
import {
  getProductSeries,
  getSelectedSeries,
} from "../src/lib/product-series.ts";
import {
  recommendProducts,
  selectionStepValid,
  toggleEquipment,
  isGroupSelection,
  ropeLengthGuidance,
} from "../src/lib/selection.ts";
import {
  buildInquiryData,
  buildInquirySummary,
  inquiryValid,
} from "../src/lib/inquiry.ts";
import { prepareInquiryHandoff } from "../src/lib/inquiry-handoff.ts";
import { addCartItem, cartItemKey } from "../src/lib/cart.ts";
import type {
  Discipline,
  InquiryDraft,
  SelectionState,
} from "../src/types/inquiry.ts";
const answers: SelectionState = {
  customerType: "Тренер",
  age: "7–9 лет",
  heightCm: 130,
  heightMaxCm: 155,
  athleteCount: 30,
  disciplines: ["Double Dutch"],
  level: "Начинающие",
  equipment: ["Бисерные"],
};
const draft: InquiryDraft = {
  name: " Проверка ",
  phoneOrContact: " @example ",
  city: "Казань",
  customerType: "Тренер",
  product: "beaded-rope",
  series: "loop",
  variant: "pink-handle",
  quantity: 29,
  comment: "",
  preferredMessenger: "phone",
};
test("Каталог сохраняет четыре товара, цены и порог", () => {
  assert.equal(getProducts().length, 4);
  for (const [slug, retail, wholesale] of [
    ["pvc-rope", 1190, 900],
    ["beaded-rope", 1290, 1000],
    ["speed-rope", 1590, 1200],
    ["double-dutch-rope", 2990, 2500],
  ] as const) {
    const p = getProduct(slug)!;
    assert.equal(p.retailPrice, retail);
    assert.equal(p.wholesalePrice, wholesale);
    assert.equal(p.wholesaleMinQuantity, 30);
    assert.ok(p.mainImage);
  }
});
test("LOOP остаётся внутри товаров с отдельными палитрами и общими ценами", () => {
  for (const [slug, count] of [
    ["beaded-rope", 15],
    ["pvc-rope", 1],
  ] as const) {
    const p = getProduct(slug)!;
    assert.deepEqual(
      getProductSeries(p).map((s) => s.series),
      ["ddru", "loop"],
    );
    assert.equal(getSelectedSeries(p).variants.length, count);
    const s = getSelectedSeries(p, "loop");
    assert.equal(s.variants.length, 2);
    assert.ok(
      s.variants.every(
        (v) => v.available === null && v.image?.src.includes("/loop/"),
      ),
    );
    assert.equal(p.seriesOptions![0].retailPriceOverride, null);
  }
});
for (const [task, expected] of [
  ["Первые тренировки", ["beaded-rope"]],
  ["Вольные", ["beaded-rope", "pvc-rope"]],
  ["Скорость", ["beaded-rope", "pvc-rope", "speed-rope"]],
  ["Double Dutch", ["double-dutch-rope"]],
  ["Китайское колесо", ["beaded-rope"]],
  ["Общая подготовка", ["beaded-rope", "pvc-rope"]],
  ["Двойные и тройные прыжки", ["beaded-rope", "pvc-rope", "speed-rope"]],
  ["Трюки", ["beaded-rope", "pvc-rope"]],
  ["Танцы", ["beaded-rope", "pvc-rope"]],
  ["Командные дисциплины", ["beaded-rope", "double-dutch-rope"]],
  ["Школьная лига", []],
  ["Участие в соревнованиях", []],
] as [Discipline, string[]][]) {
  test(`Рекомендация: ${task}`, () =>
    assert.deepEqual(
      recommendProducts({
        ...answers,
        disciplines: [task],
        equipment: ["Пока ничего"],
      }),
      expected,
    ));
}
test("Несколько задач объединяются без дублей и не зависят от порядка", () => {
  const tasks: Discipline[] = [
    "Скорость",
    "Вольные",
    "Double Dutch",
    "Китайское колесо",
  ];
  const result = recommendProducts({
    ...answers,
    disciplines: tasks,
    equipment: ["Пока ничего"],
  });
  assert.equal(result.length, 4);
  assert.deepEqual(
    new Set(result),
    new Set(
      recommendProducts({
        ...answers,
        disciplines: tasks.reverse(),
        equipment: ["Пока ничего"],
      }),
    ),
  );
  assert.deepEqual(recommendProducts({ ...answers, disciplines: [] }), []);
});
test("Подбор исключает имеющиеся модели и сохраняет подходящие остальные", () => {
  const speedSelection = {
    ...answers,
    disciplines: ["Скорость"] as Discipline[],
  };
  assert.deepEqual(recommendProducts(speedSelection), [
    "pvc-rope",
    "speed-rope",
  ]);
  assert.deepEqual(
    recommendProducts({ ...speedSelection, equipment: ["ПВХ"] }),
    ["beaded-rope", "speed-rope"],
  );
  assert.deepEqual(
    recommendProducts({
      ...speedSelection,
      equipment: ["Бисерные", "ПВХ", "Скоростные"],
    }),
    [],
  );
  assert.deepEqual(
    recommendProducts({ ...speedSelection, equipment: ["Пока ничего"] }),
    ["beaded-rope", "pvc-rope", "speed-rope"],
  );
});
test("Шаги валидируют ответы и количество только для группы", () => {
  assert.equal(selectionStepValid(0, { ...answers, customerType: "" }), false);
  assert.equal(selectionStepValid(1, { ...answers, age: "" }), false);
  assert.equal(selectionStepValid(1, { ...answers, heightCm: null }), false);
  assert.equal(selectionStepValid(1, { ...answers, heightMaxCm: 120 }), false);
  for (const count of [0, -1, 1.5, 10001, NaN])
    assert.equal(
      selectionStepValid(1, { ...answers, athleteCount: count }),
      false,
    );
  assert.equal(
    selectionStepValid(1, {
      ...answers,
      customerType: "Спортсмен",
      athleteCount: 0,
      heightMaxCm: null,
    }),
    true,
  );
  assert.equal(selectionStepValid(2, { ...answers, disciplines: [] }), false);
  assert.equal(selectionStepValid(3, { ...answers, level: "" }), false);
  assert.equal(selectionStepValid(4, { ...answers, equipment: [] }), false);
  assert.ok(isGroupSelection(answers));
});
test("Длина — ориентир по росту, без автоматического определения количества", () => {
  assert.deepEqual(ropeLengthGuidance(answers), [
    "Для Double Dutch — комплект из двух скакалок по 4,2 м; организацию работы группы уточним при личном подборе.",
  ]);
  assert.match(
    ropeLengthGuidance({ ...answers, disciplines: ["Трюки"] })[0],
    /220–245 см/,
  );
  assert.match(
    ropeLengthGuidance({
      ...answers,
      heightCm: 215,
      heightMaxCm: 220,
      disciplines: ["Скорость"],
    })[0],
    /превышает 300 см/,
  );
});
test("Пока ничего исключает имеющийся инвентарь", () => {
  assert.deepEqual(toggleEquipment(["ПВХ", "Бисерные"], "Пока ничего"), [
    "Пока ничего",
  ]);
  assert.deepEqual(toggleEquipment(["Пока ничего"], "ПВХ"), ["ПВХ"]);
  assert.deepEqual(toggleEquipment(["ПВХ"], "ПВХ"), []);
});
test("Обязательны имя и контакт; остальные поля можно пропустить", () => {
  assert.ok(
    inquiryValid({ ...draft, city: "", customerType: "", quantity: null }),
  );
  assert.equal(inquiryValid({ ...draft, name: " " }), false);
  assert.equal(inquiryValid({ ...draft, phoneOrContact: " " }), false);
  assert.equal(inquiryValid({ ...draft, quantity: 0 }), false);
  assert.equal(inquiryValid({ ...draft, quantity: 1.5 }), false);
});
test("29 — розница, 30 — опт; LOOP и цвет попадают в снимок данных", () => {
  for (const [quantity, price] of [
    [29, 1290],
    [30, 1000],
  ]) {
    const data = buildInquiryData(
      { ...draft, quantity },
      { inquiryType: "product" },
      getProducts(),
      "https://example.test/catalog/beaded-rope?utm_source=vk&utm_medium=social&utm_campaign=group&utm_content=cta&utm_term=rope",
      "2026-09-15",
    );
    assert.equal(data.unitPrice, price);
    assert.equal(data.series, "loop");
    assert.equal(data.variant, "pink-handle");
    assert.equal(data.color, "Розовые");
    assert.equal(data.productName, "Бисерная скакалка LOOP");
    assert.equal(data.name, "Проверка");
    assert.equal(data.utmSource, "vk");
    assert.equal(data.utmTerm, "rope");
    assert.equal(data.timestamp, "2026-09-15");
    assert.match(
      buildInquirySummary(data, getProducts()),
      /Серия \/ ручки: LOOP/,
    );
  }
});
test("Подбор передаёт ответы и рекомендации, но не создаёт количество заказа", () => {
  const data = buildInquiryData(
    { ...draft, product: "", series: undefined, variant: "", quantity: null },
    {
      inquiryType: "selection",
      selection: answers,
      recommendedProductIds: [
        "double-dutch-rope",
        "double-dutch-rope",
        "missing",
      ],
    },
    getProducts(),
    "https://example.test/selection",
  );
  assert.equal(data.quantity, null);
  assert.equal(data.unitPrice, null);
  assert.deepEqual(data.recommendedProductIds, ["double-dutch-rope"]);
  assert.deepEqual(data.selectionAnswers, answers);
  assert.match(buildInquirySummary(data, getProducts()), /спортсменов 30/);
  assert.match(
    buildInquirySummary(data, getProducts()),
    /Рекомендуемые модели: Дабл Датч скакалки/,
  );
});
test("Double Dutch — комплект из двух, а не штука", () => {
  const p = getProduct("double-dutch-rope")!;
  assert.match(wholesaleLabel(p), /30 комплектов/);
  const data = buildInquiryData(
    { ...draft, product: p.id, series: "ddru", variant: "white", quantity: 30 },
    { inquiryType: "section" },
    getProducts(),
    "https://example.test/catalog/double-dutch-rope",
  );
  assert.equal(data.unitPrice, 2500);
  assert.match(
    buildInquirySummary(data, getProducts()),
    /Количество: 30 комплект/,
  );
});
test("Корзина объединяет одинаковые варианты и готовит один общий запрос", () => {
  const beadedKey = cartItemKey("beaded-rope", "loop", "pink-handle");
  const first = {
    key: beadedKey,
    productId: "beaded-rope",
    series: "loop" as const,
    variant: "pink-handle",
    quantity: 2,
  };
  const items = addCartItem(addCartItem([], first), {
    ...first,
    quantity: 3,
  });
  items.push({
    key: cartItemKey("double-dutch-rope", "ddru", "white"),
    productId: "double-dutch-rope",
    series: "ddru",
    variant: "white",
    quantity: 1,
  });
  assert.equal(items.length, 2);
  assert.equal(items[0].quantity, 5);

  const data = buildInquiryData(
    { ...draft, product: "", series: undefined, variant: "", quantity: null },
    { inquiryType: "cart", cartItems: items },
    getProducts(),
    "https://example.test/cart",
  );
  assert.equal(data.inquiryType, "cart");
  assert.equal(data.cartItems.length, 2);
  assert.equal(data.cartItems[0].color, "Розовые");
  assert.equal(data.cartWholesale, false);
  assert.equal(data.cartTotal, 9440);
  assert.match(buildInquirySummary(data, getProducts()), /Корзина/);
  assert.match(
    buildInquirySummary(data, getProducts()),
    /Бисерная скакалка LOOP; ручки LOOP; цвет Розовые; количество 5 шт\./,
  );
  assert.match(
    buildInquirySummary(data, getProducts()),
    /Дабл Датч скакалки; ручки DDRu; цвет Белый; количество 1 комплект/,
  );

  const wholesaleData = buildInquiryData(
    { ...draft, product: "", series: undefined, variant: "", quantity: null },
    {
      inquiryType: "cart",
      cartItems: [
        { ...first, quantity: 15 },
        {
          key: cartItemKey("pvc-rope", "ddru", "white"),
          productId: "pvc-rope",
          series: "ddru",
          variant: "white",
          quantity: 15,
        },
      ],
    },
    getProducts(),
    "https://example.test/cart",
  );
  assert.equal(wholesaleData.cartWholesale, true);
  assert.deepEqual(
    wholesaleData.cartItems.map((item) => item.unitPrice),
    [1000, 900],
  );
  assert.equal(wholesaleData.cartTotal, 28500);
  assert.match(
    buildInquirySummary(wholesaleData, getProducts()),
    /Оптовые цены\. Общая стоимость: 28 500 ₽/,
  );
});
test("Будущий адаптер получает leadId до выдачи способов связи", async () => {
  const data = buildInquiryData(
    draft,
    {},
    getProducts(),
    "https://example.test/",
  );
  const local = await prepareInquiryHandoff(data);
  assert.equal(local.inquiry.leadId, undefined);
  let saved = false;
  const result = await prepareInquiryHandoff(data, async (snapshot) => {
    assert.equal(snapshot.color, "Розовые");
    saved = true;
    return "lead-test";
  });
  assert.ok(saved);
  assert.equal(result.inquiry.leadId, "lead-test");
});
