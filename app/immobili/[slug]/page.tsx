import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyCard from "@/components/PropertyCard";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import { formatRating, properties } from "@/lib/immobili";
import { pageMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return properties.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = properties.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.name} – ${p.zone}, ${p.city} | Solace`,
    // Descrizione breve (Google mostra circa 155–160 caratteri): tipologia, zona e caratteristiche reali.
    description: `${p.type} in affitto breve a ${p.zone}, ${p.city}, gestito da Solace: ${p.features.slice(0, 3).map((f) => f.charAt(0).toLowerCase() + f.slice(1)).join(", ")}. Fino a ${p.guests} ospiti.`,
    path: `/immobili/${p.slug}`,
    image: { url: p.photos[0].src, alt: p.photos[0].alt },
  });
}

export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  if (!property) notFound();
  const others = properties.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="property-hero">
        <div className="container">
          <Reveal as="p" className="breadcrumb">
            <Link href="/immobili">Immobili</Link> <span aria-hidden="true">/</span> <span aria-current="page">{property.name}</span>
          </Reveal>
          <div className="property-hero__head">
            <h1 className="property-hero__title enter" style={{ "--i": 0 } as React.CSSProperties}>
              {property.name}
            </h1>
            <p className="property-hero__zone enter" style={{ "--i": 1 } as React.CSSProperties}>
              <Icon name="pin" size={16} /> {property.zone}, {property.city}
            </p>
          </div>
          <PropertyGallery photos={property.photos} name={property.name} />
        </div>
      </section>

      <section className="section property-info">
        <div className="container property-info__grid">
          <Reveal className="property-info__main">
            <h2 className="h3">L&apos;immobile</h2>
            <p className="lead">{property.summary}</p>
            <ul className="tags" aria-label="Caratteristiche">
              {property.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="div" className="property-facts" delay={0.1}>
            <dl>
              <div>
                <dt>Tipologia</dt>
                <dd>{property.type}</dd>
              </div>
              <div>
                <dt>Ospiti</dt>
                <dd>Fino a {property.guests}</dd>
              </div>
              <div>
                <dt>Spazi</dt>
                <dd>{property.rooms}</dd>
              </div>
              <div>
                <dt>Su Airbnb</dt>
                <dd>
                  {property.rating ? (
                    <>
                      <Icon name="star" size={15} /> {formatRating(property.rating.value)} su 5 · {property.rating.count} recensioni
                    </>
                  ) : (
                    "Annuncio nuovo, ancora senza recensioni"
                  )}
                  <span className="property-facts__note">dato di ottobre 2026</span>
                </dd>
              </div>
            </dl>
            <TrackedLink href="/valutazione-gratuita" event="cta_click" location={`scheda-${property.slug}`} className="btn btn--block">
              Richiedi una valutazione gratuita
            </TrackedLink>
            <a href={property.airbnb} target="_blank" rel="noopener noreferrer" className="link-arrow property-facts__airbnb">
              Visualizza su Airbnb <Icon name="external" size={16} />
              <span className="sr-only">(si apre in una nuova scheda)</span>
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section section--paper owner-cta" aria-labelledby="owner-cta-title">
        <div className="container owner-cta__inner">
          <Reveal>
            <h2 id="owner-cta-title" className="h2">
              Hai un immobile simile a questo?
            </h2>
            <p className="section-head__text">
              Raccontaci com&apos;è e dove si trova: valutiamo insieme il suo potenziale in affitto breve, gratuitamente.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <TrackedLink href="/valutazione-gratuita" event="cta_click" location={`immobile-${property.slug}`} className="btn btn--lg" arrow>
              Richiedi una valutazione gratuita
            </TrackedLink>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="others-title">
        <div className="container">
          <Reveal className="section-head section-head--split">
            <h2 id="others-title" className="h2">
              Altri appartamenti gestiti
            </h2>
            <Link href="/immobili" className="link-arrow">
              Tutti gli immobili <Icon name="arrow" size={16} />
            </Link>
          </Reveal>
          <Stagger as="ul" className="property-grid" gap={0.1}>
            {others.map((p) => (
              <RevealItem as="li" key={p.slug}>
                <PropertyCard property={p} />
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
