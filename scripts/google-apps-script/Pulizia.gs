/**
 * Solace - conservazione delle richieste per 12 mesi (informativa privacy, punto 5).
 * Secondo file del progetto Apps Script "Solace richieste" (non contiene codici segreti).
 *
 * pulisciRichiesteVecchie: sposta nel Cestino le conversazioni con le richieste del sito il cui
 * ultimo messaggio ha piu di 12 mesi. Gmail elimina definitivamente il Cestino dopo 30 giorni.
 * Le conversazioni con messaggi recenti (es. una risposta inviata da poco) restano.
 *
 * Installazione (una volta): selezionare installaPuliziaMensile ed eseguirla dall'editor.
 * Google chiedera il consenso alla gestione della posta: e necessario per spostare le email nel Cestino.
 */
const OGGETTO_RICHIESTE = "Nuova richiesta di analisi immobile";
const MESI_CONSERVAZIONE = 12;

function pulisciRichiesteVecchie() {
  const limite = new Date();
  limite.setMonth(limite.getMonth() - MESI_CONSERVAZIONE);
  const query = 'subject:"' + OGGETTO_RICHIESTE + '" older_than:' + MESI_CONSERVAZIONE + "m -in:trash";
  let spostate = 0;
  for (let inizio = 0; ; inizio += 100) {
    const conversazioni = GmailApp.search(query, inizio, 100);
    if (!conversazioni.length) break;
    const vecchie = conversazioni.filter(function (c) {
      return c.getLastMessageDate() < limite;
    });
    if (vecchie.length) GmailApp.moveThreadsToTrash(vecchie);
    spostate += vecchie.length;
    if (conversazioni.length < 100) break;
  }
  console.log("Conversazioni spostate nel Cestino: " + spostate);
}

// Crea (o ricrea) l'attivazione automatica: il giorno 1 di ogni mese, tra le 3 e le 4.
function installaPuliziaMensile() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) {
      return t.getHandlerFunction() === "pulisciRichiesteVecchie";
    })
    .forEach(function (t) {
      ScriptApp.deleteTrigger(t);
    });
  ScriptApp.newTrigger("pulisciRichiesteVecchie").timeBased().onMonthDay(1).atHour(3).create();
  pulisciRichiesteVecchie();
}
