// Eventi di misurazione. Mai dati personali: solo il nome dell'evento, il punto della pagina
// e, per gli errori, il tipo di errore. Nessun nome, telefono, email o testo libero.
//
// Al momento il sito non ha uno strumento di analytics né un banner dei consensi: gli eventi
// vengono scritti in window.dataLayer solo se esiste (cioè solo dopo che Tag Manager / GA4
// saranno installati e attivati nel rispetto dei consensi). Altrimenti non succede nulla.
//
// Clic e contatti ricevuti sono eventi distinti:
// - cta_click, whatsapp_click, phone_click, email_click, calendly_click: intenzioni (clic)
// - form_start: il visitatore inizia a compilare il modulo
// - form_error: il modulo non è stato inviato (validazione o consegna)
// - lead_submit_success: la richiesta è arrivata davvero al sistema di ricezione
export type ConversionEvent =
  | "cta_click"
  | "form_start"
  | "form_error"
  | "lead_submit_success"
  | "calendly_click"
  | "whatsapp_click"
  | "phone_click"
  | "email_click";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: ConversionEvent, location?: string, detail?: string) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ event, location, ...(detail && { detail }) });
}
