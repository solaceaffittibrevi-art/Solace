import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import { Reveal } from "./motion/Reveal";

// "Chi seguirà il tuo immobile": il fondatore, in breve. Biografia completa in /chi-siamo.
export default function FounderBlock() {
  return (
    <section className="section section--deep founder" aria-labelledby="founder-title">
      <div className="container founder__grid">
        <Reveal className="founder__photo">
          <Image
            src="/images/team/gabriel-dal-molin.jpg"
            alt="Ritratto di Gabriel Dal Molin, fondatore di Solace"
            fill
            sizes="(max-width: 960px) 60vw, 28vw"
          />
        </Reveal>
        <Reveal className="founder__text" delay={0.1}>
          <h2 id="founder-title" className="h2">
            Chi seguirà il tuo immobile
          </h2>
          <p className="lead">
            Sono Gabriel Dal Molin e ho creato Solace per offrire ai proprietari una gestione organizzata e attenta.
          </p>
          <p>
            Il nostro team professionale si occupa della gestione quotidiana degli immobili, dell&apos;assistenza agli
            ospiti e del coordinamento dei servizi, con cura e attenzione ai dettagli. Lavoriamo soprattutto a Milano,
            tra appartamenti da preparare, ospiti da accogliere e imprevisti da risolvere.
            Ho anche cofondato Omnia Multiservizi, che si occupa di pulizie per affitti brevi: per questo so quanto conti
            una casa pronta e in ordine a ogni arrivo.
          </p>
          <p>
            Prima di parlare di numeri, voglio capire cosa ti aspetti dalla tua casa e quanto vuoi essere coinvolto.
          </p>
          <Link href="/chi-siamo" className="link-arrow">
            Conosci meglio Solace <Icon name="arrow" size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
