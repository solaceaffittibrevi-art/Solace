import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import LeadForm from "@/components/LeadForm";
import Icon from "@/components/Icon";
import GlassIcon from "@/components/GlassIcon";
import TrackedLink from "@/components/TrackedLink";
import { Reveal } from "@/components/motion/Reveal";
import { site, steps } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Analisi Gratuita del Tuo Immobile | Solace",
  description:
    "Richiedi l'analisi gratuita del tuo immobile a Milano per gli affitti brevi: una valutazione senza impegno del potenziale, con la risposta del team Solace.",
  path: "/valutazione-gratuita",
});

export default function ValutazionePage() {
  const whatsappHref = `https://wa.me/${site.whatsapp}`;

  return (
    <section className="section contact-page">
      <div className="container contact-page__grid">
        <div className="contact-page__intro">
          <h1 className="page-hero__title enter" style={{ "--i": 0 } as React.CSSProperties}>
            Richiedi una valutazione <em>del tuo immobile.</em>
          </h1>
          <p className="lead enter" style={{ "--i": 1 } as React.CSSProperties}>
            L&apos;analisi dell&apos;immobile è gratuita e senza impegno. Ti diciamo con franchezza come può rendere la tua casa in affitto breve e cosa
            servirebbe per partire.
          </p>
        </div>

        <div className="contact-page__form enter" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="form-host">
            <Image src="/images/team/gabriel-avatar.jpg" alt="" width={56} height={56} className="form-host__photo" priority />
            <p>
              <strong>Ti risponde Gabriel Dal Molin,</strong> fondatore di Solace.
            </p>
          </div>
          <LeadForm location="valutazione" />
        </div>

        <div className="contact-page__more">
          <Reveal className="next-steps">
            <h2 className="next-steps__title">Cosa succede dopo l&apos;invio</h2>
            <ol className="next-steps__list">
              {steps.map((n, i) => (
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
            <h2 className="next-steps__title">Preferisci parlarne subito?</h2>
            <p>Scrivici su WhatsApp o prenota una chiamata conoscitiva di 30 minuti, nel giorno e all&apos;ora che preferisci.</p>
            <div className="contact-alt__actions">
              <TrackedLink href={whatsappHref} event="whatsapp_click" location="valutazione" className="btn btn--ghost" external>
                <Icon name="whatsapp" size={18} /> Scrivici su WhatsApp
              </TrackedLink>
              <TrackedLink href={site.calendly} event="calendly_click" location="valutazione" className="btn btn--ghost" external>
                <Icon name="calendar" size={18} /> Prenota una chiamata
              </TrackedLink>
            </div>
            <ul className="contact-alt__list">
              <li>
                <GlassIcon name="phone" size="sm" />{" "}
                <TrackedLink href={`tel:${site.phone.replace(/\s/g, "")}`} event="phone_click" location="valutazione">
                  {site.phone}
                </TrackedLink>
              </li>
              <li>
                <GlassIcon name="mail" size="sm" />{" "}
                <TrackedLink href={`mailto:${site.email}`} event="email_click" location="valutazione">
                  {site.email}
                </TrackedLink>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
