"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import Icon from "./Icon";
import { spring } from "@/lib/motion";

// Accordion accessibile: pulsanti con aria-expanded, pannelli collegati, apertura con transizione
// CSS su grid-template-rows (fluida, senza misurare l'altezza) e icona animata con Motion.
export default function FaqList({ items, initiallyOpen = 0 }: { items: { q: string; a: string }[]; initiallyOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(initiallyOpen);
  const base = useId();

  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${base}-q${i}`;
        const panelId = `${base}-a${i}`;
        return (
          <div key={item.q} className={`faq__item${isOpen ? " is-open" : ""}`}>
            <h3 className="faq__q">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="faq__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="faq__label">{item.q}</span>
                <span className="faq__icon glass-icon glass-icon--md glass-icon--interactive" aria-hidden="true">
                  <motion.span className="faq__icon-glyph" animate={{ rotate: isOpen ? 45 : 0 }} transition={spring.snappy}>
                    <Icon name="plus" size={20} />
                  </motion.span>
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} className="faq__panel">
              <div className="faq__panel-inner" inert={!isOpen}>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
