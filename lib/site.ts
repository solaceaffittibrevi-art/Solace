// Contenuti del sito. Ogni dato qui è verificato su una fonte indicata nel commento:
// prima di aggiungere numeri, nomi o recensioni, controlla che siano reali e aggiornati.

export const site = {
  name: "Solace",
  legalName: "Solace Real Estate Short Rent",
  // Dati dell'attività forniti dal titolare il 2/10/2026: usare sempre questa forma, identica in tutto il sito.
  business: "Solace di Dal Molin Gabriel",
  vat: "03963440122",
  // Sede legale e contatto privacy forniti dal titolare il 2/10/2026.
  address: {
    street: "Via XXV Aprile 18",
    postalCode: "21022",
    city: "Azzate",
    province: "VA",
    country: "Italia",
  },
  privacyEmail: "solace.gestione@gmail.com",
  tagline: "Gestione affitti brevi a Milano",
  // Dominio definitivo; in sviluppo NEXT_PUBLIC_SITE_URL (in .env.local) lo sostituisce.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://solaceaffittibrevi.com",
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
  privacyUrl: "/privacy",
  cookieUrl: "/cookie",
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

// Ogni servizio collegato al beneficio pratico per il proprietario.
export const benefits = [
  {
    icon: "chat",
    title: "Meno messaggi e telefonate da seguire",
    text: "Rispondiamo noi agli ospiti, prima e durante il soggiorno, anche in inglese. Per le emergenze c'è un contatto attivo 24 ore su 24.",
  },
  {
    icon: "sparkle",
    title: "Un appartamento pronto a ogni arrivo",
    text: "Coordiniamo pulizie e biancheria dopo ogni partenza e organizziamo gli interventi di manutenzione quando servono.",
  },
  {
    icon: "calendar",
    title: "Tariffe adeguate alla domanda",
    text: "Aggiorniamo i prezzi in base a stagione, eventi, fiere e caratteristiche della casa, invece di lasciare una tariffa fissa.",
  },
  {
    icon: "chart",
    title: "Incassi e costi sempre visibili",
    text: "Un report aggiornato a ogni prenotazione e, se vuoi, l'accesso alle piattaforme per vedere calendario, prezzi e messaggi.",
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

// Il percorso per iniziare, in tre passaggi. Nessun impegno fino alla firma del contratto.
export const steps = [
  {
    title: "Ci mandi le informazioni sull'immobile",
    text: "Nome, un recapito e la zona: bastano pochi secondi. Se vuoi, aggiungi tipologia e situazione attuale.",
  },
  {
    title: "Ci confrontiamo e valutiamo",
    text: "Ti chiamiamo per conoscere la casa e le tue aspettative, poi valutiamo il suo potenziale in affitto breve.",
  },
  {
    title: "Ricevi la proposta di gestione",
    text: "Servizi inclusi, compenso e condizioni, nero su bianco. Se ha senso, organizziamo un sopralluogo prima di decidere.",
  },
];

// Recensioni autentiche di ospiti pubblicate su Airbnb e riportate sulla landing solaceaffittibrevi.com.
// Testo come mostrato da Airbnb (traduzione automatica in italiano); "[…]" segna i tagli per brevità.
export const testimonials = [
  {
    quote:
      "Ottimo host, molto reattivo anche a mezzanotte per il nostro check-in molto tardi e molto disponibile! […]",
    author: "Vladimir",
    origin: "Burbank, California",
    language: "dall’inglese",
  },
  {
    quote:
      "[…] L'appartamento mi ha colpito così tanto che mi sono pentito di essere rimasto a Milano solo una notte invece di qualche giorno in più.",
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
    author: "Ospite",
    origin: "Soggiorno con bambini",
    language: "dallo spagnolo",
  },
];


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
    a: "Dipende da zona, tipologia, stato e regole del condominio. Per questo partiamo sempre da una valutazione: valutiamo con te se e come ha senso affittarlo a breve termine, e te lo diciamo con franchezza anche quando la risposta è no.",
  },
  {
    q: "Come viene preparata la valutazione?",
    a: "Partiamo dalle informazioni che ci dai nel modulo o durante la chiamata, poi consideriamo la domanda nella zona, la stagionalità, gli eventi in città e le caratteristiche della casa. Se serve, organizziamo un sopralluogo. La valutazione è gratuita e non ti impegna.",
  },
  {
    q: "Cosa comprende la gestione?",
    a: "Di norma: annunci e canali di prenotazione, prezzi dinamici, comunicazione con gli ospiti, check-in e check-out, pulizie e biancheria, coordinamento della manutenzione, adempimenti per gli ospiti e rendicontazione. Il perimetro preciso è indicato nella proposta e nel contratto.",
  },
  {
    q: "Come si definisce il compenso?",
    a: "Il compenso è una percentuale sugli incassi delle prenotazioni che gestiamo, definita in base all'immobile dopo la valutazione. La trovi indicata con chiarezza nella proposta, insieme a cosa è incluso.",
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
