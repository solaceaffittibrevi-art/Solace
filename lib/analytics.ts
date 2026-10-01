// Eventi di conversione. Nessun dato personale: solo il nome dell'evento e dove è avvenuto.
// Non c'è ancora uno strumento di analytics: quando verrà aggiunto (GA4 / Tag Manager),
// gli eventi arriveranno in window.dataLayer senza modificare i componenti.
export type ConversionEvent =
  | "cta_analisi_click"
  | "lead_submit_success"
  | "calendly_click"
  | "whatsapp_click";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: ConversionEvent, location?: string) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ event, location });
}
