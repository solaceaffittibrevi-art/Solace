"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import TrackedLink from "./TrackedLink";
import Icon from "./Icon";
import { site } from "@/lib/site";
import { ease } from "@/lib/motion";

// L'ingresso dei testi è un'animazione CSS (.enter): parte al primo disegno della pagina,
// senza attendere JavaScript, e i testi non restano mai invisibili.
// Motion gestisce solo ciò che dipende dallo scroll: parallasse dell'immagine e dissolvenza in uscita.
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
          initial={reduced ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: ease.out }}
        >
          <Image
            src="/images/milano-duomo.webp"
            alt="Piazza del Duomo a Milano di sera, con il Duomo illuminato e la Galleria Vittorio Emanuele II"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </motion.div>
      </motion.div>
      <div className="hero__shade" aria-hidden="true" />

      <motion.div className="container hero__content" style={reduced ? undefined : { opacity: fadeOut }}>
        <div className="hero__text">
          <h1 id="hero-title" className="hero__title enter" style={{ "--i": 0 } as React.CSSProperties}>
            Gestiamo il tuo appartamento <em>in affitto breve a Milano.</em>
          </h1>
          <p className="hero__lead enter" style={{ "--i": 1 } as React.CSSProperties}>
            Ospiti, pulizie, prezzi e adempimenti li seguiamo noi. La casa resta curata e tu vedi incassi e costi di
            ogni soggiorno.
          </p>
          <div className="hero__actions enter" style={{ "--i": 2 } as React.CSSProperties}>
            <TrackedLink href="/valutazione-gratuita" event="cta_click" location="hero" className="btn btn--lg" arrow>
              Richiedi una valutazione gratuita
            </TrackedLink>
            <TrackedLink
              href={`https://wa.me/${site.whatsapp}`}
              event="whatsapp_click"
              location="hero"
              className="hero__alt"
              external
            >
              <Icon name="whatsapp" size={20} /> oppure scrivici su WhatsApp
            </TrackedLink>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
