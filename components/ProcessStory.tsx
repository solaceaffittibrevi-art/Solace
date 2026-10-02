"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { steps } from "@/lib/site";
import { duration, ease } from "@/lib/motion";

// Pianta stilizzata di un appartamento: le pareti si disegnano mentre si scorre il percorso,
// e ogni stanza si accende quando il passo corrispondente è attivo.
const walls =
  "M20 20H215M245 20H380V130M380 160V280H215M185 280H20V20M150 20V110H95M65 110H20M150 150V280M250 130H380M250 130V190M250 220V280";
const doors = "M95 110A30 30 0 0 1 65 140M150 110A40 40 0 0 1 190 150M250 190A30 30 0 0 1 280 220";
const rooms = [
  { x: 85, y: 65 },
  { x: 315, y: 75 },
  { x: 200, y: 215 },
  { x: 85, y: 205 },
  { x: 315, y: 205 },
];

export default function ProcessStory({ detailed = false }: { detailed?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const draw = useTransform(smooth, [0, 0.9], [0.04, 1]);
  const line = useTransform(smooth, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length))));
  });

  return (
    <div ref={ref} className="story">
      <div className="story__visual" aria-hidden="true">
        <div className="story__sticky">
          <svg viewBox="0 0 400 300" className="story__plan" fill="none">
            <motion.path d={walls} className="story__walls" style={{ pathLength: reduced ? 1 : draw }} />
            <motion.path d={doors} className="story__doors" style={{ pathLength: reduced ? 1 : draw }} />
            {rooms.slice(0, steps.length).map((r, i) => (
              <g key={i} transform={`translate(${r.x} ${r.y})`}>
                <motion.circle
                  r={15}
                  className="story__dot"
                  animate={{ opacity: i <= active ? 1 : 0.25, scale: i === active ? 1.15 : 1 }}
                  transition={{ duration: duration.base, ease: ease.out }}
                />
                <text textAnchor="middle" dy="5" className="story__dot-num">
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
          <div className="story__counter">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: duration.fast * 1.5, ease: ease.out }}
              >
                {String(active + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            <span className="story__total">/ {String(steps.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      <ol className="story__steps">
        <motion.span className="story__progress" style={{ scaleY: reduced ? 1 : line }} aria-hidden="true" />
        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            className={`story__step reveal${i === active ? " is-active" : ""}`}
            initial={{ opacity: 0.35 }}
            whileInView={{ opacity: 1 }}
            viewport={{ amount: 0.6 }}
            transition={{ duration: duration.base, ease: ease.out }}
          >
            <span className="story__num" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            {detailed && i === 0 && (
              <p className="story__note">Nessun impegno: la valutazione serve a capire se ha senso procedere.</p>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
