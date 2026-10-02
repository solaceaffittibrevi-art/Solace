import { resolveSelection } from "./immobili-ranking.ts";

// ─────────────────────────────────────────────────────────────────────────────────────────────
// Immobili: unica configurazione da aggiornare.
//  1. `portfolio`: annunci verificati di Solace (dati letti su Airbnb, nessun dato inventato).
//  2. `selection`: gli annunci mostrati sul sito, nell'ordine voluto.
//  3. `confirmedRemovals`: annunci rimossi DEFINITIVAMENTE da Airbnb. Ogni riga è anche il registro
//     della rimozione. Il sito sostituisce l'annuncio con il miglior candidato del portafoglio
//     (criteri in lib/immobili-ranking.ts) e mantiene gli altri al loro posto.
// Per vedere graduatoria e sostituzioni: `npm run immobili:report`.
// ─────────────────────────────────────────────────────────────────────────────────────────────

export type Photo = { src: string; alt: string };

export type Property = {
  listingId: string;
  slug: string;
  name: string;
  zone: string;
  city: string;
  type: string;
  guests: number;
  rooms: string;
  summary: string;
  features: string[];
  airbnb: string;
  photos: Photo[];
  // Dati Airbnb letti il 2/10/2026 (null = non disponibile, mai stimato).
  rating: { value: number; count: number } | null;
  reviewCount: number | null;
  guestFavorite: boolean | null;
  // Appartenenza al portafoglio Solace: solo gli immobili verificati possono essere mostrati o subentrare.
  ownerVerified: boolean;
  ownerNote: string;
  // Valutazioni editoriali 1–5, da compilare a cura di Solace (null = non usate nella graduatoria).
  photoQuality: number | null;
  appeal: number | null;
};

const airbnb = (id: string) => `https://www.airbnb.it/rooms/${id}`;
const photos = (slug: string, alts: string[]): Photo[] =>
  alts.map((alt, i) => ({ src: `/images/immobili/${slug}/${String(i + 1).padStart(2, "0")}.jpg`, alt }));

const HOST_SOLACE = "Host Airbnb: profilo Solace (Gabriel), verificato il 2/10/2026.";

