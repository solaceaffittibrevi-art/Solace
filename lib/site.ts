// Contenuti del sito. Ogni dato qui è verificato su una fonte indicata nel commento:
// prima di aggiungere numeri, nomi o recensioni, controlla che siano reali e aggiornati.

export const site = {
  name: "Solace",
  legalName: "Solace Real Estate Short Rent",
  tagline: "Gestione affitti brevi a Milano",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Verificato il 1/10/2026: evento "Chiamata conoscitiva", 30 min, telefonica, con Gabriel Dal Molin.
  calendly: "https://calendly.com/solace-gestione/new-meeting",
  instagram: "https://www.instagram.com/solaceaffittibrevi/",
  airbnbProfile: "https://www.airbnb.it/users/profile/1467841528592735054",
  // Recapiti pubblici: i valori in .env.local (vedi .env.example) sostituiscono quelli predefiniti.
  // Email aziendale fornita dal titolare il 2/10/2026.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "solaceaffittibrevi@gmail.com",
  // Numero fornito dal titolare il 2/10/2026 (telefono e WhatsApp).
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+39 351 402 1923",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "393514021923",
  privacyUrl: process.env.NEXT_PUBLIC_PRIVACY_URL ?? "",
};

export const nav = [
  { href: "/servizi", label: "Servizi" },
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/immobili", label: "Immobili" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/faq", label: "FAQ" },
];

// Fonti: landing solaceaffittibrevi.com ("oltre 30 immobili"), bio Instagram ("+30 immobili"),
// profilo host Airbnb (1.206 recensioni, 33 annunci) letto il 1/10/2026,
// documento interno "Servizi offerti" (assistenza ospiti 24/7 per emergenze).
export const proof = [
  { value: 30, suffix: "+", label: "immobili in gestione", note: "a Milano e non solo" },
  { value: 1200, suffix: "+", label: "recensioni di ospiti", note: "sul profilo Airbnb di Solace" },
  { value: 24, suffix: "/7", label: "assistenza agli ospiti", note: "per le emergenze durante il soggiorno" },
];
export const proofSourceNote =
  "Dati dal profilo host Airbnb di Solace e dalle comunicazioni ufficiali, aggiornati a ottobre 2026.";

export const benefits = [
  {
    icon: "calm",
    title: "Meno incombenze",
    text: "Messaggi, check-in, pulizie, tecnici e adempimenti passano da noi. A te resta una sola persona di riferimento.",
  },
  {
    icon: "guest",
    title: "Ospiti seguiti",
    text: "Rispondiamo agli ospiti prima e durante il soggiorno, anche in inglese, con assistenza per le emergenze 24/7.",
  },
  {
    icon: "home",
    title: "Casa curata",
    text: "Pulizie professionali, biancheria di qualità e controlli dopo ogni partenza. Se serve un intervento, lo coordiniamo noi.",
  },
  {
    icon: "chart",
    title: "Risultati sotto controllo",
    text: "Accesso alle piattaforme per vedere calendario, prezzi e messaggi, più un report aggiornato a ogni prenotazione.",
  },
];

export type ServiceGroup = {
  id: string;
  phase: string;
  title: string;
  intro: string;
  items: { icon: string; title: string; text: string; gain: string }[];
};

