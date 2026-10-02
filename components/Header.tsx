"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "./Logo";
import Icon from "./Icon";
import { nav, site } from "@/lib/site";
import { duration, ease, stagger } from "@/lib/motion";
import { track } from "@/lib/analytics";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Chiude il menu a ogni cambio pagina (aggiornamento durante il render, senza effetto).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // Menu mobile: blocca lo scroll sotto, intrappola il focus, chiude con Esc e restituisce il focus.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a, button") ?? []).filter((el) => !el.hasAttribute("disabled"));
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = [toggle, ...focusables()].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`header${scrolled || open ? " header--solid" : ""}`}>
      <div className="header__bar">
        <Link href="/" className="header__logo" aria-label="Solace, vai alla home">
          <Logo />
        </Link>

        <nav className="header__nav" aria-label="Principale">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="navlink" aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/analisi-gratuita" className="btn btn--small header__cta" onClick={() => track("cta_analisi_click", "header")}>
          Analisi gratuita
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Chiudi il menu" : "Apri il menu"}</span>
          <Icon name={open ? "close" : "menu"} size={26} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            ref={panelRef}
            className="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)", transition: { duration: duration.fast * 1.5, ease: ease.inOut } }}
            transition={{ duration: 0.35, ease: ease.out }}
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: stagger.tight, delayChildren: 0.12 } } }}
            >
              {[...nav, { href: "/analisi-gratuita", label: "Analisi gratuita" }].map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
                  }}
                >
                  <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mobile-menu__foot">
              <a
                href={site.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--block"
                onClick={() => track("calendly_click", "menu")}
              >
                Prenota una chiamata
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
