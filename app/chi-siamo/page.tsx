import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import Parallax from "@/components/motion/Parallax";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import CtaBand from "@/components/CtaBand";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "Solace è una realtà di gestione affitti brevi a Milano. Conosci il metodo e la persona che segue il rapporto con i proprietari.",
  alternates: { canonical: "/chi-siamo" },
};

const method = [
  {
    icon: "search",
    title: "Prima capire, poi proporre",
    text: "Ogni collaborazione parte da un'analisi della casa e degli obiettivi del proprietario. Se l'affitto breve non è la scelta giusta, lo diciamo.",
  },
  {
    icon: "eye",
    title: "Trasparenza verificabile",
    text: "Report a ogni prenotazione e accesso alle piattaforme: puoi controllare in ogni momento cosa succede nella tua casa.",
  },
  {
    icon: "home",
    title: "Standard da ospitalità",
    text: "Pulizie professionali, biancheria di qualità, accesso semplice e risposte rapide: gli ospiti lo notano, le recensioni lo raccontano.",
  },
  {
    icon: "people",
    title: "Persone, non un call center",
    text: "Un referente diretto e un manager che conosce la tua casa sul posto, raggiungibili su un canale dedicato.",
  },
];

export default function ChiSiamoPage() {
  return (
    <>
      <PageHero
        eyebrow="Chi siamo"
        title={
          <>
            La tranquillità di affidarsi, <em>il piacere di ospitare.</em>
          </>
        }
        lead="Solace nasce a Milano per chi possiede una casa e vuole farla rendere in affitto breve senza trasformarlo in un secondo lavoro."
        image="/images/immobili/suite-royale/01.jpg"
        imageAlt="Cucina in marmo della Suite Royale, appartamento gestito da Solace vicino al Duomo"
      />

      <section className="section about" aria-labelledby="about-title">
        <div className="container about__grid">
          <Reveal className="about__text">
            <p className="eyebrow">Solace Real Estate Short Rent</p>
            <h2 id="about-title" className="h2">
              Gestiamo case come <em>vorremmo fosse gestita la nostra.</em>
            </h2>
            <p>
              Ci occupiamo di affitti brevi a Milano: dalla preparazione dell&apos;annuncio all&apos;accoglienza degli ospiti,
              dalle pulizie agli adempimenti, fino al rendiconto per il proprietario.
            </p>
            <p>
              Oggi seguiamo oltre 30 immobili, dal centro storico ai Navigli, e su Airbnb gli ospiti delle nostre case
              hanno lasciato più di 1.200 recensioni. Numeri che contano perché dietro ognuno c&apos;è un soggiorno curato.
            </p>
          </Reveal>
          <Reveal className="about__media" delay={0.1}>
            <Parallax strength={6}>
              <Image
                src="/images/immobili/navigli/01.jpg"
                alt="Soggiorno della Casa sui Navigli con travi a vista e camino"
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </Parallax>
          </Reveal>
        </div>
      </section>

      <section className="section section--deep person" aria-labelledby="person-title">
        <div className="container person__grid">
          <div className="person__aside">
            <Reveal className="person__photo">
              <Parallax strength={4}>
                <Image
                  src="/images/team/gabriel-dal-molin.jpg"
                  alt="Ritratto di Gabriel Dal Molin, fondatore di Solace"
                  fill
                  sizes="(max-width: 960px) 80vw, 34vw"
                />
              </Parallax>
            </Reveal>
            <Reveal as="p" className="person__caption" delay={0.1}>
              <strong>Gabriel Dal Molin</strong>
              <span>Fondatore di Solace</span>
            </Reveal>
          </div>

          <div className="person__text">
            <Reveal>
              <p className="eyebrow">Il fondatore</p>
              <h2 id="person-title" className="h2">
                Ciao, <em>sono Gabriel.</em>
              </h2>
            </Reveal>
            <Stagger className="person__bio" gap={0.08}>
              <RevealItem as="p" className="lead">
                Ho fondato Solace per aiutare i proprietari a mettere a reddito la propria casa senza ritrovarsi con un
                secondo lavoro da gestire.
              </RevealItem>
              <RevealItem as="p">
                Il mio lavoro si svolge soprattutto a Milano e comprende molto più delle prenotazioni. Ci sono le
                telefonate con i proprietari, gli appartamenti da preparare, gli ospiti che hanno bisogno di una mano e gli
                imprevisti da risolvere. È seguendo questi aspetti in prima persona che ho imparato cosa significa gestire
                una casa affidata da qualcun altro.
              </RevealItem>
              <RevealItem as="blockquote" className="person__quote">
                <p>So che dietro un immobile ci sono sacrifici, aspettative e, spesso, un legame personale.</p>
              </RevealItem>
              <RevealItem as="p">
                Per questo, prima di parlare di rendimenti, mi interessa capire chi ho davanti: cosa si aspetta dalla
                propria casa, quali preoccupazioni ha e quanto vuole essere coinvolto nella gestione.
              </RevealItem>
              <RevealItem as="p">
                Sono una persona pratica e attenta ai numeri. Mi piace capire dove possiamo migliorare: un prezzo da
                rivedere, un annuncio da valorizzare, un costo da tenere sotto controllo. Quando valuto un immobile, voglio
                poterti spiegare il ragionamento dietro una previsione, comprese le incertezze.
              </RevealItem>
              <RevealItem as="p">
                Ho anche cofondato Omnia Multiservizi, che si occupa di pulizie per affitti brevi. Questa esperienza mi ha
                insegnato quanto contino le cose che un ospite nota appena entra: una casa davvero pulita, la biancheria in
                ordine, la cura con cui è stato preparato tutto. Sono dettagli che richiedono organizzazione e persone su
                cui poter contare.
              </RevealItem>
              <RevealItem as="p">
                Se scegli di affidarti a me, voglio che tu sappia chi si sta occupando della tua casa e come sta andando.
                Per me significa parlare chiaro, condividere i risultati e affrontare anche le conversazioni meno comode
                quando qualcosa va sistemato.
              </RevealItem>
              <RevealItem as="p" className="person__closing">
                La fiducia, in questo lavoro, si costruisce così: facendo quello che ci si è detti e prendendosi la
                responsabilità di seguire le cose fino in fondo.
              </RevealItem>
              <RevealItem className="person__actions">
                <TrackedLink href={site.calendly} event="calendly_click" location="chi-siamo" className="btn" external>
                  Prenota una chiamata con Gabriel
                </TrackedLink>
                <TrackedLink
                  href={`https://wa.me/${site.whatsapp}`}
                  event="whatsapp_click"
                  location="chi-siamo"
                  className="btn btn--ghost"
                  external
                >
                  Scrivimi su WhatsApp
                </TrackedLink>
              </RevealItem>
            </Stagger>
          </div>
        </div>
      </section>

      <section className="section method" aria-labelledby="method-title">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Il metodo</p>
            <h2 id="method-title" className="h2">
              Quattro principi <em>che non cambiano.</em>
            </h2>
          </Reveal>
          <Stagger as="ol" className="method__list" gap={0.12}>
            {method.map((m, i) => (
              <RevealItem as="li" key={m.title} className="method__item">
                <span className="method__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon name={m.icon} size={28} />
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand title="Parliamone con calma." text="Una chiamata di mezz'ora per conoscerci e capire se possiamo esserti utili." />
    </>
  );
}
