import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import ProcessStory from "@/components/ProcessStory";
import GlassIcon from "@/components/GlassIcon";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = pageMetadata({
  title: "Come Funziona la Gestione Affitti Brevi | Solace",
  description:
    "Dal primo contatto ai risultati: come Solace analizza il tuo immobile, prepara l'avvio e gestisce gli affitti brevi a Milano, passo dopo passo e senza impegno iniziale.",
  path: "/come-funziona",
});

const toPrepare = [
  { icon: "pin", title: "Zona e indirizzo indicativo", text: "Per capire domanda e concorrenza." },
  { icon: "home", title: "Tipologia e metratura", text: "Quante camere, quanti posti letto, stato degli arredi." },
  { icon: "calendar", title: "Situazione attuale", text: "Vuoto, già in affitto breve o con un contratto in corso." },
  { icon: "camera", title: "Qualche foto, se le hai", text: "Non servono professionali: ci aiutano a farci un'idea." },
];

const promises = [
  "Ti diciamo con franchezza se l'affitto breve ha senso per il tuo immobile.",
  "Compenso e servizi inclusi sono scritti nella proposta, prima di qualsiasi firma.",
  "I tempi di avvio dipendono dalla casa e dalle pratiche: li concordiamo insieme.",
];

export default function ComeFunzionaPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Un percorso chiaro, <em>dal primo contatto ai risultati.</em>
          </>
        }
        lead="Nessun salto nel buio nella gestione del tuo affitto breve: prima l'analisi gratuita dell'immobile per capirne il potenziale, poi decidi tu se e come partire."
        image="/images/come-funziona/soggiorno-cucina-pronto-per-gli-ospiti.jpg"
        imageAlt="Soggiorno luminoso pronto per gli ospiti, con divano, tavolo apparecchiato e cucina in legno"
        imagePosition={{ desktop: "52% 60%", mobile: "50% 60%" }}
      />

      <section className="section process" aria-labelledby="steps-title">
        <div className="container">
          <Reveal className="section-head">
            <h2 id="steps-title" className="h2">
              Cosa succede, <em>e quando.</em>
            </h2>
          </Reveal>
          <ProcessStory detailed />
        </div>
      </section>

      <section className="section section--paper prepare" aria-labelledby="prepare-title">
        <div className="container prepare__grid">
          <Reveal className="section-head">
            <h2 id="prepare-title" className="h2">
              Cosa ci serve per iniziare
            </h2>
            <p className="section-head__text">
              Bastano poche informazioni. Il resto lo approfondiamo insieme durante la chiamata o il sopralluogo.
            </p>
          </Reveal>
          <Stagger as="ul" className="prepare__list" gap={0.1}>
            {toPrepare.map((t) => (
              <RevealItem as="li" key={t.title} className="prepare__item">
                <GlassIcon name={t.icon} />
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section promises" aria-labelledby="promises-title">
        <div className="container promises__inner">
          <Reveal>
            <h2 id="promises-title" className="h2">
              I nostri impegni, <em>fin dall&apos;inizio.</em>
            </h2>
          </Reveal>
          <Stagger as="ul" className="promises__list" gap={0.12}>
            {promises.map((p) => (
              <RevealItem as="li" key={p}>
                <GlassIcon name="check" size="sm" />
                <span>{p}</span>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
