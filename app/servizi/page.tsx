import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import CtaBand from "@/components/CtaBand";
import { compliance, serviceGroups } from "@/lib/site";

export const metadata: Metadata = {
  title: "Servizi di gestione affitti brevi",
  description:
    "Cosa fa Solace per il tuo immobile a Milano: analisi, foto e annunci, prezzi dinamici, ospiti, check-in, pulizie, manutenzione, adempimenti e rendicontazione.",
  alternates: { canonical: "/servizi" },
};

const groupImages: Record<string, { src: string; alt: string }> = {
  prima: { src: "/images/immobili/trilocale-wagner/01.jpg", alt: "Soggiorno luminoso del Trilocale Wagner pronto per gli ospiti" },
  durante: { src: "/images/dettagli/biancheria.jpg", alt: "Asciugamani bianchi piegati sul letto" },
  dopo: { src: "/images/immobili/suite-royale/02.jpg", alt: "Zona pranzo della Suite Royale" },
};

export default function ServiziPage() {
  return (
    <>
      <PageHero
        eyebrow="Servizi"
        title={
          <>
            Tutto quello che serve, <em>niente che ti tocchi seguire.</em>
          </>
        }
        lead="Ogni attività che svolgiamo ha un obiettivo concreto per te: meno incombenze, ospiti seguiti, una casa curata e risultati che puoi controllare."
      />

      <nav className="container subnav" aria-label="Fasi del servizio">
        <ul>
          {serviceGroups.map((g, i) => (
            <li key={g.id}>
              <a href={`#${g.id}`}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span> {g.phase}
              </a>
            </li>
          ))}
          <li>
            <a href="#adempimenti">
              <span aria-hidden="true">04</span> Adempimenti
            </a>
          </li>
        </ul>
      </nav>

      {serviceGroups.map((g, gi) => (
        <section
          key={g.id}
          id={g.id}
          className={`section service-group${gi % 2 ? " section--paper service-group--reverse" : ""}`}
          aria-labelledby={`${g.id}-title`}
        >
          <div className="container service-group__grid">
            <div className="service-group__aside">
              <Reveal className="section-head">
                <p className="eyebrow">
                  {String(gi + 1).padStart(2, "0")} · {g.phase}
                </p>
                <h2 id={`${g.id}-title`} className="h2">
                  {g.title}
                </h2>
                <p className="section-head__text">{g.intro}</p>
              </Reveal>
              <Reveal className="service-group__media" delay={0.1}>
                <Parallax strength={6}>
                  <Image src={groupImages[g.id].src} alt={groupImages[g.id].alt} fill sizes="(max-width: 900px) 100vw, 40vw" />
                </Parallax>
              </Reveal>
            </div>
            <Stagger as="ul" className="service-list" gap={0.08}>
              {g.items.map((it) => (
                <RevealItem as="li" key={it.title} className="service">
                  <span className="service__icon">
                    <Icon name={it.icon} size={26} />
                  </span>
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
      ))}

      <section id="adempimenti" className="section section--deep compliance" aria-labelledby="compliance-title">
        <div className="container">
          <Reveal className="section-head section-head--split">
            <div>
              <p className="eyebrow">04 · Adempimenti</p>
              <h2 id="compliance-title" className="h2">
                Le regole degli affitti brevi, <em>spiegate semplici.</em>
              </h2>
            </div>
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
