// Не подставляем вымышленные аккаунты. Пустые контакты отображаются недоступными.
export type Messenger = "telegram" | "vk" | "max";
function httpsUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
export const site = {
  name: "DDRu",
  fullName: "Double Dutch Russia",
  url: httpsUrl(process.env.NEXT_PUBLIC_SITE_URL),
  description:
    "Профессиональные скакалки DDRu. Экспертный подбор инвентаря для спортсменов, тренеров, секций и федераций.",
};
export const contacts = {
  messengers: [
    {
      id: "telegram",
      label: "Telegram",
      href:
        httpsUrl(process.env.NEXT_PUBLIC_TELEGRAM_URL) ??
        "https://t.me/ddru_shop?direct",
    },
    {
      id: "vk",
      label: "VK",
      href:
        httpsUrl(process.env.NEXT_PUBLIC_VK_URL) ?? "https://vk.me/ddrussia",
    },
    {
      id: "max",
      label: "MAX",
      href:
        httpsUrl(process.env.NEXT_PUBLIC_MAX_URL) ??
        "https://max.ru/u/f9LHodD0cOLIBlbRqOddP3RG8del8Zv1kAHP6pXtUPmuZ8OijJcO37mwgFo",
    },
  ] satisfies { id: Messenger; label: string; href: string | null }[],
  communities: [
    {
      id: "telegram",
      label: "Telegram канал",
      href: "https://t.me/ddru_shop",
    },
    {
      id: "vk",
      label: "VK Сообщество",
      href: "https://vk.com/ddrussia",
    },
  ] satisfies { id: Exclude<Messenger, "max">; label: string; href: string }[],
  phone: process.env.NEXT_PUBLIC_PHONE || "+7 916 837-42-59",
  email: process.env.NEXT_PUBLIC_EMAIL || null,
};
export const navigation = [
  { href: "/catalog", label: "Каталог" },
  { href: "/for-sections", label: "Для секций" },
  { href: "/double-dutch", label: "Double Dutch" },
  { href: "/education", label: "Обучение" },
  { href: "/about", label: "О проекте" },
];
