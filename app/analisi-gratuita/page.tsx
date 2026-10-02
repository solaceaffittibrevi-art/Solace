import type { Metadata } from "next";
import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import Icon from "@/components/Icon";
import GlassIcon from "@/components/GlassIcon";
import TrackedLink from "@/components/TrackedLink";
import { Reveal } from "@/components/motion/Reveal";
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
        <div className="contact-page__intro">
          <h1 className="page-hero__title enter" style={{ "--i": 0 } as React.CSSProperties}>
            Raccontaci <em>la tua casa.</em>
          </h1>
          <p className="lead enter" style={{ "--i": 1 } as React.CSSProperties}>
            Ti diciamo con franchezza come può rendere in affitto breve e cosa servirebbe per partire. Gratis e senza
            impegno.
          </p>
        </div>

        <div className="contact-page__form enter" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="form-host">
            <Image
              src="/images/team/gabriel-avatar.jpg"
              alt=""
              width={56}
              height={56}
              className="form-host__photo"
            />
            <p>
              <strong>Ti risponde Gabriel Dal Molin,</strong> fondatore di Solace.
            </p>
          </div>
          <LeadForm />
        </div>

        <div className="contact-page__more">
          <Reveal className="next-steps">
            <h2 className="next-steps__title">Cosa succede dopo</h2>
            <ol>
              {next.map((n, i) => (
                <li key={n.title}>
                  <GlassIcon size="md">
                    <span aria-hidden="true">{i + 1}</span>
                  </GlassIcon>
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
            <p>Prenota una chiamata conoscitiva di 30 minuti con Gabriel, nel giorno e all&apos;ora che preferisci.</p>
            <div className="contact-alt__actions">
              <TrackedLink href={site.calendly} event="calendly_click" location="analisi" className="btn btn--ghost" external>
                <Icon name="calendar" size={18} /> Prenota una chiamata
              </TrackedLink>
              {whatsappHref && (
                <TrackedLink href={whatsappHref} event="whatsapp_click" location="analisi" className="btn btn--ghost" external>
                  <Icon name="whatsapp" size={18} /> Scrivici su WhatsApp
                </TrackedLink>
              )}
            </div>
            {(site.email || site.phone) && (
              <ul className="contact-alt__list">
                {site.phone && (
                  <li>
                    <GlassIcon name="phone" size="sm" /> <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
                  </li>
                )}
                {site.email && (
                  <li>
                    <GlassIcon name="mail" size="sm" /> <a href={`mailto:${site.email}`}>{site.email}</a>
                  </li>
                )}
              </ul>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
