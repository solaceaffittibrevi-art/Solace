import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyCard from "@/components/PropertyCard";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import { properties } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return properties.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = properties.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name} – ${p.zone}`,
    description: `${p.type} gestito da Solace a ${p.zone}${p.city !== "Milano" ? `, ${p.city}` : ", Milano"}. ${p.summary}`,
    alternates: { canonical: `/immobili/${p.slug}` },
    openGraph: { images: [{ url: p.photos[0].src, alt: p.photos[0].alt }] },
  };
}

export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  if (!property) notFound();
  const others = properties.filter((p) => p.slug !== slug && p.milano).slice(0, 3);

  return (
    <>
      <section className="property-hero">
        <div className="container">
          <Reveal as="p" className="breadcrumb">
            <Link href="/immobili">Immobili</Link> <span aria-hidden="true">/</span> <span aria-current="page">{property.name}</span>
          </Reveal>
          <Stagger className="property-hero__head" gap={0.1}>
            <RevealItem as="p" className="eyebrow">
              <Icon name="pin" size={15} /> {property.zone}
              {property.city !== "Milano" ? ` · ${property.city}` : " · Milano"}
            </RevealItem>
            <RevealItem as="h1" className="property-hero__title">
              {property.name}
            </RevealItem>
          </Stagger>
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
              {property.rating && (
                <div>
                  <dt>Su Airbnb</dt>
                  <dd>
                    <Icon name="star" size={15} /> {property.rating.value} su 5 · {property.rating.count} recensioni
                    <span className="property-facts__note">dato di ottobre 2026</span>
                  </dd>
                </div>
              )}
            </dl>
            <a href={property.airbnb} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--block">
              Vedi l&apos;annuncio su Airbnb <Icon name="external" size={16} />
              <span className="sr-only">(si apre in una nuova scheda)</span>
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section section--paper owner-cta" aria-labelledby="owner-cta-title">
        <div className="container owner-cta__inner">
          <Reveal>
            <p className="eyebrow">Sei proprietario?</p>
            <h2 id="owner-cta-title" className="h2">
              Hai un immobile <em>simile a questo?</em>
            </h2>
            <p className="section-head__text">
              Raccontaci com&apos;è e dove si trova: valutiamo insieme il suo potenziale in affitto breve, gratuitamente.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <TrackedLink href="/analisi-gratuita" event="cta_analisi_click" location={`immobile-${property.slug}`} className="btn btn--lg" arrow>
              Richiedi un&apos;analisi gratuita
            </TrackedLink>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="others-title">
        <div className="container">
          <Reveal className="section-head section-head--split">
            <h2 id="others-title" className="h2">
              Altre case <em>a Milano</em>
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
