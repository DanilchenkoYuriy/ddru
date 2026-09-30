import type { MetadataRoute } from "next";
import { site, navigation } from "@/config/site";
import { getProducts } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  const paths = [
    "/",
    ...navigation.map(({ href }) => href),
    "/selection",
    "/contacts",
    ...getProducts().map(({ slug }) => `/catalog/${slug}`),
  ];
  return paths.map((path) => ({ url: new URL(path, site.url!).href }));
}

export const dynamic = "force-static";