// Perimetro dal documento interno "Servizi offerti". Le voci contrattuali vanno confermate nella proposta.
export const serviceGroups: ServiceGroup[] = [
  {
    id: "prima",
    phase: "Prima dell'avvio",
    title: "Prepariamo la casa a lavorare bene",
    intro:
      "Partiamo da un'analisi del potenziale e rendiamo l'immobile pronto per gli affitti brevi, dentro e fuori dagli annunci.",
    items: [
      {
        icon: "search",
        title: "Analisi del potenziale",
        text: "Studiamo zona, tipologia, domanda e stagionalità per capire come può rendere il tuo immobile.",
        gain: "Decidi con criteri chiari, prima di firmare.",
      },
      {
        icon: "camera",
        title: "Foto professionali e annuncio",
        text: "Shooting fotografico, titoli e descrizioni curati, anche in inglese per gli ospiti internazionali.",
        gain: "Un annuncio che si fa scegliere e racconta la casa per quello che è.",
      },
      {
        icon: "sofa",
        title: "Allestimento e fornitori",
        text: "Su richiesta ti aiutiamo ad arredare e coordiniamo tecnici, montaggi e attivazioni come Wi-Fi e utenze.",
        gain: "Non devi prendere giorni di ferie per aprire la porta agli operatori.",
      },
      {
        icon: "doc",
        title: "Avvio degli adempimenti",
        text: "Ti accompagniamo nelle pratiche per affittare a breve termine: codici identificativi, comunicazioni e registrazioni.",
        gain: "Parti in regola, senza doverti orientare da solo tra uffici e portali.",
      },
    ],
  },
  {
    id: "durante",
    phase: "Durante i soggiorni",
    title: "Ci occupiamo degli ospiti e della casa",
    intro: "Ogni prenotazione è seguita dall'inizio alla fine, con standard costanti tra un ospite e l'altro.",
    items: [
      {
        icon: "calendar",
        title: "Canali, calendario e prezzi",
        text: "Gestiamo gli annunci su Airbnb e Booking e aggiorniamo i prezzi in base a domanda, eventi, fiere e stagionalità.",
        gain: "Il calendario lavora anche nei periodi meno richiesti, senza che tu debba seguirlo.",
      },
      {
        icon: "chat",
        title: "Comunicazione con gli ospiti",
        text: "Rispondiamo prima, durante e dopo il soggiorno, con supporto multilingue e guide digitali della casa e della città.",
        gain: "Ospiti informati, meno imprevisti, recensioni migliori.",
      },
      {
        icon: "key",
        title: "Check-in e check-out",
        text: "Organizziamo l'accesso con self check-in automatizzato o accoglienza di persona, secondo l'immobile.",
        gain: "Arrivi fluidi anche a tarda sera, senza che tu debba essere presente.",
      },
      {
        icon: "sparkle",
        title: "Pulizie e biancheria",
        text: "Un'impresa di pulizie dedicata ai nostri appartamenti e biancheria in cotone di qualità a ogni cambio.",
        gain: "La casa si presenta sempre allo stesso livello, ospite dopo ospite.",
      },
      {
        icon: "wrench",
        title: "Manutenzione",
        text: "Coordiniamo idraulici, elettricisti e tuttofare di fiducia quando serve un intervento.",
        gain: "I problemi si risolvono in fretta e tu vieni informato, non coinvolto.",
      },
      {
        icon: "shield",
        title: "Assistenza 24/7 per le emergenze",
        text: "Gli ospiti hanno un contatto diretto in ogni momento per le situazioni urgenti.",
        gain: "L'immobile non resta mai senza un riferimento.",
      },
    ],
  },
  {
    id: "dopo",
    phase: "Rendicontazione",
    title: "Vedi sempre cosa succede",
    intro: "La trasparenza non è un report a fine anno: è poter controllare in qualsiasi momento.",
    items: [
      {
        icon: "chart",
        title: "Report a ogni prenotazione",
        text: "Un foglio condiviso aggiornato con ogni soggiorno, per seguire il guadagno netto del mese.",
        gain: "Sai sempre quanto sta rendendo la tua casa.",
      },
      {
        icon: "eye",
        title: "Accesso alle piattaforme",
        text: "Puoi essere aggiunto agli account per vedere calendario, prezzi e messaggi scambiati con gli ospiti.",
        gain: "Nessuna scatola nera tra te e i tuoi ospiti.",
      },
      {
        icon: "people",
        title: "Un canale diretto",
        text: "Un gruppo WhatsApp con il referente e il manager che segue la tua casa sul posto.",
        gain: "Interlocutori chiari, risposte rapide.",
      },
      {
        icon: "doc",
        title: "Adempimenti ricorrenti",
        text: "Comunicazioni degli ospiti alla Questura, rilevazioni statistiche e imposta di soggiorno, secondo quanto previsto dal servizio.",
        gain: "Le scadenze sono seguite da chi lo fa ogni giorno.",
      },
    ],
  },
];

