import { Reveal } from "./motion/Reveal";
import TrackedLink from "./TrackedLink";
import { site } from "@/lib/site";

export default function CtaBand({
  title = "Raccontaci la tua casa.",
  text = "L'analisi è gratuita e senza impegno: ti diciamo con franchezza se e come può funzionare in affitto breve.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="cta-band" aria-labelledby="cta-band-title">
      <div className="container cta-band__inner">
        <Reveal>
          <p className="eyebrow">Analisi gratuita</p>
          <h2 id="cta-band-title" className="cta-band__title">
            {title}
          </h2>
          <p className="cta-band__text">{text}</p>
        </Reveal>
        <Reveal className="cta-band__actions" delay={0.1}>
          <TrackedLink href="/analisi-gratuita" event="cta_analisi_click" location="cta-band" className="btn">
            Richiedi un&apos;analisi gratuita
          </TrackedLink>
          <TrackedLink href={site.calendly} event="calendly_click" location="cta-band" className="btn btn--ghost" external>
            Prenota una chiamata
          </TrackedLink>
        </Reveal>
      </div>
    </section>
  );
}
