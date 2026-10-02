"use client";

import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "@/lib/motion";

// Profilo stilizzato di Milano (Duomo, Velasca, Pirellone, Bosco Verticale, Porta Nuova, CityLife),
// disegnato a linea quando entra nello schermo. Elemento decorativo.
const d =
  "M0 190H40V172H70V182H90V150H100V120L104 108L108 120V150H120V130L125 112L130 130V150H140V118L146 96L152 118V150H160V124L170 100L174 70L178 100L188 124V150H198V118L204 96L210 118V150H220V130L225 112L230 130V150H242V120L246 108L250 120V150H260V190H300V170H330V190H360V110H352V80H418V110H410V190H450V160H480V190H520V60H560V190H600V100H630V190H645V120H675V190H720V75L742 60V20H744V58L770 70V190H820V40H850V190H880C885 140 870 100 885 50H905C895 100 912 140 905 190H940V70Q980 90 990 130V190H1040V170H1080V180H1120V165H1160V190H1200";

export default function Skyline({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg className={["skyline", className].filter(Boolean).join(" ")} viewBox="0 0 1200 200" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <motion.path
        d={d}
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={reduced ? false : { pathLength: 0, opacity: 0.2 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: duration.slow * 3, ease: ease.inOut }}
      />
    </svg>
  );
}
