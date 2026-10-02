import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import FaqList from "@/components/FaqList";
import { Reveal } from "@/components/motion/Reveal";
import CtaBand from "@/components/CtaBand";
import { faqs } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Domande Frequenti sulla Gestione Affitti Brevi | Solace",
  description:
    "Risposte ai proprietari sulla gestione di affitti brevi e Airbnb a Milano: servizi, compenso, ospiti, pulizie, rendiconti, adempimenti e contratto.",
  path: "/faq",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Tutto quello che vorresti sapere <em>prima di affidarci la casa.</em>
          </>
        }
        lead="Le condizioni precise sono sempre scritte nella proposta e nel contratto. Qui trovi le risposte alle domande più comuni."
      />
      <section className="section faq-page">
        <div className="container faq-page__inner">
          <Reveal>
            <FaqList items={faqs} initiallyOpen={null} />
          </Reveal>
        </div>
      </section>
      <CtaBand title="Non hai trovato la tua domanda?" text="Scrivicela nel modulo o chiedila durante la chiamata conoscitiva: rispondiamo a tutto." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
