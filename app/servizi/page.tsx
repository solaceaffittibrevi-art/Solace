import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Fragment } from "react";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import GlassIcon from "@/components/GlassIcon";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import CtaBand from "@/components/CtaBand";
import TrackedLink from "@/components/TrackedLink";
import { compliance, serviceGroups } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Gestione Airbnb e Affitti Brevi a Milano | Solace",
  description:
    "Property management a Milano per affitti brevi: annunci, prezzi, ospiti, check-in, pulizie, manutenzione, adempimenti e rendicontazione mensile.",
  path: "/servizi",
});

// Ogni foto è mostrata intera: il contenitore prende le sue proporzioni reali (ratio).
const groupImages: Record<string, { src: string; alt: string; ratio: string }> = {
  prima: {
    src: "/images/servizi/soggiorno-cucina-pronto-per-gli-ospiti.jpg",
    alt: "Soggiorno pronto per gli ospiti con divano, tavolo rotondo apparecchiato per quattro e cucina in legno",
    ratio: "2000 / 1333",
  },
  durante: { src: "/images/dettagli/biancheria.jpg", alt: "Asciugamani bianchi piegati sul letto", ratio: "1600 / 1066" },
};

export default function ServiziPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Tutto quello che serve, <em>niente che ti tocchi seguire.</em>
          </>
        }
        background={{
          src: "/images/servizi/monogramma-solace-sr.jpg",
          alt: "",
          position: "88% 50%",
          fit: "contain",
        }}
        lead="Gestione Airbnb e affitti brevi a Milano: ogni attività che svolgiamo ha un obiettivo concreto per te, cioè meno incombenze, ospiti seguiti, una casa curata e risultati che puoi controllare."
      />

      <nav className="container subnav" aria-label="Fasi del servizio">
        <ul>
          {serviceGroups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`}>{g.phase}</a>
            </li>
          ))}
          <li>
            <a href="#adempimenti">Adempimenti</a>
          </li>
        </ul>
      </nav>

      {serviceGroups.map((g, gi) => (
        <Fragment key={g.id}>
        <section
          id={g.id}
          className={`section service-group${gi % 2 ? " section--paper service-group--reverse" : ""}`}
          aria-labelledby={`${g.id}-title`}
        >
          <div className="container service-group__grid">
            <div className="service-group__aside">
              <Reveal className="section-head">
                <h2 id={`${g.id}-title`} className="h2">
                  {g.phase}
                </h2>
                <p className="section-head__sub">{g.title}</p>
                <p className="section-head__text">{g.intro}</p>
              </Reveal>
              {g.id === "dopo" ? (
                <Reveal as="figure" className="report-example" delay={0.1}>
                  <div className="report-example__frame">
                    <Image
                      src="/images/servizi/rendicontazione-mensile-esempio-dimostrativo.webp"
                      alt="Esempio dimostrativo della rendicontazione mensile Solace"
                      width={1536}
                      height={1024}
                      sizes="(max-width: 900px) 100vw, 40vw"
                    />
                  </div>
                  <figcaption>
                    <strong>Esempio dimostrativo.</strong> Un esempio di come presentiamo le informazioni della gestione.
                  </figcaption>
                </Reveal>
              ) : (
                <Reveal
                  className="service-group__media"
                  delay={0.1}
                  style={{ "--ratio": groupImages[g.id].ratio } as React.CSSProperties}
                >
                  <Parallax strength={6}>
                    <Image src={groupImages[g.id].src} alt={groupImages[g.id].alt} fill sizes="(max-width: 900px) 100vw, 40vw" />
                  </Parallax>
                </Reveal>
              )}
            </div>
            <Stagger as="ul" className="service-list" gap={0.08}>
              {g.items.map((it) => (
                <RevealItem as="li" key={it.title} className="service">
                  <GlassIcon name={it.icon} />
                  <div>
                    <h3>{it.title}</h3>
                    <p>{it.text}</p>
                    <p className="service__gain">
                      <Icon name="check" size={16} /> {it.gain}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>
        {g.id === "durante" && (
          <section className="cta-inline" aria-label="Richiedi una valutazione">
            <div className="container cta-inline__inner">
              <p className="cta-inline__text">Vuoi sapere quanto può rendere la tua casa con questa gestione?</p>
              <TrackedLink href="/valutazione-gratuita" event="cta_click" location="servizi-meta" className="btn" arrow>
                Richiedi una valutazione gratuita
              </TrackedLink>
            </div>
          </section>
        )}
        </Fragment>
      ))}

      <section id="adempimenti" className="section section--deep compliance" aria-labelledby="compliance-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="compliance-title" className="h2">
              Gli adempimenti, spiegati semplici.
            </h2>
            <p className="section-head__text">
              Affittare per brevi periodi comporta alcuni obblighi. Ti spieghiamo quali valgono per il tuo immobile e ti
              supportiamo nelle pratiche. Quali attività sono incluse nel servizio è indicato nella proposta.
            </p>
          </Reveal>
          <Stagger as="dl" className="compliance__list" gap={0.08}>
            {compliance.map((c) => (
              <RevealItem key={c.title} className="compliance__item">
                <dt>{c.title}</dt>
                <dd>{c.text}</dd>
              </RevealItem>
            ))}
          </Stagger>
          <p className="compliance__note">
            Le informazioni hanno scopo orientativo e non sostituiscono la consulenza di un professionista: le regole
            possono cambiare e dipendono dal Comune e dalla situazione dell&apos;immobile.
          </p>
        </div>
      </section>

      <CtaBand title="Vuoi sapere cosa serve per la tua casa?" />
    </>
  );
}
