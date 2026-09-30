"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previousBehavior;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
