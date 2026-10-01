import type { Transition, Variants } from "motion/react";

// Sistema di movimento condiviso: tutte le animazioni del sito usano questi valori.
// Durate brevi per l'interfaccia, più lunghe solo per gli ingressi editoriali.
export const duration = {
  fast: 0.2, // hover, focus, icone
  base: 0.5, // comparse di testo e card
  slow: 0.9, // immagini e linee decorative
  hero: 1.1, // ingresso della hero
} as const;

export const ease = {
  out: [0.22, 1, 0.36, 1], // uscita morbida: entrate e reveal
  inOut: [0.65, 0, 0.35, 1], // transizioni tra stati
} as const;

export const spring = {
  // Movimenti fisici interrompibili (menu, lightbox): nessun rimbalzo vistoso, coerente con il tono del brand.
  soft: { type: "spring", bounce: 0.12, visualDuration: 0.5 } as Transition,
  snappy: { type: "spring", bounce: 0.08, visualDuration: 0.3 } as Transition,
};

export const stagger = { tight: 0.06, base: 0.1, loose: 0.16 } as const;

// Distanza massima di spostamento nelle comparse: si legge come dissolvenza, non come scivolamento.
export const rise = 20;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: rise },
  show: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
};

export const container = (gap: number = stagger.base, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const viewport = { once: true, amount: 0.25 } as const;
