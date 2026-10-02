import Image from "next/image";
import LeadForm from "./LeadForm";
import GlassIcon from "./GlassIcon";
import { Reveal } from "./motion/Reveal";
import { steps } from "@/lib/site";

// Richiesta di valutazione direttamente in pagina: nessun passaggio intermedio.
export default function LeadSection({ id = "valutazione", location }: { id?: string; location: string }) {
  return (
    <section id={id} className="section lead-section" aria-labelledby={`${id}-title`}>
      <div className="container lead-section__grid">
        <Reveal className="lead-section__intro">
          <h2 id={`${id}-title`} className="h2">
            Richiedi una valutazione <em>del tuo immobile.</em>
          </h2>
          <p className="section-head__text">
            È gratuita e non ti impegna a nulla. Ti diciamo con franchezza se e come la tua casa può funzionare in
            affitto breve.
          </p>
          <h3 className="next-steps__title">Cosa succede dopo l&apos;invio</h3>
          <ol className="next-steps__list">
            {steps.map((s, i) => (
              <li key={s.title}>
                <GlassIcon size="md">
                  <span aria-hidden="true">{i + 1}</span>
                </GlassIcon>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal className="contact-page__form" delay={0.1}>
          <div className="form-host">
            <Image src="/images/team/gabriel-avatar.jpg" alt="" width={56} height={56} className="form-host__photo" />
            <p>
              <strong>Ti risponde Gabriel Dal Molin,</strong> fondatore di Solace.
            </p>
          </div>
          <LeadForm location={location} />
        </Reveal>
      </div>
    </section>
  );
}
