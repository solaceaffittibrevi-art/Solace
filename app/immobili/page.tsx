import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import PropertyCard from "@/components/PropertyCard";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import CtaBand from "@/components/CtaBand";
import { properties, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Immobili gestiti",
  description:
    "Una selezione degli appartamenti in gestione Solace a Milano, dal Duomo ai Navigli, e alcuni immobili fuori città.",
  alternates: { canonical: "/immobili" },
};

export default function ImmobiliPage() {
  const milano = properties.filter((p) => p.milano);
  const altri = properties.filter((p) => !p.milano);

  return (
    <>
      <PageHero
        title={
          <>
            Una selezione delle case <em>che gestiamo.</em>
          </>
        }
        lead="Appartamenti diversi per zona, stile e ospiti, con un metodo comune. Ogni scheda rimanda all'annuncio reale su Airbnb."
      />

      <section className="section property-list" aria-labelledby="milano-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="milano-title" className="h2">
              A Milano
            </h2>
            <p className="section-head__text">{milano.length} immobili in questa selezione, su oltre 30 in gestione.</p>
          </Reveal>
          <Stagger as="ul" className="property-grid" gap={0.08}>
            {milano.map((p, i) => (
              <RevealItem as="li" key={p.slug}>
                <PropertyCard property={p} priority={i < 3} />
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section section--paper property-list" aria-labelledby="altri-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="altri-title" className="h2">
              Area metropolitana e oltre
            </h2>
            <p className="section-head__text">
              Il cuore del nostro lavoro è Milano, ma seguiamo anche alcuni immobili fuori città.
            </p>
          </Reveal>
          <Stagger as="ul" className="property-grid property-grid--two" gap={0.1}>
            {altri.map((p) => (
              <RevealItem as="li" key={p.slug}>
                <PropertyCard property={p} />
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