// Spiegazioni in linguaggio semplice. Il perimetro esatto è indicato nella proposta.
export const compliance = [
  {
    title: "SCIA",
    text: "La Segnalazione Certificata di Inizio Attività comunica al Comune l'avvio di un'attività ricettiva. Non sempre è richiesta: verifichiamo con te se serve per il tuo immobile.",
  },
  {
    title: "CIR e CIN",
    text: "Sono i codici identificativi dell'alloggio, regionale e nazionale. Vanno ottenuti prima di pubblicare l'annuncio e indicati negli annunci.",
  },
  {
    title: "Alloggiati Web",
    text: "È il portale della Polizia di Stato dove vanno comunicati i dati degli ospiti, entro i tempi previsti dalla legge.",
  },
  {
    title: "Rilevazioni statistiche",
    text: "Arrivi e presenze vanno comunicati per le statistiche sul turismo (ISTAT), attraverso il portale regionale.",
  },
  {
    title: "Imposta di soggiorno",
    text: "Va riscossa dagli ospiti, versata al Comune e dichiarata periodicamente, secondo le regole del Comune in cui si trova l'immobile.",
  },
];

export const steps = [
  {
    title: "Ci racconti il tuo immobile",
    text: "Compili il modulo o prenoti una chiamata. Bastano poche informazioni: zona, tipologia e situazione attuale.",
  },
  {
    title: "Analizziamo il potenziale",
    text: "Studiamo la casa, la zona e la domanda, e prepariamo una valutazione personalizzata.",
  },
  {
    title: "Ci confrontiamo sulla proposta",
    text: "Ne parliamo al telefono o con un sopralluogo: servizi inclusi, compenso e condizioni, nero su bianco.",
  },
  {
    title: "Prepariamo l'avvio",
    text: "Foto, annunci, pratiche, accessi e dotazioni: mettiamo la casa nelle condizioni di accogliere i primi ospiti.",
  },
  {
    title: "Gestiamo e condividiamo i risultati",
    text: "Seguiamo l'operatività ogni giorno e ti aggiorniamo a ogni prenotazione.",
  },
];

// Recensioni autentiche di ospiti pubblicate su Airbnb e riportate sulla landing solaceaffittibrevi.com.
// Testo come mostrato da Airbnb (traduzione automatica in italiano).
export const testimonials = [
  {
    quote:
      "Ottimo host, molto reattivo anche a mezzanotte per il nostro check-in molto tardi e molto disponibile! Appartamento pulito con tutto il necessario per il tuo soggiorno.",
    author: "Vladimir",
    origin: "Burbank, California",
    language: "dall’inglese",
  },
  {
    quote:
      "Questo è stato il mio primo soggiorno in Italia, e l'appartamento mi ha colpito così tanto che mi sono pentito di essere rimasto a Milano solo una notte invece di qualche giorno in più.",
    author: "Haulm",
    origin: "Cina",
    language: "dal cinese",
  },
  {
    quote:
      "L'appartamento era facile da trovare. Dentro e fuori era bellissimo. Era pulito e ha tutto il necessario. Gabriel è stato estremamente cordiale e disponibile!",
    author: "Gabriela",
    origin: "",
    language: "dall’inglese",
  },
  {
    quote: "Gabriel è molto attento. L'appartamento è impeccabile. E bello. Torneremo sicuramente!",
    author: "Soggiorno con bambini",
    origin: "",
    language: "dallo spagnolo",
  },
];

export type Property = {
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
  rating?: { value: string; count: number };
  photos: { src: string; alt: string }[];
  milano: boolean;
};

const photos = (slug: string, alts: string[]) =>
  alts.map((alt, i) => ({ src: `/images/immobili/${slug}/${String(i + 1).padStart(2, "0")}.jpg`, alt }));

