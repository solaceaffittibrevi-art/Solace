"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// Parallasse leggera per poche immagini grandi: il contenitore ritaglia, l'immagine interna
// si sposta di pochi punti percentuali. Con movimento ridotto resta ferma.
export default function Parallax({
  children,
  className,
  strength = 8,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={["parallax", className].filter(Boolean).join(" ")}>
      <motion.div
        className="parallax__inner"
        style={reduced ? undefined : { y, scale: 1 + (strength * 2.2) / 100, willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
