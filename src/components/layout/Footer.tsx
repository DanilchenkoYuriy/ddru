import Link from "next/link";
import { navigation } from "@/config/site";
import { MessengerLinks } from "@/components/ui/MessengerLinks";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Link href="/" className="footer-logo">
            DDRu<span aria-hidden="true">·</span>
          </Link>
          <p>Инвентарь. Практика. Команда.</p>
        </div>
        <nav aria-label="Навигация в подвале">
          {[...navigation, { href: "/contacts", label: "Контакты" }].map(
            ({ href, label }) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ),
          )}
        </nav>
        <div>
          <p className="eyebrow">На связи</p>
          <MessengerLinks destination="community" />
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Double Dutch Russia</span>
        <span>Подберём инвентарь под вашу задачу.</span>
      </div>
    </footer>
  );
}
