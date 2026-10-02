/**
 * Solace - conservazione delle richieste del modulo per 12 mesi (informativa privacy, punto 5).
 * Secondo file del progetto Apps Script "Solace richieste" (non contiene codici segreti).
 * Va nello stesso progetto di Codice.gs: i nomi qui sotto non si sovrappongono a quelli di Codice.gs.
 *
 * Interviene SOLO sui singoli messaggi generati dal modulo del sito (Codice.gs), riconosciuti da
 * TUTTI questi elementi, uguali al formato effettivo delle email:
 *  - oggetto esattamente "Solace — Nuova richiesta di analisi immobile" (trattino lungo, senza "Re:" o "Fwd:");
 *  - mittente "Sito Solace" <solace.gestione@gmail.com>;
 *  - testo che inizia con la riga "Nome: " e contiene la riga "Ricevuta il: " (scritte da app/api/richiesta);
 *  - ricevuti da piu di 12 mesi.
 * Esclusi sempre:
 *  - risposte, inoltri e qualsiasi email scritta a mano (oggetto o mittente diversi);
 *  - email di prova dall'editor (oggetto "... (prova dall'editor)");
 *  - richieste di prova inviate dal sito con nome che inizia per "TEST SOLACE" (da eliminare a mano).
 *
 * Messaggi e conversazioni: Gmail raggruppa le email in conversazioni. Qui si sposta nel Cestino il
 * SINGOLO messaggio (GmailMessage.moveToTrash), mai l'intera conversazione: le risposte scambiate con
 * il proprietario nella stessa conversazione restano dove sono.
 * Il Cestino di Gmail elimina definitivamente i messaggi dopo 30 giorni.
 *
 * Ordine d'uso (menu "Esegui" dell'editor, poi leggere il "Registro di esecuzione"):
 *  1) verificaSelezione: conteggi su TUTTE le date, per controllare che i criteri riconoscano le email del
 *     modulo (es. la prova "TEST SOLACE 3" deve risultare tra le richieste di prova). Nessuna modifica.
 *  2) simulaPulizia: quanti messaggi verrebbero eliminati oggi. Nessuna modifica.
 *  3) installaPuliziaMensile: attiva l'esecuzione automatica il giorno 1 di ogni mese. Funziona solo se
 *     simulaPulizia e stata eseguita negli ultimi 7 giorni.
 * I registri riportano solo numeri: nessun nome, recapito o testo delle richieste.
 */
const PULIZIA_OGGETTO = "Solace — Nuova richiesta di analisi immobile";
const PULIZIA_MITTENTE = "solace.gestione@gmail.com";
const PULIZIA_NOME_MITTENTE = "Sito Solace";
const PULIZIA_MESI = 12;
// Limite per esecuzione, per restare entro i tempi di Apps Script: il resto passa al mese successivo.
const PULIZIA_MAX_PER_ESECUZIONE = 400;
const PULIZIA_PROVA = /^Nome: *TEST SOLACE/im;

function pulizia_limite_() {
  const limite = new Date();
  limite.setMonth(limite.getMonth() - PULIZIA_MESI);
  return limite;
}

