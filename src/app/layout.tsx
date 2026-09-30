import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CartProvider } from "@/components/cart/CartProvider";
import { site } from "@/config/site";
import "./globals.css";
import "./editorial.css";
import "./conversion.css";
export const metadata: Metadata = {
  title: {
    default: "DDRu — скакалки и экспертный подбор",
    template: "%s — DDRu",
  },
  description: site.description,
  ...(site.url
    ? { metadataBase: new URL(site.url) }
    : { robots: { index: false, follow: false } }),
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          <a className="skip-link" href="#main">
            Перейти к содержимому
          </a>
          <Header />
          <ScrollToTop />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
