"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/config/site";
import { useCart } from "@/components/cart/CartProvider";
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const container = useRef<HTMLElement>(null);
  const { count } = useCart();
  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  return (
    <header
      className="site-header"
      ref={container}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="header-inner">
        <Link
          className="brand"
          href="/"
          onClick={() => setOpen(false)}
          aria-label="DDRu — главная"
        >
          DDRu
          <span className="brand-dot" aria-hidden="true">
            ·
          </span>
          <span className="brand-caption">
            DOUBLE DUTCH
            <br />
            RUSSIA
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link className="header-cart" href="/cart" aria-label={`Корзина: ${count}`}>
          Корзина{count > 0 ? ` (${count})` : ""}
        </Link>
        <Link className="button button-small header-cta" href="/selection">
          Подобрать скакалку <span aria-hidden="true">↗</span>
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? "Закрыть ×" : "Меню +"}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Мобильная навигация"
        >
          {[
            ...navigation,
            { href: "/contacts", label: "Контакты" },
            { href: "/cart", label: `Корзина${count > 0 ? ` (${count})` : ""}` },
            { href: "/selection", label: "Подобрать скакалку" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
            >
              {label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