// Esamina le conversazioni che contengono email con l'oggetto del modulo e classifica ogni messaggio.
// soloVecchi = true limita la ricerca alle email con piu di 12 mesi.
function pulizia_esamina_(soloVecchi) {
  const limite = pulizia_limite_();
  const query =
    "from:" + PULIZIA_MITTENTE + ' subject:"Nuova richiesta di analisi immobile" -in:trash' +
    (soloVecchi ? " older_than:" + PULIZIA_MESI + "m" : "");
  const esito = {
    conversazioni: 0,
    richiesteModulo: 0, // messaggi del modulo, qualsiasi data, prove escluse
    richiesteProva: 0, // "TEST SOLACE": mai eliminate in automatico
    recenti: 0, // del modulo, ma con meno di 12 mesi
    altriMessaggi: 0, // risposte, inoltri, prove dall'editor, email estranee nelle stesse conversazioni
    oggettoSenzaFormato: 0, // oggetto giusto ma mittente o testo diversi: segnale da controllare
    daEliminare: [],
  };
  for (let inizio = 0; ; inizio += 100) {
    const conversazioni = GmailApp.search(query, inizio, 100);
    esito.conversazioni += conversazioni.length;
    conversazioni.forEach(function (c) {
      c.getMessages().forEach(function (m) {
        if (m.isInTrash()) return;
        if (m.getSubject() !== PULIZIA_OGGETTO) {
          esito.altriMessaggi++;
          return;
        }
        const da = m.getFrom();
        const testo = m.getPlainBody();
        const formatoModulo =
          da.indexOf(PULIZIA_NOME_MITTENTE) !== -1 &&
          da.indexOf(PULIZIA_MITTENTE) !== -1 &&
          /^\s*Nome: /.test(testo) &&
          /^Ricevuta il: /m.test(testo);
        if (!formatoModulo) {
          esito.oggettoSenzaFormato++;
          return;
        }
        if (PULIZIA_PROVA.test(testo)) {
          esito.richiesteProva++;
          return;
        }
        esito.richiesteModulo++;
        if (m.getDate() < limite) esito.daEliminare.push(m);
        else esito.recenti++;
      });
    });
    if (conversazioni.length < 100) break;
  }
  return esito;
}

// 1) Controllo dei criteri su tutte le date. Nessuna modifica.
function verificaSelezione() {
  const e = pulizia_esamina_(false);
  console.log(
    "Verifica (tutte le date, nessuna modifica):\n" +
      "- conversazioni esaminate: " + e.conversazioni + "\n" +
      "- richieste del modulo riconosciute: " + e.richiesteModulo + "\n" +
      "  di cui con meno di 12 mesi: " + e.recenti + "\n" +
      "  di cui con piu di 12 mesi (da eliminare): " + e.daEliminare.length + "\n" +
      "- richieste di prova TEST SOLACE (escluse): " + e.richiesteProva + "\n" +
      "- altri messaggi nelle stesse conversazioni, es. risposte (esclusi): " + e.altriMessaggi + "\n" +
      "- oggetto uguale ma formato diverso (esclusi, da controllare se > 0): " + e.oggettoSenzaFormato
  );
  return { richieste: e.richiesteModulo, prove: e.richiesteProva, altri: e.altriMessaggi, anomali: e.oggettoSenzaFormato };
}

// 2) Simulazione: solo conteggio. Registra la data, richiesta da installaPuliziaMensile.
function simulaPulizia() {
  const e = pulizia_esamina_(true);
  PropertiesService.getScriptProperties().setProperty("puliziaSimulataIl", new Date().toISOString());
  console.log(
    "Simulazione: messaggi del modulo piu vecchi di 12 mesi = " + e.daEliminare.length +
      " (esclusi: prove " + e.richiesteProva + ", altri messaggi " + e.altriMessaggi +
      ", formato diverso " + e.oggettoSenzaFormato + "). Nessuna modifica eseguita."
  );
  return e.daEliminare.length;
}

// Esecuzione reale (dal trigger mensile): sposta nel Cestino i singoli messaggi selezionati.
function pulisciRichiesteVecchie() {
  const messaggi = pulizia_esamina_(true).daEliminare.slice(0, PULIZIA_MAX_PER_ESECUZIONE);
  messaggi.forEach(function (m) {
    m.moveToTrash();
  });
  console.log("Messaggi del modulo spostati nel Cestino: " + messaggi.length);
}

// 3) Crea (o ricrea) l'esecuzione automatica: il giorno 1 di ogni mese, tra le 3 e le 4.
function installaPuliziaMensile() {
  const simulata = PropertiesService.getScriptProperties().getProperty("puliziaSimulataIl");
  if (!simulata || Date.now() - Date.parse(simulata) > 7 * 24 * 60 * 60 * 1000) {
    throw new Error("Esegui prima verificaSelezione e simulaPulizia e controlla i numeri, poi riprova.");
  }
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

// Per disattivare la pulizia automatica.
function disattivaPuliziaMensile() {
  let n = 0;
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "pulisciRichiesteVecchie") {
      ScriptApp.deleteTrigger(t);
      n++;
    }
  });
  console.log("Esecuzioni automatiche rimosse: " + n);
}
