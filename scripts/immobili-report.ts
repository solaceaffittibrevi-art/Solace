// Mostra graduatoria del portafoglio, immobili visibili e sostituzioni in corso.
// Uso: npm run immobili:report  (legge solo la configurazione locale, nessuna richiesta ad Airbnb)
import { confirmedRemovals, portfolio, properties, replacements, selection } from "../lib/immobili.ts";
import { scoreListing } from "../lib/immobili-ranking.ts";

console.log("Graduatoria del portafoglio (criteri e pesi in lib/immobili-ranking.ts)\n");
const rows = portfolio
  .map((p) => ({ p, ...scoreListing(p) }))
  .sort((a, b) => b.score - a.score);
for (const r of rows) {
  const flag = selection.includes(r.p.listingId) ? "in vetrina" : r.eligible ? "candidato" : "dati insufficienti";
  console.log(`${r.eligible ? r.score.toFixed(3) : "  —  "}  copertura ${Math.round(r.coverage * 100)}%  ${r.p.name} (${r.p.listingId}) · ${flag}`);
}
console.log("\nImmobili mostrati:", properties.map((p) => p.name).join(" · "));
console.log("Rimozioni confermate:", confirmedRemovals.length ? confirmedRemovals : "nessuna");
console.log("Sostituzioni:", replacements.length ? replacements : "nessuna");
