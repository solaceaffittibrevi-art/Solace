"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { details } from "@/lib/site";
import { duration, ease } from "@/lib/motion";

// "La cura nei dettagli": elenco di pulsanti (tastiera e touch, non solo hover) che cambia la foto
// con una dissolvenza incrociata.
export default function DetailsShowcase() {
  const [active, setActive] = useState(0);
  const item = details[active];

  return (
    <div className="details">
      <div className="details__media">
        <AnimatePresence initial={false}>
          <motion.div
            key={item.src}
            className="details__frame"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.slow, ease: ease.out }}
          >
            <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
          </motion.div>
        </AnimatePresence>
      </div>
      <ul className="details__list">
        {details.map((d, i) => (
          <li key={d.title}>
            <button
              type="button"
              className={`details__item${i === active ? " is-active" : ""}`}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="details__title">{d.title}</span>
              <span className="details__text">{d.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
