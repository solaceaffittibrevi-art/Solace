"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

const formatter = new Intl.NumberFormat("it-IT", { useGrouping: "always" });
const format = (n: number) => formatter.format(Math.round(n));

// Contatore per dati verificati. Il valore finale è nell'HTML (SEO, lettori di schermo,
// assenza di JavaScript); con JavaScript attivo il numero riparte da zero e sale quando entra nello schermo.
export default function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!reduced && ref.current && !inView) ref.current.textContent = "0";
    // Solo al montaggio: prepara il conteggio senza attendere lo scroll.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduced) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: ease.out,
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span className="counter">
      <span className="sr-only">{`${format(value)}${suffix}`}</span>
      <span aria-hidden="true">
        <span ref={ref}>{format(value)}</span>
        {suffix}
      </span>
    </span>
  );
}
