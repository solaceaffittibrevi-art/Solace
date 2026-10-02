// Provenienza della richiesta: si salva alla prima pagina visitata nella sessione e viaggia
// solo con la richiesta inviata al sistema di ricezione (mai agli strumenti di analytics).
// Solo con il consenso "statistiche": senza consenso non si salva nulla e la richiesta parte
// senza provenienza.
import { hasStatisticsConsent } from "./consent";
export type LeadSource = {
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
};

const KEY = "solace-source";

export function captureSource() {
  try {
    if (!hasStatisticsConsent() || sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const referrer = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "";
    const source: LeadSource = {
      landingPage: window.location.pathname,
      referrer: referrer || undefined,
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
      utmContent: params.get("utm_content") ?? undefined,
      utmTerm: params.get("utm_term") ?? undefined,
    };
    sessionStorage.setItem(KEY, JSON.stringify(source));
  } catch {
    // Archiviazione non disponibile (navigazione privata o bloccata): si procede senza provenienza.
  }
}

export function clearSource() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}

export function readSource(): LeadSource {
  try {
    if (!hasStatisticsConsent()) return {};
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as LeadSource;
  } catch {
    return {};
  }
}
