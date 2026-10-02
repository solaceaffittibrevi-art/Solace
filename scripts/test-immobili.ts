// Simulazioni controllate di graduatoria, sostituzione e conferma delle rimozioni.
// Nessuna richiesta a servizi esterni. Uso: npm run test:immobili
import { resolveSelection, scoreListing, type RankingInput } from "../lib/immobili-ranking.ts";
import { confirmRemoval, type Observation } from "../lib/immobili-verifica.ts";
import { portfolio, properties, selection } from "../lib/immobili.ts";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) passed++;
  else failed++;
  console.log(`${cond ? "OK  " : "FAIL"} ${name}${!cond && detail ? ` → ${detail}` : ""}`);
}

const base = { ownerVerified: true, guestFavorite: false, photoQuality: null, appeal: null };
const L = (id: string, value: number | null, count: number | null, extra: Partial<RankingInput> = {}): RankingInput => ({
  listingId: id,
  name: id,
  rating: value !== null && count ? { value, count } : null,
  reviewCount: count,
  ...base,
  ...extra,
});

// Configurazione reale
check("Vetrina iniziale: 5 annunci nell'ordine richiesto", properties.map((p) => p.listingId).join() === selection.join());
check("Nessun duplicato nella vetrina", new Set(properties.map((p) => p.listingId)).size === properties.length);
check("Collegamenti Airbnb con l'identificativo corretto", properties.every((p) => p.airbnb.endsWith(`/rooms/${p.listingId}`)));
check("Ogni annuncio ha 6 foto con testo alternativo", portfolio.every((p) => p.photos.length === 6 && p.photos.every((f) => f.alt.length > 10)));

// Graduatoria
const a = scoreListing(L("a", 5.0, 3));
const b = scoreListing(L("b", 4.8, 90));
check("Un 5,0 con 3 recensioni non supera un 4,8 con 90", b.score > a.score, `${a.score} vs ${b.score}`);
const noData = scoreListing(L("x", null, null, { guestFavorite: null }));
check("Senza dati: punteggio non inventato, non selezionabile", !noData.eligible && noData.coverage === 0);
const partial = scoreListing(L("p", 4.8, 40, { guestFavorite: null }));
check("Dati parziali: pesi riproporzionati sui criteri disponibili", partial.coverage === 0.6 && partial.eligible);
const editorial = scoreListing(L("e", 4.8, 40, { photoQuality: 5, appeal: 5 }));
check("La priorità editoriale alza il punteggio", editorial.score > scoreListing(L("e", 4.8, 40)).score);

// Sostituzione
const pf = [L("s1", 4.7, 50), L("s2", 4.8, 60), L("s3", 4.6, 30), L("c1", 4.9, 80), L("c2", 4.85, 40), L("c3", 4.5, 10)];
const slots = ["s1", "s2", "s3"];
let r = resolveSelection(slots, pf, []);
check("Nessuna rimozione: vetrina invariata", r.shown.map((p) => p.listingId).join() === "s1,s2,s3" && !r.replacements.length);
r = resolveSelection(slots, pf, ["s2"]);
check("Rimozione: il migliore candidato prende lo stesso posto", r.shown.map((p) => p.listingId).join() === "s1,c1,s3");
r = resolveSelection(slots, pf, ["s2", "s1"]);
check("Rimozioni successive: il sostituto precedente resta al suo posto", r.shown.map((p) => p.listingId).join() === "c2,c1,s3", r.shown.map((p) => p.listingId).join());
r = resolveSelection(slots, pf, ["s2", "c1"]);
check("Anche un sostituto può essere sostituito, nello stesso posto", r.shown.map((p) => p.listingId).join() === "s1,c2,s3", r.shown.map((p) => p.listingId).join());
const foreign = [...pf, L("estraneo", 5, 500, { ownerVerified: false })];
r = resolveSelection(slots, foreign, ["s3"]);
check("Mai immobili non verificati come Solace", !r.shown.some((p) => p.listingId === "estraneo"));
r = resolveSelection(slots, [L("s1", 4.7, 50), L("s2", 4.8, 60), L("s3", 4.6, 30)], ["s3"]);
check("Senza alternative: si mostrano meno immobili", r.shown.length === 2 && r.replacements[0].replacement === null);
r = resolveSelection(slots, [...pf, L("vuoto", null, null, { guestFavorite: null })], ["s1", "s2", "s3"]);
check("Candidati senza dati sufficienti esclusi", !r.shown.some((p) => p.listingId === "vuoto"));

// Conferma delle rimozioni
const o = (at: string, source: Observation["source"], status: Observation["status"]): Observation => ({ listingId: "x", at, source, status });
check("Errori, blocchi e login non sono rimozioni", !confirmRemoval([o("2026-10-01T00:00Z", "channel-manager", "error"), o("2026-10-02T06:00Z", "channel-manager", "blocked"), o("2026-10-03T06:00Z", "channel-manager", "login_required")]).removed);
check("Calendario pieno non è una rimozione", !confirmRemoval([o("2026-10-01T00:00Z", "channel-manager", "calendar_full"), o("2026-10-03T00:00Z", "channel-manager", "calendar_full")]).removed);
check("La pagina pubblica non basta mai", !confirmRemoval([o("2026-10-01T00:00Z", "pagina-pubblica", "deleted"), o("2026-10-03T00:00Z", "pagina-pubblica", "deleted")]).removed);
check("Un solo controllo non basta", !confirmRemoval([o("2026-10-01T00:00Z", "channel-manager", "deleted")]).removed);
check("Due controlli troppo ravvicinati non bastano", !confirmRemoval([o("2026-10-01T00:00Z", "channel-manager", "deleted"), o("2026-10-01T05:00Z", "channel-manager", "deleted")]).removed);
check("Un 'attivo' in mezzo azzera la sequenza", !confirmRemoval([o("2026-10-01T00:00Z", "channel-manager", "deleted"), o("2026-10-01T12:00Z", "channel-manager", "active"), o("2026-10-02T13:00Z", "channel-manager", "deleted")]).removed);
check("Due controlli attendibili a 24 ore: rimozione confermata", confirmRemoval([o("2026-10-01T00:00Z", "channel-manager", "deleted"), o("2026-10-02T01:00Z", "airbnb-api", "deactivated")]).removed);
check("Errori in mezzo non interrompono né confermano", confirmRemoval([o("2026-10-01T00:00Z", "channel-manager", "deleted"), o("2026-10-01T10:00Z", "channel-manager", "error"), o("2026-10-02T02:00Z", "channel-manager", "deleted")]).removed);
check("Conferma manuale del titolare", confirmRemoval([o("2026-10-01T00:00Z", "manuale", "deleted")]).removed);

console.log(`\n${passed} superati, ${failed} falliti.`);
process.exit(failed ? 1 : 0);
