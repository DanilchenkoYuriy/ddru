import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  allowedDevOrigins: ["127.0.0.1"],
  // Статическая выгрузка в папку out/ — можно разместить на любом хостинге.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
