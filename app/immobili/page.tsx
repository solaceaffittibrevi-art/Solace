import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import PropertyCard from "@/components/PropertyCard";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import CtaBand from "@/components/CtaBand";
import { site } from "@/lib/site";
import { properties } from "@/lib/immobili";

export const metadata: Metadata = pageMetadata({
  title: "Gli Appartamenti Gestiti da Solace | Milano e Dintorni",
  description:
    "Alcuni appartamenti in affitto breve gestiti da Solace a Milano e dintorni, dal Duomo a Como, con il collegamento agli annunci reali su Airbnb.",
  path: "/immobili",
});

export default function ImmobiliPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Gli appartamenti <em>che gestiamo.</em>
          </>
        }
        lead="Una selezione di case in affitto breve gestite da Solace a Milano e dintorni: zone, stili e ospiti diversi, con lo stesso metodo di gestione. Ogni scheda rimanda all'annuncio reale su Airbnb."
      />

      <section className="section property-list" aria-labelledby="selezione-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="selezione-title" className="h2">
              Milano e dintorni
            </h2>
            <p className="section-head__text">
              {properties.length} immobili in questa selezione, su oltre 30 in gestione.
            </p>
          </Reveal>
          <Stagger as="ul" className="property-grid" gap={0.08}>
            {properties.map((p, i) => (
              <RevealItem as="li" key={p.listingId}>
                <PropertyCard property={p} priority={i < 3} />
              </RevealItem>
            ))}
          </Stagger>
          <Reveal className="property-list__more">
            <a href={site.airbnbProfile} target="_blank" rel="noopener noreferrer" className="link-arrow">
              Tutti gli annunci sul profilo Airbnb di Solace
              <span className="sr-only">(si apre in una nuova scheda)</span>
            </a>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Hai una casa da affidarci?" />
    </>
  );
}
