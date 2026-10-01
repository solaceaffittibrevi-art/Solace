"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import TrackedLink from "./TrackedLink";
import Icon from "./Icon";
import Link from "next/link";
import { duration, ease, stagger } from "@/lib/motion";

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: duration.hero, ease: ease.out } },
};

export default function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      <motion.div className="hero__media" style={reduced ? undefined : { y }}>
        <motion.div
          className="hero__img"
          initial={reduced ? false : { scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: ease.out }}
        >
          <Image
            src="/images/immobili/suite-prestige/01.jpg"
            alt="Terrazzo della Suite Prestige, gestita da Solace, con vista sui tetti di Milano al tramonto"
            fill
            priority
            sizes="100vw"
          />
        </motion.div>
      </motion.div>
      <div className="hero__shade" aria-hidden="true" />

      <motion.div className="container hero__content" style={reduced ? undefined : { opacity: fadeOut }}>
        <motion.div
          className="hero__text"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: stagger.loose, delayChildren: 0.25 } } }}
        >
          <motion.p className="eyebrow hero__eyebrow reveal" variants={item}>
            <span className="hero__rule" aria-hidden="true" />
            Gestione affitti brevi a Milano
          </motion.p>
          <motion.h1 id="hero-title" className="hero__title reveal" variants={item}>
            La tua casa a Milano, <em>in mani che se ne prendono cura.</em>
          </motion.h1>
          <motion.p className="hero__lead reveal" variants={item}>
            Ospiti, prezzi, pulizie e adempimenti: ce ne occupiamo noi, con metodo e trasparenza. Tu segui i risultati,
            senza l&apos;impegno di ogni giorno.
          </motion.p>
          <motion.div className="hero__actions reveal" variants={item}>
            <TrackedLink href="/analisi-gratuita" event="cta_analisi_click" location="hero" className="btn btn--lg" arrow>
              Richiedi un&apos;analisi gratuita
            </TrackedLink>
            <Link href="/come-funziona" className="btn btn--ghost btn--lg">
              Scopri come funziona
            </Link>
          </motion.div>
          <motion.ul className="hero__trust reveal" variants={item} aria-label="In breve">
            <li>
              <Icon name="home" size={18} /> Oltre 30 immobili gestiti
            </li>
            <li>
              <Icon name="star" size={18} /> 1.200+ recensioni su Airbnb
            </li>
            <li>
              <Icon name="shield" size={18} /> Assistenza ospiti 24/7
            </li>
          </motion.ul>
        </motion.div>
      </motion.div>

      <motion.a
        href="#vantaggi"
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: duration.base }}
      >
        <span className="sr-only">Vai ai contenuti</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
