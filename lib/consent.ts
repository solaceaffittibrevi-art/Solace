// Consenso ai cookie e alle tecnologie simili. Una sola categoria facoltativa: "statistiche"
// (provenienza della visita allegata alla richiesta e, se configurato, Google Analytics).
// Finché non c'è un consenso esplicito nulla di facoltativo viene salvato o caricato.
// La scelta resta valida 6 mesi, poi viene chiesta di nuovo; si può cambiare in ogni momento
// dal link "Preferenze cookie" nel footer.

export type Consent = { v: 1; statistiche: boolean; at: string };

const KEY = "solace-consenso";
const VALIDITY_MS = 182 * 24 * 60 * 60 * 1000;
export const CONSENT_EVENT = "solace:consenso";
export const PREFERENCES_EVENT = "solace:preferenze-cookie";

export function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) ?? "null") as Consent | null;
    if (!c || c.v !== 1 || Date.now() - Date.parse(c.at) > VALIDITY_MS) return null;
    return c;
  } catch {
    return null;
  }
}

export function saveConsent(statistiche: boolean) {
  const c: Consent = { v: 1, statistiche, at: new Date().toISOString() };
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    // Archiviazione non disponibile: la scelta vale solo per questa pagina.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: c }));
}

export const hasStatisticsConsent = () => readConsent()?.statistiche === true;

export function openCookiePreferences() {
  window.dispatchEvent(new Event(PREFERENCES_EVENT));
}
