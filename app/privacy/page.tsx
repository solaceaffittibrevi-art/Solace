import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const metadata: Metadata = pageMetadata({
  title: "Informativa Privacy | Solace",
  description:
    "Come Solace tratta i dati inviati con il modulo di analisi gratuita dell'immobile: finalità, basi giuridiche, fornitori, conservazione per 12 mesi e diritti.",
  path: "/privacy",
});

// Testo basato sul funzionamento effettivo del sito (modulo → Google Apps Script → Gmail, hosting Vercel,
// archivio temporaneo Upstash, statistiche solo con consenso). Aggiornare se cambiano servizi o tempi.
const UPDATED = "2 ottobre 2026";
const ga = Boolean(process.env.NEXT_PUBLIC_GA4_ID);

export default function PrivacyPage() {
  const a = site.address;
  return (
    <section className="section legal">
      <div className="container legal__inner">
        <h1 className="page-hero__title">Informativa privacy</h1>
        <p className="legal__updated">Ultimo aggiornamento: {UPDATED}</p>

        <h2>1. Titolare del trattamento</h2>
        <p>
          {site.business}, P. IVA {site.vat}, con sede legale in {a.street}, {a.postalCode} {a.city} ({a.province}),{" "}
          {a.country}. Per qualsiasi richiesta sulla privacy: <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
        </p>

        <h2>2. Quali dati trattiamo</h2>
        <h3>Dati che ci invii con il modulo</h3>
        <ul>
          <li>Obbligatori: nome, un recapito (telefono o email) e il comune o la zona dell&apos;immobile.</li>
          <li>
            Facoltativi: tipologia dell&apos;immobile, numero di immobili, situazione attuale e il messaggio che scrivi.
          </li>
          <li>La data e l&apos;ora di ricezione della richiesta.</li>
          <li>
            Solo se hai dato il consenso alle statistiche: la pagina da cui sei entrato nel sito, il sito di
            provenienza e gli eventuali parametri della campagna (ad esempio utm_source). Vengono allegati alla tua
            richiesta.
          </li>
        </ul>
        <p>
          Ti chiediamo di non inserire nel messaggio dati non necessari, in particolare dati sensibili o di altre
          persone.
        </p>

        <h3>Dati trattati per la sicurezza del modulo</h3>
        <ul>
          <li>
            L&apos;indirizzo IP da cui invii la richiesta viene trasformato in un&apos;impronta crittografica (hash
            SHA-256) per limitare il numero di invii e prevenire abusi. È un dato <strong>pseudonimizzato</strong>, non
            anonimo, e viene conservato al massimo 24 ore.
          </li>
          <li>
            Un codice casuale associato a ogni invio, per evitare che la stessa richiesta venga recapitata due volte:
            conservato fino a 1 ora sul server del sito e fino a 6 ore nel servizio che inoltra l&apos;email.
          </li>
        </ul>

        <h3>Dati di navigazione</h3>
        <p>
          Il fornitore di hosting tratta i dati tecnici necessari a mostrare il sito e a proteggerlo (ad esempio
          indirizzo IP, tipo di browser, pagine richieste, data e ora), secondo i tempi previsti dalla sua
          infrastruttura. I registri del nostro modulo non contengono nome, recapiti o testo delle richieste.
        </p>
        {ga && (
          <p>
            Solo con il tuo consenso usiamo Google Analytics per misurare in forma aggregata le visite e le azioni sul
            sito (ad esempio l&apos;invio del modulo, senza i dati che hai scritto). Dettagli nella{" "}
            <Link href={site.cookieUrl}>cookie policy</Link>.
          </p>
        )}

        <h2>3. Perché li trattiamo e su quale base</h2>
        <ul>
          <li>
            <strong>Rispondere alla tua richiesta</strong> e, se lo desideri, preparare l&apos;analisi gratuita e una
            proposta di gestione: misure precontrattuali adottate su tua richiesta (art. 6, par. 1, lett. b GDPR).
          </li>
          <li>
            <strong>Proteggere il modulo da abusi e invii automatici</strong>: legittimo interesse del titolare alla
            sicurezza del sito (art. 6, par. 1, lett. f GDPR).
          </li>
          <li>
            <strong>Statistiche e provenienza delle visite</strong>: consenso (art. 6, par. 1, lett. a GDPR), che puoi
            revocare in ogni momento senza conseguenze.
          </li>
        </ul>
        <p>
          I dati obbligatori del modulo servono per poterti ricontattare: senza, non possiamo rispondere alla
          richiesta. Non prendiamo decisioni automatizzate e non facciamo profilazione.
        </p>

        <h2>4. A chi vengono comunicati</h2>
        <p>I dati non vengono venduti né ceduti. Li trattano, per nostro conto e solo per quanto necessario:</p>
        <ul>
          <li>
            <strong>Google</strong> (Gmail e Google Apps Script): la richiesta viene inviata e conservata nella casella{" "}
            {site.privacyEmail}.
          </li>
          <li>
            <strong>Vercel Inc.</strong>: hosting del sito ed esecuzione del modulo.
          </li>
          <li>
            <strong>Upstash</strong>: archivio temporaneo, su server nell&apos;Unione europea, per il limite di invii e
            per evitare i doppioni (impronta dell&apos;IP e codice dell&apos;invio).
          </li>
          {ga && (
            <li>
              <strong>Google Ireland Limited</strong> (Google Analytics): solo con il tuo consenso.
            </li>
          )}
        </ul>
        <p>
          Alcuni di questi fornitori possono trattare dati negli Stati Uniti. In questi casi il trasferimento avviene
          sulla base del Data Privacy Framework UE-USA o delle clausole contrattuali standard approvate dalla
          Commissione europea, secondo quanto previsto dai fornitori.
        </p>
        <p>
          Se ci contatti tramite WhatsApp, Calendly, Instagram o Airbnb, quei servizi trattano i dati secondo le
          proprie informative.
        </p>

        <h2>5. Per quanto tempo li conserviamo</h2>
        <ul>
          <li>
            <strong>Richieste inviate con il modulo: 12 mesi</strong> dalla ricezione, poi vengono cancellate. Se nasce
            un rapporto di collaborazione, i dati necessari sono conservati per la sua durata e per gli obblighi di
            legge che ne derivano (ad esempio fiscali).
          </li>
          <li>Impronta dell&apos;indirizzo IP: al massimo 24 ore.</li>
          <li>Codice dell&apos;invio: da 1 a 6 ore.</li>
          <li>
            Provenienza della visita: nel tuo browser fino alla chiusura della scheda, poi solo all&apos;interno della
            richiesta inviata (12 mesi).
          </li>
          <li>Scelta sui cookie: nel tuo browser per 6 mesi.</li>
        </ul>

        <h2>6. I tuoi diritti</h2>
        <p>
          Puoi chiedere in qualsiasi momento l&apos;accesso ai tuoi dati, la rettifica, la cancellazione, la
          limitazione del trattamento e la portabilità, e opporti al trattamento basato sul legittimo interesse (artt.
          15–21 GDPR). Puoi revocare il consenso alle statistiche da <CookiePreferencesButton className="legal__link" />.
          Scrivi a <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>: rispondiamo entro un mese.
        </p>
        <p>
          Hai anche il diritto di proporre reclamo al Garante per la protezione dei dati personali (
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
            www.garanteprivacy.it
          </a>
          ).
        </p>

        <h2>7. Modifiche</h2>
        <p>
          Aggiorniamo questa informativa se cambiano i servizi utilizzati o le modalità di trattamento. La data in alto
          indica l&apos;ultima versione. Per i cookie e le tecnologie simili vedi la{" "}
          <Link href={site.cookieUrl}>cookie policy</Link>.
        </p>
      </div>
    </section>
  );
}