export const portfolio: Property[] = [
  {
    listingId: "1391231573270914769",
    slug: "suite-prestige",
    name: "Suite Prestige",
    zone: "Duomo",
    city: "Milano",
    type: "Bilocale",
    guests: 4,
    rooms: "1 camera · 2 letti · 1 bagno",
    summary:
      "Bilocale in stabile signorile a pochi minuti a piedi dal Duomo, con terrazzo sui tetti del centro. Vicino alle metro San Babila, Missori e Crocetta.",
    features: ["Terrazzo", "Stabile signorile", "Metro San Babila", "Wi-Fi"],
    airbnb: airbnb("1391231573270914769"),
    photos: photos("suite-prestige", [
      "Terrazzo arredato con vista sui tetti di Milano al tramonto",
      "Soggiorno con divano bianco, specchio ad arco e portafinestra sul terrazzo",
      "Cucina bianca con piano in marmo",
      "Dettaglio di benvenuto con bottiglia e bicchieri",
      "Camera da letto con coperta scura e tende chiare",
      "Angolo relax sul terrazzo con sedie in corda",
    ]),
    rating: { value: 4.77, count: 71 },
    reviewCount: 71,
    guestFavorite: false,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
  {
    listingId: "1612587162101761158",
    slug: "duomo-royal-loft",
    name: "Duomo Royal Loft",
    zone: "Duomo",
    city: "Milano",
    type: "Loft",
    guests: 4,
    rooms: "2 camere da letto · 1 letto · 1,5 bagni",
    summary:
      "Loft in una casa storica a pochi passi dal Duomo: soppalco, travi in legno a vista, camino e grandi finestre alla francese. Uno spazio luminoso e silenzioso nonostante la posizione centrale.",
    features: ["Soppalco", "Travi a vista", "Camino", "Wi-Fi"],
    airbnb: airbnb("1612587162101761158"),
    photos: photos("duomo-royal-loft", [
      "Open space con soppalco, camino e divano grigio",
      "Scala in metallo verso il soppalco e portefinestre alla francese",
      "Vista dalla finestra su una via pedonale del centro",
      "Camera da letto con vetrata decorata in stile liberty",
      "Cucina bianca con piano cottura a gas",
      "Bagno con lucernario e box doccia",
    ]),
    rating: { value: 4.7, count: 61 },
    reviewCount: 61,
    guestFavorite: false,
    // Indicato dal titolare come annuncio Solace; su Airbnb l'host risulta "Italsuites".
    ownerVerified: true,
    ownerNote: "Indicato dal titolare il 2/10/2026. Su Airbnb l'host risulta Italsuites: da confermare la co-gestione.",
    photoQuality: null,
    appeal: null,
  },
  {
    listingId: "1769734195329082844",
    slug: "piazza-duomo-terrazzo",
    name: "Bilocale con terrazzo in Piazza Duomo",
    zone: "Piazza Duomo",
    city: "Milano",
    type: "Bilocale",
    guests: 3,
    rooms: "1 camera · 2 letti · 1 bagno",
    summary:
      "Bilocale moderno, completamente ristrutturato, in Piazza Duomo, con terrazzo arredato. La metro M1 è a un minuto a piedi; a due passi la Galleria Vittorio Emanuele II e il Teatro alla Scala.",
    features: ["Terrazzo arredato", "Ristrutturato", "Metro M1 a 1 minuto", "Wi-Fi"],
    airbnb: airbnb("1769734195329082844"),
    photos: photos("piazza-duomo-terrazzo", [
      "Terrazzo arredato con fioriere, divanetto e tavolino",
      "Terrazzo lungo la facciata con sedute in corda e fiori",
      "Letto con biancheria a fiori e mensole a giorno",
      "Cucina moderna con tavolo apparecchiato",
      "Zona pranzo con tavolo bianco e lampada a sospensione",
      "Letto con vista sul terrazzo attraverso la portafinestra",
    ]),
    rating: null, // annuncio nuovo, ancora senza recensioni
    reviewCount: 0,
    guestFavorite: false,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
  {
    listingId: "1607516107933185822",
    slug: "como-elite",
    name: "Appartamento Como Elite",
    zone: "Stazione San Giovanni",
    city: "Como",
    type: "Bilocale",
    guests: 4,
    rooms: "1 camera · 2 letti · 1 bagno",
    summary:
      "Appartamento in stile boutique, luminoso e curato, con ampio balcone. A 5 minuti a piedi dalla stazione Como San Giovanni e a 8 dal Duomo e dal centro storico.",
    features: ["Ampio balcone", "Doccia walk-in", "Smart TV", "Wi-Fi"],
    airbnb: airbnb("1607516107933185822"),
    photos: photos("como-elite", [
      "Soggiorno con divano, tappeto persiano e TV",
      "Balcone arredato con tavolo e piante",
      "Soggiorno con libreria e cucina sullo sfondo",
      "Cucina bianca con paraschizzi dorato e tavolo in legno",
      "Camera matrimoniale con armadio a muro",
      "Bagno in marmo con doccia e rubinetteria dorata",
    ]),
    rating: { value: 4.75, count: 32 },
    reviewCount: 32,
    guestFavorite: false,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
  {
    listingId: "1391229790402951206",
    slug: "suite-royale",
    name: "Suite Royale",
    zone: "Duomo",
    city: "Milano",
    type: "Bilocale",
    guests: 4,
    rooms: "1 camera · 2 letti · 1 bagno",
    summary:
      "Bilocale elegante in stabile signorile, a pochi passi dal Duomo e ben collegato con gli aeroporti di Linate e Malpensa.",
    features: ["Centro storico", "Cucina attrezzata", "Metro Missori", "Wi-Fi"],
    airbnb: airbnb("1391229790402951206"),
    photos: photos("suite-royale", [
      "Cucina con piano in marmo e luci sottopensile",
      "Zona pranzo con tavolo rotondo e lampada a sospensione",
      "Camera da letto con quadro astratto",
      "Dettaglio della tavola apparecchiata",
      "Cucina bianca con piano in marmo e piante",
      "Soggiorno con divano, lampade e grandi tende",
    ]),
    rating: { value: 4.81, count: 84 },
    reviewCount: 84,
    guestFavorite: false,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
  // ── Candidati per eventuali sostituzioni (non mostrati finché non servono) ──
  {
    listingId: "1455791981124568403",
    slug: "trilocale-wagner",
    name: "Trilocale Wagner",
    zone: "De Angeli – Wagner",
    city: "Milano",
    type: "Trilocale",
    guests: 4,
    rooms: "2 camere · 2 letti · 2,5 bagni",
    summary:
      "Trilocale in stabile d'epoca a 300 metri dalla metro M1 Wagner: Duomo in pochi minuti, CityLife vicina e San Siro a portata di tram.",
    features: ["Stabile d'epoca", "Metro M1 Wagner", "Due bagni", "Wi-Fi"],
    airbnb: airbnb("1455791981124568403"),
    photos: photos("trilocale-wagner", [
      "Soggiorno open space con cucina e libreria bianca",
      "Camera da letto con tende a fantasia",
      "Seconda camera con scrivania",
      "Cucina bianca con paraschizzi scuro",
      "Bagno con doccia e mobile sospeso",
      "Bagno con vasca",
    ]),
    rating: { value: 4.87, count: 91 },
    reviewCount: 91,
    guestFavorite: true,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
  {
    listingId: "1491924277368957042",
    slug: "navigli",
    name: "Casa sui Navigli",
    zone: "Navigli",
    city: "Milano",
    type: "Appartamento",
    guests: 4,
    rooms: "1 camera · 2 letti · 1 bagno",
    summary: "Una casa con carattere in un cortile sui Navigli, arredata con cura e in modo molto personale.",
    features: ["Cortile interno", "Arredo d'autore", "Navigli", "Wi-Fi"],
    airbnb: airbnb("1491924277368957042"),
    photos: photos("navigli", [
      "Soggiorno con travi a vista, camino e pareti gialle",
      "Cucina gialla con frigorifero blu",
      "Camera da letto con letto in ferro battuto",
      "Cortile interno alberato",
      "Bagno con lavabo in ceramica decorata",
      "Soggiorno con pareti gialle, tavolo da pranzo e camino",
    ]),
    rating: { value: 4.83, count: 35 },
    reviewCount: 35,
    guestFavorite: false,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
  {
    listingId: "1568350850566504246",
    slug: "bilocale-porta-vittoria",
    name: "Eleganza e Design",
    zone: "Porta Vittoria",
    city: "Milano",
    type: "Appartamento",
    guests: 4,
    rooms: "2 camere · 3 letti · 1 bagno",
    summary:
      "Appartamento di design in stabile signorile, a pochi minuti dalla stazione di Porta Vittoria: centrale per lavoro e tempo libero.",
    features: ["Design", "Porta Vittoria", "Spazio lavoro", "Wi-Fi"],
    airbnb: airbnb("1568350850566504246"),
    photos: photos("bilocale-porta-vittoria", [
      "Camera da letto bianca con armadio a specchio",
      "Cucina con paraschizzi in pietra",
      "Camera con due letti singoli e quadri colorati",
      "Camera matrimoniale con quadro",
      "Camera matrimoniale con biancheria bianca",
      "Camera con letto matrimoniale e scrivania",
    ]),
    rating: { value: 4.68, count: 31 },
    reviewCount: 31,
    guestFavorite: false,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
  {
    listingId: "1562382606393623644",
    slug: "loft-tricolore",
    name: "Loft Tricolore",
    zone: "Porta Venezia – Tricolore",
    city: "Milano",
    type: "Loft",
    guests: 4,
    rooms: "1 camera · 2 letti · 1 bagno",
    summary:
      "Loft su due livelli in uno stabile d'epoca a ringhiera, a 100 metri dalla metro Tricolore e a un quarto d'ora a piedi dal centro.",
    features: ["Su due livelli", "Casa di ringhiera", "Metro Tricolore", "Wi-Fi"],
    airbnb: airbnb("1562382606393623644"),
    photos: photos("loft-tricolore", [
      "Soggiorno con parete arancione e scala in metallo verso il soppalco",
      "Vista del loft con scala a giorno",
      "Zona giorno con letto e mobile TV",
      "Cucina con tavolo rotondo",
      "Camera con letto matrimoniale e mensole",
      "Dettaglio della zona TV",
    ]),
    rating: { value: 4.53, count: 38 },
    reviewCount: 38,
    guestFavorite: false,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
  {
    listingId: "1587063599502981114",
    slug: "pero-fiera",
    name: "Bilocale Fiera Milano",
    zone: "Pero – Fiera Milano Rho",
    city: "Pero (MI)",
    type: "Bilocale",
    guests: 4,
    rooms: "1 camera · 2 letti · 1 bagno",
    summary:
      "Bilocale luminoso in posizione strategica per Fiera Milano Rho e MIND, con parcheggio gratuito e buoni collegamenti con la città.",
    features: ["Vicino a Fiera Milano", "Parcheggio gratuito", "Balcone sul verde", "Self check-in"],
    airbnb: airbnb("1587063599502981114"),
    photos: photos("pero-fiera", [
      "Soggiorno con divano grigio e tavolo da pranzo",
      "Camera da letto con testiera imbottita",
      "Cucina bianca con tavolo",
      "Balcone che affaccia su un parco",
      "Soggiorno con divano e pianta",
      "Cucina con paraschizzi in marmo",
    ]),
    rating: { value: 4.63, count: 16 },
    reviewCount: 16,
    guestFavorite: false,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
  {
    listingId: "1438690511711738798",
    slug: "villa-eze",
    name: "Villa vista mare",
    zone: "Èze, Costa Azzurra",
    city: "Francia",
    type: "Villa",
    guests: 10,
    rooms: "3 camere · 4 letti · 2 bagni",
    summary:
      "Una villa contemporanea affacciata sul Mediterraneo, con piscina a sfioro e grandi vetrate: un esempio di come curiamo anche immobili fuori da Milano.",
    features: ["Piscina a sfioro", "Vista mare", "Terrazze panoramiche", "Fino a 10 ospiti"],
    airbnb: airbnb("1438690511711738798"),
    photos: photos("villa-eze", [
      "Piscina a sfioro affacciata sul mare della Costa Azzurra",
      "La villa vista dall'alto con la piscina",
      "Soggiorno con divani bianchi e vista mare",
      "Terrazza con lettini al crepuscolo",
      "Camera da letto con vetrate sul mare",
      "Zona giorno aperta sulla piscina",
    ]),
    rating: null,
    reviewCount: 0,
    guestFavorite: false,
    ownerVerified: true,
    ownerNote: HOST_SOLACE,
    photoQuality: null,
    appeal: null,
  },
];

// Ordine iniziale richiesto dal titolare il 2/10/2026 (identificativi Airbnb).
export const selection = [
  "1391231573270914769",
  "1612587162101761158",
  "1769734195329082844",
  "1607516107933185822",
  "1391229790402951206",
];

// Registro delle rimozioni definitive. Aggiungere una riga solo dopo una conferma attendibile
// (channel manager, API ufficiale o verifica diretta del titolare): mai per errori temporanei,
// calendario pieno, blocchi di accesso o richieste di login. Esempio:
// { listingId: "1391231573270914769", confirmedAt: "2026-11-15", source: "manuale", note: "Annuncio eliminato dal proprietario" },
export type ConfirmedRemoval = { listingId: string; confirmedAt: string; source: "manuale" | "channel-manager" | "airbnb-api"; note: string };
export const confirmedRemovals: ConfirmedRemoval[] = [];

const resolved = resolveSelection(
  selection,
  portfolio,
  [...confirmedRemovals].sort((a, b) => a.confirmedAt.localeCompare(b.confirmedAt)).map((r) => r.listingId),
);

// Immobili mostrati sul sito, nell'ordine degli slot.
export const properties: Property[] = resolved.shown;
export const replacements = resolved.replacements;

export const formatRating = (v: number) => v.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
