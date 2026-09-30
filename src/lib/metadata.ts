import type { Metadata } from "next";
import { site } from "@/config/site";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: { absolute: `${title} — DDRu` },
    description,
    ...(site.url
      ? { alternates: { canonical: new URL(path, site.url).href } }
      : {}),
    openGraph: {
      title: `${title} — DDRu`,
      description,
      type: "website",
      locale: "ru_RU",
      siteName: site.fullName,
      ...(site.url ? { url: new URL(path, site.url).href } : {}),
    },
  };
}
