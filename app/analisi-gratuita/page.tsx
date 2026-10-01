import type { Metadata } from "next";
import LeadForm from "@/components/LeadForm";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Richiedi un'analisi gratuita",
  description:
    "Raccontaci il tuo immobile a Milano: prepariamo un'analisi gratuita e senza impegno del suo potenziale in affitto breve.",
  alternates: { canonical: "/analisi-gratuita" },
};

const next = [
  { title: "Leggiamo la tua richiesta", text: "Guardiamo zona, tipologia e situazione dell'immobile." },
  { title: "Ti ricontattiamo", text: "Per approfondire i dettagli e, se serve, fissare un sopralluogo." },
  { title: "Ricevi l'analisi", text: "Una valutazione personalizzata, con una proposta chiara se ha senso procedere." },
];

export default function AnalisiPage() {
  const whatsappHref = site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}` : "";

  return (
    <section className="section contact-page">
      <div className="container contact-page__grid">
        <div className="contact-page__aside">
          <Stagger gap={0.1}>
            <RevealItem as="p" className="eyebrow">
              Analisi gratuita
            </RevealItem>
            <RevealItem as="h1" className="page-hero__title">
              Raccontaci <em>la tua casa.</em>
            </RevealItem>
            <RevealItem as="p" className="lead">
              Ti diciamo con franchezza come può rendere in affitto breve e cosa servirebbe per partire. Gratis e senza
              impegno.
            </RevealItem>
          </Stagger>

          <Reveal className="next-steps">
            <h2 className="next-steps__title">Cosa succede dopo</h2>
            <ol>
              {next.map((n, i) => (
                <li key={n.title}>
                  <span aria-hidden="true">{i + 1}</span>
                  <div>
                    <strong>{n.title}</strong>
                    <p>{n.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="contact-alt">
            <h2 className="next-steps__title">Preferisci parlarne a voce?</h2>
            <p>Prenota una chiamata conoscitiva di 30 minuti con Gabriel Dal Molin, nel giorno e all&apos;ora che preferisci.</p>
            <TrackedLink href={site.calendly} event="calendly_click" location="analisi" className="btn btn--ghost" external>
              <Icon name="calendar" size={18} /> Prenota su Calendly
            </TrackedLink>
            {whatsappHref && (
              <TrackedLink href={whatsappHref} event="whatsapp_click" location="analisi" className="btn btn--ghost" external>
                <Icon name="whatsapp" size={18} /> Scrivici su WhatsApp
              </TrackedLink>
            )}
            {(site.email || site.phone) && (
              <ul className="contact-alt__list">
                {site.phone && (
                  <li>
                    <Icon name="phone" size={18} /> <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
                  </li>
                )}
                {site.email && (
                  <li>
                    <Icon name="mail" size={18} /> <a href={`mailto:${site.email}`}>{site.email}</a>
                  </li>
                )}
              </ul>
            )}
          </Reveal>
        </div>

        <Reveal className="contact-page__form" delay={0.15}>
          <LeadForm />
        </Reveal>
      </div>
    </section>
  );
}
