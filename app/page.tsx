import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import Icon from "@/components/Icon";
import GlassIcon from "@/components/GlassIcon";
import Counter from "@/components/motion/Counter";
import Parallax from "@/components/motion/Parallax";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import ProcessStory from "@/components/ProcessStory";
import PropertyCard from "@/components/PropertyCard";
import Testimonials from "@/components/Testimonials";
import FounderBlock from "@/components/FounderBlock";
import FaqList from "@/components/FaqList";
import LeadSection from "@/components/LeadSection";
import { benefits, faqs, proof, proofSourceNote, serviceGroups } from "@/lib/site";
import { properties } from "@/lib/immobili";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Gestione Affitti Brevi Milano | Solace",
  description:
    "Gestione affitti brevi e Airbnb a Milano: ospiti, pulizie, prezzi e adempimenti seguiti dal team Solace. Richiedi l'analisi gratuita del tuo immobile.",
  path: "/",
});

// Percorso costruito sulle domande del proprietario:
// cosa fate → perché fidarmi → cosa comprende → come si inizia → chi mi segue → dubbi → richiesta.
export default function Home() {
  const featured = properties.slice(0, 4);

  return (
    <>
      <HomeHero />

      {/* Cosa fate e come potete aiutarmi */}
      <section id="vantaggi" className="section benefits" aria-labelledby="benefits-title">
        <div className="container benefits__grid">
          <Reveal className="benefits__media" style={{ "--ratio": "1920 / 1296" } as React.CSSProperties}>
            <Parallax strength={6}>
              <Image
                src="/images/immobili/villa-eze/01.jpg"
                alt="Piscina a sfioro della villa affacciata sul mare della Costa Azzurra, a Èze"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </Parallax>
            <p className="benefits__caption">
              <a href="https://www.airbnb.it/rooms/1438690511711738798" target="_blank" rel="noopener noreferrer">
                Villa vista mare, Èze – Costa Azzurra
                <span className="sr-only"> (annuncio su Airbnb, si apre in una nuova scheda)</span>
              </a>
            </p>
          </Reveal>
          <div className="benefits__text">
            <Reveal className="section-head">
              <h2 id="benefits-title" className="h2">
                Cosa cambia per te, in pratica.
              </h2>
              <p className="section-head__text">
                Ti occupi solo delle decisioni importanti. Il lavoro di ogni giorno lo facciamo noi.
              </p>
            </Reveal>
            <Stagger as="ul" className="benefits__list" gap={0.1}>
              {benefits.map((b) => (
                <RevealItem as="li" key={b.title} className="benefit">
                  <GlassIcon name={b.icon} />
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.text}</p>
                  </div>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Perché fidarsi: dati verificati, case reali, recensioni */}
      <section className="proof" aria-labelledby="proof-title">
        <h2 id="proof-title" className="sr-only">
          Solace in numeri
        </h2>
        <Stagger as="ul" className="container proof__list" gap={0.12}>
          {proof.map((p) => (
            <RevealItem as="li" key={p.label} className="proof__item">
              <span className="proof__value">
                <Counter value={p.value} suffix={p.suffix} />
              </span>
              <span className="proof__label">{p.label}</span>
              <span className="proof__note">{p.note}</span>
            </RevealItem>
          ))}
        </Stagger>
        <p className="container proof__source">{proofSourceNote}</p>
      </section>

      <section className="section section--deep featured" aria-labelledby="featured-title">
        <div className="container">
          <Reveal className="section-head section-head--split">
            <h2 id="featured-title" className="h2">
              Alcune delle case che gestiamo.
            </h2>
            <Link href="/immobili" className="link-arrow">
              Vedi tutti gli immobili <Icon name="arrow" size={16} />
            </Link>
          </Reveal>
          <Stagger className="featured__grid" gap={0.12}>
            {featured.map((p, i) => (
              <RevealItem key={p.slug} className={`featured__cell featured__cell--${i}`}>
                <PropertyCard property={p} size={i === 0 ? "large" : "default"} />
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Testimonials />

      {/* Cosa comprende la gestione */}
      <section className="section phases" aria-labelledby="phases-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="phases-title" className="h2">
              Cosa comprende la gestione
            </h2>
            <p className="section-head__text">
              Un solo interlocutore per la gestione del tuo appartamento in affitto breve, dalla preparazione
              dell&apos;annuncio al rendiconto. Il perimetro esatto è scritto nella proposta.
            </p>
          </Reveal>
          <Stagger as="ol" className="phases__list" gap={0.14}>
            {serviceGroups.map((g) => (
              <RevealItem as="li" key={g.id} className="phase">
                <h3 className="phase__name">{g.phase}</h3>
                <p className="phase__title">{g.title}</p>
                <ul className="phase__items">
                  {g.items.slice(0, 4).map((it) => (
                    <li key={it.title}>
                      <GlassIcon name={it.icon} size="sm" />
                      {it.title}
                    </li>
                  ))}
                </ul>
                <Link href={`/servizi#${g.id}`} className="link-arrow">
                  Dettagli<span className="sr-only">: {g.phase}</span> <Icon name="arrow" size={16} />
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Come si inizia */}
      <section className="section section--deep process" aria-labelledby="process-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="process-title" className="h2">
              Iniziare è semplice, <em>e non ti impegna.</em>
            </h2>
          </Reveal>
          <ProcessStory />
        </div>
      </section>

      <FounderBlock />

      {/* Dubbi principali */}
      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="container faq-section__grid">
          <Reveal className="section-head">
            <h2 id="faq-title" className="h2">
              Domande frequenti
            </h2>
            <Link href="/faq" className="link-arrow">
              Tutte le domande <Icon name="arrow" size={16} />
            </Link>
          </Reveal>
          <Reveal>
            <FaqList items={faqs.slice(0, 4)} />
          </Reveal>
        </div>
      </section>

      <LeadSection location="home" />
    </>
  );
}