// Annunci pubblici sul profilo Airbnb di Solace (letti il 1/10/2026). Nessun indirizzo esatto:
// solo la zona indicata nell'annuncio. Foto: archivio Solace e annunci Airbnb di Solace.
export const properties: Property[] = [
  {
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
    airbnb: "https://www.airbnb.it/rooms/1391231573270914769",
    rating: { value: "4,77", count: 71 },
    photos: photos("suite-prestige", [
      "Terrazzo arredato con vista sui tetti di Milano al tramonto",
      "Soggiorno con divano bianco, specchio ad arco e portafinestra sul terrazzo",
      "Cucina bianca con piano in marmo",
      "Dettaglio di benvenuto con bottiglia e bicchieri",
      "Camera da letto con coperta scura e tende chiare",
      "Angolo relax sul terrazzo con sedie in corda",
    ]),
    milano: true,
  },
  {
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
    airbnb: "https://www.airbnb.it/rooms/1391229790402951206",
    rating: { value: "4,81", count: 84 },
    photos: photos("suite-royale", [
      "Cucina con piano in marmo e luci sottopensile",
      "Zona pranzo con tavolo rotondo e lampada a sospensione",
      "Camera da letto con quadro astratto",
      "Dettaglio della tavola apparecchiata",
      "Cucina bianca con piano in marmo e piante",
      "Soggiorno con divano, lampade e grandi tende",
    ]),
    milano: true,
  },
  {
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
    airbnb: "https://www.airbnb.it/rooms/1455791981124568403",
    rating: { value: "4,87", count: 91 },
    photos: photos("trilocale-wagner", [
      "Soggiorno open space con cucina e libreria bianca",
      "Camera da letto con tende a fantasia",
      "Seconda camera con scrivania",
      "Cucina bianca con paraschizzi scuro",
      "Bagno con doccia e mobile sospeso",
      "Bagno con vasca",
    ]),
    milano: true,
  },
  {
    slug: "navigli",
    name: "Casa sui Navigli",
    zone: "Navigli",
    city: "Milano",
    type: "Appartamento",
    guests: 4,
    rooms: "1 camera · 2 letti · 1 bagno",
    summary: "Una casa con carattere in un cortile sui Navigli, arredata con cura e in modo molto personale.",
    features: ["Cortile interno", "Arredo d'autore", "Navigli", "Wi-Fi"],
    airbnb: "https://www.airbnb.it/rooms/1491924277368957042",
    rating: { value: "4,83", count: 35 },
    photos: photos("navigli", [
      "Soggiorno con travi a vista, camino e pareti gialle",
      "Cucina gialla con frigorifero blu",
      "Camera da letto con letto in ferro battuto",
      "Cortile interno alberato",
      "Bagno con lavabo in ceramica decorata",
      "Soggiorno con pareti gialle, tavolo da pranzo e camino",
    ]),
    milano: true,
  },
  {
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
    airbnb: "https://www.airbnb.it/rooms/1568350850566504246",
    rating: { value: "4,68", count: 31 },
    photos: photos("bilocale-porta-vittoria", [
      "Camera da letto bianca con armadio a specchio",
      "Cucina con paraschizzi in pietra",
      "Camera con due letti singoli e quadri colorati",
      "Camera matrimoniale con quadro",
      "Camera matrimoniale con biancheria bianca",
      "Camera con letto matrimoniale e scrivania",
    ]),
    milano: true,
  },
  {
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
    airbnb: "https://www.airbnb.it/rooms/1562382606393623644",
    rating: { value: "4,51", count: 37 },
    photos: photos("loft-tricolore", [
      "Soggiorno con parete arancione e scala in metallo verso il soppalco",
      "Vista del loft con scala a giorno",
      "Zona giorno con letto e mobile TV",
      "Cucina con tavolo rotondo",
      "Camera con letto matrimoniale e mensole",
      "Dettaglio della zona TV",
    ]),
    milano: true,
  },
  {
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
    airbnb: "https://www.airbnb.it/rooms/1587063599502981114",
    photos: photos("pero-fiera", [
      "Soggiorno con divano grigio e tavolo da pranzo",
      "Camera da letto con testiera imbottita",
      "Cucina bianca con tavolo",
      "Balcone che affaccia su un parco",
      "Soggiorno con divano e pianta",
      "Cucina con paraschizzi in marmo",
    ]),
    milano: false,
  },
  {
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
    airbnb: "https://www.airbnb.it/rooms/1438690511711738798",
    photos: photos("villa-eze", [
      "Piscina a sfioro affacciata sul mare della Costa Azzurra",
      "La villa vista dall'alto con la piscina",
      "Soggiorno con divani bianchi e vista mare",
      "Terrazza con lettini al crepuscolo",
      "Camera da letto con vetrate sul mare",
      "Zona giorno aperta sulla piscina",
    ]),
    milano: false,
  },
];

export const featuredSlugs = ["navigli", "trilocale-wagner", "suite-royale", "bilocale-porta-vittoria"];

