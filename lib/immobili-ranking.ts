// Graduatoria trasparente del portafoglio e sostituzione degli annunci rimossi.
// Nessuna dipendenza: lo usano sia il sito (in fase di build) sia i test (`npm run test:immobili`).
//
// Criteri e pesi (modificabili qui sotto):
//  - valutazione:  media Airbnb corretta per il numero di recensioni (media bayesiana), così un 5,0 con
//                  3 recensioni non supera un 4,8 con 90;
//  - recensioni:   quantità su scala logaritmica (100 o più = punteggio pieno), indica l'affidabilità;
//  - riconoscimenti: "Amato dagli ospiti" verificato su Airbnb (sì = 1, no = 0);
//  - foto:         qualità e completezza delle fotografie, voto editoriale 1–5;
//  - attrattività: coerenza con il sito e appeal, priorità editoriale 1–5.
// Il prezzo non è un criterio: un immobile più caro non è per questo migliore.
// Dati mancanti: il criterio viene escluso e i pesi rimanenti vengono riproporzionati. Nessun valore
// viene stimato o inventato. Se i criteri disponibili coprono meno di MIN_COVERAGE dei pesi,
// l'immobile non può essere scelto automaticamente.

export type RankingInput = {
  listingId: string;
  name: string;
  ownerVerified: boolean;
  rating: { value: number; count: number } | null;
  reviewCount: number | null;
  guestFavorite: boolean | null;
  photoQuality: number | null; // 1–5, editoriale
  appeal: number | null; // 1–5, editoriale
};

export const WEIGHTS = {
  rating: 0.4,
  reviews: 0.2,
  guestFavorite: 0.1,
  photoQuality: 0.15,
  appeal: 0.15,
};

export const MIN_COVERAGE = 0.6;
// Media bayesiana: valutazione "di partenza" e numero di recensioni che le danno peso.
const PRIOR_RATING = 4.6;
const PRIOR_WEIGHT = 15;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function scoreListing(p: RankingInput, weights = WEIGHTS) {
  const parts: Partial<Record<keyof typeof WEIGHTS, number>> = {};
  if (p.rating && p.rating.count > 0) {
    const adjusted = (p.rating.value * p.rating.count + PRIOR_RATING * PRIOR_WEIGHT) / (p.rating.count + PRIOR_WEIGHT);
    parts.rating = clamp(adjusted - 4); // 4,0 → 0 · 5,0 → 1
  }
  if (p.reviewCount !== null) parts.reviews = clamp(Math.log10(p.reviewCount + 1) / 2);
  if (p.guestFavorite !== null) parts.guestFavorite = p.guestFavorite ? 1 : 0;
  if (p.photoQuality !== null) parts.photoQuality = clamp((p.photoQuality - 1) / 4);
  if (p.appeal !== null) parts.appeal = clamp((p.appeal - 1) / 4);

  const keys = Object.keys(parts) as (keyof typeof WEIGHTS)[];
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const coverage = keys.reduce((a, k) => a + weights[k], 0) / total;
  const score = coverage ? keys.reduce((a, k) => a + weights[k] * parts[k]!, 0) / (coverage * total) : 0;
  return { score: Math.round(score * 1000) / 1000, coverage: Math.round(coverage * 100) / 100, parts, eligible: coverage >= MIN_COVERAGE };
}

export type Replacement = {
  slot: number;
  removed: string;
  replacement: string | null;
  score?: number;
  reason: string;
};

// Applica le rimozioni nell'ordine in cui sono state confermate: ogni annuncio rimosso viene
// sostituito, nello stesso posto, dal miglior candidato verificato, non rimosso e non già presente.
// Gli altri immobili (compresi i sostituti precedenti) restano dove sono. Senza alternative valide
// il posto resta vuoto: meglio meno immobili che immobili estranei.
export function resolveSelection<T extends RankingInput>(slots: string[], portfolio: T[], removals: string[], weights = WEIGHTS) {
  const byId = new Map(portfolio.map((p) => [p.listingId, p]));
  const removed = new Set(removals);
  const current: (string | null)[] = [...slots];
  const replacements: Replacement[] = [];

  const ranked = portfolio
    .filter((p) => p.ownerVerified && !removed.has(p.listingId))
    .map((p) => ({ p, ...scoreListing(p, weights) }))
    .filter((c) => c.eligible)
    .sort((a, b) => b.score - a.score || a.p.listingId.localeCompare(b.p.listingId));

  for (const id of removals) {
    const slot = current.indexOf(id);
    if (slot === -1) continue; // non era in vetrina: basta escluderlo dai candidati
    const next = ranked.find((c) => !current.includes(c.p.listingId));
    current[slot] = next ? next.p.listingId : null;
    replacements.push(
      next
        ? {
            slot,
            removed: id,
            replacement: next.p.listingId,
            score: next.score,
            reason: `miglior punteggio disponibile (${next.score}, criteri coperti ${Math.round(next.coverage * 100)}%)`,
          }
        : { slot, removed: id, replacement: null, reason: "nessun candidato verificato disponibile" },
    );
  }

  const shown = current
    .map((id) => (id ? byId.get(id) : undefined))
    .filter((p): p is T => Boolean(p && p.ownerVerified && !removed.has(p.listingId)));

  return { shown, replacements, ranking: ranked.map((c) => ({ listingId: c.p.listingId, name: c.p.name, score: c.score, coverage: c.coverage })) };
}
