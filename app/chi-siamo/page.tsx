import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import Parallax from "@/components/motion/Parallax";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import CtaBand from "@/components/CtaBand";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "Solace è una realtà di gestione affitti brevi a Milano. Conosci il metodo e la persona che segue il rapporto con i proprietari.",
  alternates: { canonical: "/chi-siamo" },
};

const method = [
  {
    icon: "search",
    title: "Prima capire, poi proporre",
    text: "Ogni collaborazione parte da un'analisi della casa e degli obiettivi del proprietario. Se l'affitto breve non è la scelta giusta, lo diciamo.",
  },
  {
    icon: "eye",
    title: "Trasparenza verificabile",
    text: "Report a ogni prenotazione e accesso alle piattaforme: puoi controllare in ogni momento cosa succede nella tua casa.",
  },
  {
    icon: "home",
    title: "Standard da ospitalità",
    text: "Pulizie professionali, biancheria di qualità, accesso semplice e risposte rapide: gli ospiti lo notano, le recensioni lo raccontano.",
  },
  {
    icon: "people",
    title: "Persone, non un call center",
    text: "Un referente diretto e un manager che conosce la tua casa sul posto, raggiungibili su un canale dedicato.",
  },
];

export default function ChiSiamoPage() {
  return (
    <>
      <PageHero
        eyebrow="Chi siamo"
        title={
          <>
            La tranquillità di affidarsi, <em>il piacere di ospitare.</em>
          </>
        }
        lead="Solace nasce a Milano per chi possiede una casa e vuole farla rendere in affitto breve senza trasformarlo in un secondo lavoro."
        image="/images/immobili/suite-royale/01.jpg"
        imageAlt="Cucina in marmo della Suite Royale, appartamento gestito da Solace vicino al Duomo"
      />

      <section className="section about" aria-labelledby="about-title">
        <div className="container about__grid">
          <Reveal className="about__text">
            <p className="eyebrow">Solace Real Estate Short Rent</p>
            <h2 id="about-title" className="h2">
              Gestiamo case come <em>vorremmo fosse gestita la nostra.</em>
            </h2>
            <p>
              Ci occupiamo di affitti brevi a Milano: dalla preparazione dell&apos;annuncio all&apos;accoglienza degli ospiti,
              dalle pulizie agli adempimenti, fino al rendiconto per il proprietario.
            </p>
            <p>
              Oggi seguiamo oltre 30 immobili, dal centro storico ai Navigli, e su Airbnb gli ospiti delle nostre case
              hanno lasciato più di 1.200 recensioni. Numeri che contano perché dietro ognuno c&apos;è un soggiorno curato.
            </p>
          </Reveal>
          <Reveal className="about__media" delay={0.1}>
            <Parallax strength={6}>
              <Image
                src="/images/immobili/navigli/01.jpg"
                alt="Soggiorno della Casa sui Navigli con travi a vista e camino"
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </Parallax>
          </Reveal>
        </div>
      </section>

      <section className="section section--deep person" aria-labelledby="person-title">
        <div className="container person__grid">
          <Reveal className="person__card">
            <Image src="/brand/monogram.svg" alt="" width={302} height={287} unoptimized />
          </Reveal>
          <Reveal className="person__text" delay={0.1}>
            <p className="eyebrow">Il tuo referente</p>
            <h2 id="person-title" className="h2">
              Gabriel Dal Molin
            </h2>
            <p className="lead">
              È la persona che incontri nella chiamata conoscitiva e che segue il rapporto con i proprietari, dalla prima
              analisi alla gestione quotidiana.
            </p>
            <p>
              Host su Airbnb da due anni, parla italiano e inglese. Diverse recensioni degli ospiti lo citano per
              nome, per la disponibilità e la cura delle case.
            </p>
            <TrackedLink href={site.calendly} event="calendly_click" location="chi-siamo" className="btn" external>
              Prenota una chiamata con Gabriel
            </TrackedLink>
          </Reveal>
        </div>
      </section>

      <section className="section method" aria-labelledby="method-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Il metodo</p>
            <h2 id="method-title" className="h2">
              Quattro principi <em>che non cambiano.</em>
            </h2>
          </Reveal>
          <Stagger as="ol" className="method__list" gap={0.12}>
            {method.map((m, i) => (
              <RevealItem as="li" key={m.title} className="method__item">
                <span className="method__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon name={m.icon} size={28} />
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand title="Parliamone con calma." text="Una chiamata di mezz'ora per conoscerci e capire se possiamo esserti utili." />
    </>
  );
}
