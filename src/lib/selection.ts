import type { Discipline, SelectionState } from "../types/inquiry.ts";
const taskModels: Record<Discipline, string[]> = {
  "Первые тренировки": ["beaded-rope"],
  Вольные: ["beaded-rope", "pvc-rope"],
  Скорость: ["beaded-rope", "pvc-rope", "speed-rope"],
  "Двойные и тройные прыжки": ["beaded-rope", "pvc-rope", "speed-rope"],
  Трюки: ["beaded-rope", "pvc-rope"],
  Танцы: ["beaded-rope", "pvc-rope"],
  "Командные дисциплины": ["beaded-rope", "double-dutch-rope"],
  "Double Dutch": ["double-dutch-rope"],
  "Китайское колесо": ["beaded-rope"],
  "Общая подготовка": ["beaded-rope", "pvc-rope"],
  "Школьная лига": [],
  "Участие в соревнованиях": [],
};
const ownedModels: Record<string, string> = {
  Бисерные: "beaded-rope",
  ПВХ: "pvc-rope",
  Скоростные: "speed-rope",
  "Double Dutch": "double-dutch-rope",
};
export const recommendationReasons: Record<string, string> = {
  "beaded-rope": "Бисерная — для изучения и отработки элементов.",
  "pvc-rope": "ПВХ — для дальнейшей работы во вольных упражнениях.",
  "speed-rope": "Скоростная — для работы в скоростных дисциплинах.",
  "double-dutch-rope":
    "Double Dutch — для работы группами и освоения отдельной дисциплины.",
};
export function recommendProducts(selection: SelectionState): string[] {
  const owned = new Set(selection.equipment.map((item) => ownedModels[item]));
  return [
    ...new Set(selection.disciplines.flatMap((task) => taskModels[task] ?? [])),
  ].filter((slug) => !owned.has(slug));
}
export function isGroupSelection(
  selection: Pick<SelectionState, "customerType">,
): boolean {
  return ["Тренер", "Клуб / секция", "Федерация"].includes(
    selection.customerType,
  );
}
export function validQuantity(value: number | null): boolean {
  return (
    value === null || (Number.isInteger(value) && value >= 1 && value <= 10000)
  );
}
export function validHeight(value: number | null): value is number {
  return (
    value !== null && Number.isInteger(value) && value >= 70 && value <= 220
  );
}
export function ropeLengthGuidance(selection: SelectionState): string[] {
  const advice: string[] = [];
  const soloTasks = selection.disciplines.some((task) =>
    taskModels[task].some((slug) => slug !== "double-dutch-rope"),
  );
  if (soloTasks && validHeight(selection.heightCm)) {
    const highest =
      isGroupSelection(selection) && validHeight(selection.heightMaxCm)
        ? selection.heightMaxCm
        : selection.heightCm;
    const shortestRope = selection.heightCm + 90;
    const longestRope = highest + 90;
    advice.push(
      longestRope > 300
        ? "Ориентир по росту превышает 300 см стандартного шнура. Длину для этих спортсменов уточним отдельно."
        : `Ориентир длины шнура без ручек: ${shortestRope}${longestRope > shortestRope ? `–${longestRope}` : ""} см. Это начальная настройка по росту; окончательную длину проверяют на спортсмене.`,
    );
  }
  if (
    selection.disciplines.some((task) =>
      taskModels[task].includes("double-dutch-rope"),
    )
  ) {
    advice.push(
      "Для Double Dutch — комплект из двух скакалок по 4,2 м; организацию работы группы уточним при личном подборе.",
    );
  }
  return advice;
}
export function toggleEquipment(current: string[], value: string): string[] {
  if (current.includes(value)) return current.filter((item) => item !== value);
  return value === "Пока ничего"
    ? [value]
    : [...current.filter((item) => item !== "Пока ничего"), value];
}
export function selectionStepValid(
  step: number,
  selection: SelectionState,
): boolean {
  if (step === 0) return Boolean(selection.customerType);
  if (step === 1)
    return (
      Boolean(selection.age) &&
      validHeight(selection.heightCm) &&
      (!isGroupSelection(selection) ||
        (validHeight(selection.heightMaxCm) &&
          selection.heightMaxCm >= selection.heightCm)) &&
      (!isGroupSelection(selection) || validQuantity(selection.athleteCount))
    );
  if (step === 2) return selection.disciplines.length > 0;
  if (step === 3) return Boolean(selection.level);
  if (step === 4) return selection.equipment.length > 0;
  return true;
}
