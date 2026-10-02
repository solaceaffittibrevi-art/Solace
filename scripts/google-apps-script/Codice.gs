/**
 * Solace - ricezione delle richieste del sito e invio a Gmail.
 * Da incollare in script.google.com, accedendo con solace.gestione@gmail.com.
 * L'email parte dall'account Gmail che pubblica lo script: nessuna chiave API.
 *
 * CODICE_CONDIVISO deve essere uguale a LEAD_WEBHOOK_SECRET del sito: le chiamate senza il codice
 * corretto vengono scartate. Non pubblicare questo file con il codice reale.
 *
 * Doppi invii: ogni richiesta ha un identificativo (requestId). Se arriva di nuovo entro 6 ore
 * (es. il visitatore riprova dopo un timeout) lo script risponde ok senza inviare un'altra email.
 * Dopo ogni modifica: Esegui il deployment > Gestisci deployment > modifica > Nuova versione.
 */
const DESTINATARIO = "solace.gestione@gmail.com";
const CODICE_CONDIVISO = "INCOLLA_QUI_IL_CODICE";
// Il trattino lungo e scritto come \u2014 per evitare problemi di codifica durante il copia e incolla.
const OGGETTO = "Solace \u2014 Nuova richiesta di analisi immobile";
const MEMORIA_SECONDI = 6 * 60 * 60;

function doPost(e) {
  try {
    const dati = JSON.parse(e.postData.contents);
    if (!CODICE_CONDIVISO || dati.secret !== CODICE_CONDIVISO) return risposta({ ok: false, error: "forbidden" });

    const id = /^[A-Za-z0-9.-]{8,80}$/.test(String(dati.requestId || "")) ? "lead:" + dati.requestId : "";
    const memoria = CacheService.getScriptCache();
    const blocco = LockService.getScriptLock();
    blocco.waitLock(15000);
    try {
      if (id && memoria.get(id)) return risposta({ ok: true, duplicate: true });

      const opzioni = {
        to: DESTINATARIO,
        subject: OGGETTO,
        body: String(dati.text || "").slice(0, 20000),
        name: "Sito Solace",
      };
      const replyTo = String(dati.replyTo || "");
      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(replyTo)) opzioni.replyTo = replyTo;

      MailApp.sendEmail(opzioni);
      if (id) memoria.put(id, "1", MEMORIA_SECONDI);
      return risposta({ ok: true });
    } finally {
      blocco.releaseLock();
    }
  } catch (err) {
    return risposta({ ok: false, error: "errore" });
  }
}

// Visitando l'indirizzo dal browser compare solo questo messaggio: nessun dato esposto.
function doGet() {
  return risposta({ ok: true, servizio: "Solace richieste" });
}

// Da eseguire una volta dall'editor ("Esegui") se Google chiede l'autorizzazione a inviare email:
// manda un'email di prova a DESTINATARIO.
function provaInvio() {
  MailApp.sendEmail(DESTINATARIO, OGGETTO + " (prova dall'editor)", "Se leggi questa email, lo script puo inviare da Gmail.");
}

function risposta(oggetto) {
  return ContentService.createTextOutput(JSON.stringify(oggetto)).setMimeType(ContentService.MimeType.JSON);
}
