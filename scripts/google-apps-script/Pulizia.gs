/**
 * Solace - conservazione delle richieste del modulo per 12 mesi (informativa privacy, punto 5).
 * Secondo file del progetto Apps Script "Solace richieste" (non contiene codici segreti).
 *
 * Interviene SOLO sui singoli messaggi inviati dal modulo del sito:
 *  - mittente "Sito Solace" <solace.gestione@gmail.com> (l'email generata dallo script),
 *  - oggetto esattamente "Solace - Nuova richiesta di analisi immobile" (con il trattino lungo),
 *  - testo che contiene la riga "Ricevuta il:",
 *  - ricevuti da piu di 12 mesi.
 * Le risposte scritte a mano, le altre email e le email di prova dall'editor non vengono toccate.
 * I messaggi vanno nel Cestino di Gmail, che li elimina definitivamente dopo 30 giorni.
 *
 * 1) simulaPulizia: conta i messaggi che verrebbero eliminati, senza toccare nulla.
 * 2) installaPuliziaMensile: attiva l'esecuzione automatica il giorno 1 di ogni mese.
 */
const OGGETTO_RICHIESTA = "Solace \u2014 Nuova richiesta di analisi immobile";
const MITTENTE_RICHIESTA = "solace.gestione@gmail.com";
const MESI_CONSERVAZIONE = 12;

function richiesteDaEliminare_() {
  const limite = new Date();
  limite.setMonth(limite.getMonth() - MESI_CONSERVAZIONE);
  const query =
    'from:' + MITTENTE_RICHIESTA + ' subject:"Nuova richiesta di analisi immobile" older_than:' + MESI_CONSERVAZIONE + "m -in:trash";
  const trovati = [];
  for (let inizio = 0; ; inizio += 100) {
    const conversazioni = GmailApp.search(query, inizio, 100);
    conversazioni.forEach(function (c) {
      c.getMessages().forEach(function (m) {
        const daModulo =
          m.getSubject() === OGGETTO_RICHIESTA &&
          m.getFrom().indexOf("Sito Solace") !== -1 &&
          m.getFrom().indexOf(MITTENTE_RICHIESTA) !== -1 &&
          m.getPlainBody().indexOf("Ricevuta il:") !== -1;
        if (daModulo && m.getDate() < limite && !m.isInTrash()) trovati.push(m);
      });
    });
    if (conversazioni.length < 100) break;
  }
  return trovati;
}

// Solo conteggio: nessun messaggio viene spostato o modificato.
function simulaPulizia() {
  const n = richiesteDaEliminare_().length;
  console.log("Simulazione: messaggi del modulo piu vecchi di 12 mesi = " + n + " (nessuna modifica eseguita)");
  return n;
}

function pulisciRichiesteVecchie() {
  const messaggi = richiesteDaEliminare_();
  messaggi.forEach(function (m) {
    m.moveToTrash();
  });
  console.log("Messaggi del modulo spostati nel Cestino: " + messaggi.length);
}

// Crea (o ricrea) l'esecuzione automatica: il giorno 1 di ogni mese, tra le 3 e le 4.
function installaPuliziaMensile() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) {
      return t.getHandlerFunction() === "pulisciRichiesteVecchie";
    })
    .forEach(function (t) {
      ScriptApp.deleteTrigger(t);
    });
  ScriptApp.newTrigger("pulisciRichiesteVecchie").timeBased().onMonthDay(1).atHour(3).create();
  console.log("Pulizia mensile attivata (giorno 1 di ogni mese, ore 3-4).");
}
