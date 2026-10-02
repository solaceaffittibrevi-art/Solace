import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy | Solace",
  description:
    "Quali cookie e tecnologie simili usa il sito Solace: strumenti tecnici sempre attivi e statistiche solo con il tuo consenso. Come cambiare la scelta.",
  path: "/cookie",
});

const UPDATED = "2 ottobre 2026";
const ga = Boolean(process.env.NEXT_PUBLIC_GA4_ID);

export default function CookiePage() {
  return (
    <section className="section legal">
      <div className="container legal__inner">
        <h1 className="page-hero__title">Cookie policy</h1>
        <p className="legal__updated">Ultimo aggiornamento: {UPDATED}</p>

        <p>
          Questa pagina descrive i cookie e le tecnologie simili (come la memoria locale del browser) usati su questo
          sito da {site.business}, titolare del trattamento. Per il resto dei trattamenti vedi l&apos;
          <Link href={site.privacyUrl}>informativa privacy</Link>.
        </p>

        <h2>Tecnici, sempre attivi</h2>
        <div className="legal__table-wrap">
          <table className="legal__table">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Tipo</th>
                <th scope="col">A cosa serve</th>
                <th scope="col">Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>solace-consenso</td>
                <td>Memoria locale del browser</td>
                <td>Ricorda la tua scelta sui cookie, per non chiedertela a ogni pagina.</td>
                <td>6 mesi, poi la scelta viene chiesta di nuovo</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Gli strumenti tecnici non richiedono il consenso perché sono necessari al funzionamento del sito.</p>

        <h2>Statistiche, solo con il tuo consenso</h2>
        <div className="legal__table-wrap">
          <table className="legal__table">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Tipo</th>
                <th scope="col">A cosa serve</th>
                <th scope="col">Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>solace-source</td>
                <td>Memoria di sessione del browser (prima parte)</td>
                <td>
                  Registra la pagina d&apos;ingresso, il sito di provenienza e gli eventuali parametri della campagna.
                  Viene inviato solo insieme a una richiesta che decidi di inviare con il modulo.
                </td>
                <td>Fino alla chiusura della scheda</td>
              </tr>
              {ga && (
                <tr>
                  <td>_ga, _ga_&lt;ID&gt;</td>
                  <td>Cookie di Google Analytics (Google Ireland Limited)</td>
                  <td>
                    Misurano in forma aggregata visite e azioni sul sito. Segnali pubblicitari e personalizzazione degli
                    annunci sono disattivati.
                  </td>
                  <td>Fino a 13 mesi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p>
          Senza il tuo consenso questi strumenti restano bloccati: nulla viene salvato
          {ga ? " e Google Analytics non viene caricato" : ""}.
        </p>

        <h2>Contenuti di terze parti</h2>
        <p>
          Foto, video e caratteri tipografici sono serviti direttamente dal nostro sito: nessun servizio esterno li
          carica. I collegamenti ad Airbnb, Instagram, WhatsApp e Calendly portano su quei siti, che applicano le
          proprie regole sui cookie solo quando li apri.
        </p>

        <h2>Come cambiare la scelta</h2>
        <p>
          Puoi accettare, rifiutare o modificare il consenso in qualsiasi momento da{" "}
          <CookiePreferencesButton className="legal__link" />, presente anche in fondo a ogni pagina. Chiudere il
          banner equivale a rifiutare. Puoi inoltre cancellare cookie e dati dei siti dalle impostazioni del browser.
        </p>
      </div>
    </section>
  );
}