export const details = [
  {
    src: "/images/dettagli/serratura.jpg",
    title: "Accesso senza chiavi",
    text: "Serrature smart e istruzioni chiare: gli ospiti entrano all'orario che serve a loro.",
    alt: "Serratura elettronica con tastierino su una porta in legno",
  },
  {
    src: "/images/dettagli/biancheria.jpg",
    title: "Biancheria di qualità",
    text: "Lenzuola e asciugamani in cotone, cambiati e preparati a ogni soggiorno.",
    alt: "Asciugamani bianchi piegati sul letto",
  },
  {
    src: "/images/dettagli/cortesia.jpg",
    title: "Set di cortesia",
    text: "Piccole attenzioni che gli ospiti notano e ricordano nelle recensioni.",
    alt: "Saponette e prodotti di cortesia in bagno",
  },
  {
    src: "/images/dettagli/caffe.jpg",
    title: "Pronti all'arrivo",
    text: "Una casa dotata del necessario, dal caffè del mattino al Wi-Fi per lavorare.",
    alt: "Macchina del caffè con capsule colorate",
  },
];

export const faqs = [
  {
    q: "Il mio immobile è adatto agli affitti brevi?",
    a: "Dipende da zona, tipologia, stato e regole del condominio. Per questo partiamo sempre da un'analisi: valutiamo con te se e come ha senso affittarlo a breve termine, e te lo diciamo con franchezza anche quando la risposta è no.",
  },
  {
    q: "Come viene preparata l'analisi?",
    a: "Partiamo dalle informazioni che ci dai nel modulo o durante la chiamata, poi consideriamo la domanda nella zona, la stagionalità, gli eventi in città e le caratteristiche della casa. Se serve, organizziamo un sopralluogo. L'analisi è gratuita e non ti impegna.",
  },
  {
    q: "Cosa comprende la gestione?",
    a: "Di norma: annunci e canali di prenotazione, prezzi dinamici, comunicazione con gli ospiti, check-in e check-out, pulizie e biancheria, coordinamento della manutenzione, adempimenti per gli ospiti e rendicontazione. Il perimetro preciso è indicato nella proposta e nel contratto.",
  },
  {
    q: "Come si definisce il compenso?",
    a: "Il compenso è una percentuale sugli incassi delle prenotazioni che gestiamo, definita in base all'immobile dopo l'analisi. La trovi indicata con chiarezza nella proposta, insieme a cosa è incluso.",
  },
  {
    q: "Chi segue gli ospiti?",
    a: "Il nostro team: risponde ai messaggi prima e durante il soggiorno, organizza l'accesso e gestisce eventuali richieste. Per le emergenze gli ospiti hanno un contatto disponibile 24 ore su 24.",
  },
  {
    q: "Come vengono organizzate pulizie e manutenzioni?",
    a: "Le pulizie sono affidate a un'impresa professionale che lavora sui nostri appartamenti, con biancheria in cotone di qualità. Per la manutenzione coordiniamo tecnici di fiducia e ti teniamo informato prima degli interventi rilevanti.",
  },
  {
    q: "Come ricevo i rendiconti?",
    a: "Con un foglio condiviso aggiornato a ogni prenotazione, dove vedi gli incassi e il netto del mese. Se vuoi, puoi anche accedere alle piattaforme per controllare calendario, prezzi e messaggi.",
  },
  {
    q: "Posso usare personalmente l'immobile?",
    a: "Sì. Basta comunicarci le date che ti servono e le blocchiamo sul calendario. Tempi di preavviso ed eventuali condizioni sono indicati nel contratto.",
  },
  {
    q: "Quali adempimenti sono necessari?",
    a: "In generale: codici CIR e CIN, eventuale SCIA, comunicazione degli ospiti su Alloggiati Web, rilevazioni statistiche e imposta di soggiorno. Ti spieghiamo cosa vale nel tuo caso e ti supportiamo nelle pratiche previste dal servizio.",
  },
  {
    q: "Come inizia e come termina la collaborazione?",
    a: "Inizia con la firma del contratto di gestione, dopo che hai valutato la proposta. Durata, rinnovo e modalità di disdetta sono scritti nel contratto, così sai fin dall'inizio come uscire se le cose non vanno come previsto.",
  },
];
