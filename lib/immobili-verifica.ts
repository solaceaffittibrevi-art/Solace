// Regole per confermare che un annuncio è stato DEFINITIVAMENTE rimosso.
// Pronte per un controllo periodico sul server, che oggi NON è attivo: manca una fonte attendibile
// (API del channel manager o di Airbnb per i partner). Finché non c'è, le rimozioni si confermano a mano
// in `confirmedRemovals` (lib/immobili.ts).
//
// Una rimozione è confermata solo se:
//  - arriva da una fonte attendibile (channel manager, API ufficiale o conferma manuale del titolare);
//  - lo stato è "eliminato" o "disattivato", mai un errore, un blocco, una richiesta di login,
//    un calendario pieno o una pagina non raggiungibile;
//  - per le fonti automatiche, ci sono almeno MIN_CHECKS controlli consecutivi concordi distanti
//    almeno MIN_HOURS ore, senza nessun "attivo" in mezzo.
// La pagina pubblica di Airbnb non basta mai da sola: può rispondere con errori o blocchi temporanei.

export type Source = "channel-manager" | "airbnb-api" | "manuale" | "pagina-pubblica";
export type Status =
  | "active"
  | "deleted"
  | "deactivated"
  | "calendar_full"
  | "error"
  | "blocked"
  | "login_required"
  | "unknown";

export type Observation = { listingId: string; at: string; source: Source; status: Status };

const TRUSTED_AUTOMATIC: Source[] = ["channel-manager", "airbnb-api"];
const REMOVED: Status[] = ["deleted", "deactivated"];
export const MIN_CHECKS = 2;
export const MIN_HOURS = 24;

export function confirmRemoval(observations: Observation[]): { removed: boolean; reason: string } {
  const obs = [...observations].sort((a, b) => a.at.localeCompare(b.at));

  const manual = obs.filter((o) => o.source === "manuale");
  const lastManual = manual.at(-1);
  if (lastManual && REMOVED.includes(lastManual.status)) return { removed: true, reason: "confermata dal titolare" };

  // Solo osservazioni conclusive di fonti attendibili: errori, blocchi e simili non contano.
  const conclusive = obs.filter(
    (o) => TRUSTED_AUTOMATIC.includes(o.source) && (o.status === "active" || REMOVED.includes(o.status)),
  );
  const streak: Observation[] = [];
  for (const o of conclusive) {
    if (o.status === "active") streak.length = 0;
    else streak.push(o);
  }
  if (streak.length < MIN_CHECKS) {
    return { removed: false, reason: `controlli concordi insufficienti (${streak.length}/${MIN_CHECKS})` };
  }
  const hours = (Date.parse(streak.at(-1)!.at) - Date.parse(streak[0].at)) / 3_600_000;
  if (hours < MIN_HOURS) return { removed: false, reason: `intervallo troppo breve (${hours.toFixed(1)} ore)` };
  return { removed: true, reason: `${streak.length} controlli concordi in ${hours.toFixed(0)} ore` };
}
