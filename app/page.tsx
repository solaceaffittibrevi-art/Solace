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
import DetailsShowcase from "@/components/DetailsShowcase";
import Testimonials from "@/components/Testimonials";
import FaqList from "@/components/FaqList";
import CtaBand from "@/components/CtaBand";
import { benefits, faqs, featuredSlugs, properties, proof, proofSourceNote, serviceGroups } from "@/lib/site";

export default function Home() {
  const featured = featuredSlugs.map((slug) => properties.find((p) => p.slug === slug)!);

  return (
    <>
      <HomeHero />

      {/* Prova sociale verificata */}
      <section className="proof" aria-label="Solace in numeri">
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

      {/* Vantaggi per il proprietario */}
      <section id="vantaggi" className="section benefits" aria-labelledby="benefits-title">
        <div className="container benefits__grid">
          <Reveal className="benefits__media">
            <Parallax strength={7}>
              <Image
                src="/images/immobili/loft-tricolore/01.jpg"
                alt="Soggiorno del Loft Tricolore con parete arancione e scala verso il soppalco"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </Parallax>
            <p className="benefits__caption">Loft Tricolore, Porta Venezia</p>
          </Reveal>
          <div className="benefits__text">
            <Reveal className="section-head">
              <h2 id="benefits-title" className="h2">
                Il rendimento di un affitto breve, <em>senza viverlo ogni giorno.</em>
              </h2>
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

      {/* Servizi: tre fasi */}
      <section className="section section--paper phases" aria-labelledby="phases-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="phases-title" className="h2">
              Prima, durante e dopo ogni soggiorno.
            </h2>
            <p className="section-head__text">
              Un unico interlocutore per tutto ciò che serve a far rendere la casa: dalla preparazione dell&apos;annuncio
              al rendiconto di fine mese.
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
                  Approfondisci<span className="sr-only">: {g.phase}</span> <Icon name="arrow" size={16} />
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Percorso narrativo */}
      <section className="section process" aria-labelledby="process-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="process-title" className="h2">
              Dalla prima telefonata <em>al primo ospite.</em>
            </h2>
          </Reveal>
          <ProcessStory />
          <Reveal className="process__cta">
            <Link href="/come-funziona" className="btn btn--ghost">
              Il percorso nel dettaglio
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Immobili selezionati */}
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

      {/* Dettagli */}
      <section className="section details-section" aria-labelledby="details-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="details-title" className="h2">
              I dettagli che gli ospiti <em>ricordano.</em>
            </h2>
          </Reveal>
          <DetailsShowcase />
        </div>
      </section>

      <Testimonials />

      {/* FAQ */}
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

      <CtaBand />
    </>
  );
}
