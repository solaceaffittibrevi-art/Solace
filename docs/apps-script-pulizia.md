# Pulizia automatica delle richieste (12 mesi) — Apps Script

Da fare una sola volta, dal browser, con l'account **solace.gestione@gmail.com**. Circa 5 minuti.
Il file da incollare è `scripts/google-apps-script/Pulizia.gs` (nessun segreto: si può copiare da GitHub).

## 1. Inserire il codice
1. Apri <https://script.google.com> → progetto **Solace richieste**.
2. A sinistra, file **Senza titolo.gs** (se non c'è: **+** accanto a "File" → **Script**). Menu ⋮ del file →
   **Rinomina** → `Pulizia`.
3. Cancella tutto il contenuto del file, incolla l'intero `Pulizia.gs`, poi **Salva** (icona del dischetto).
   Non toccare `Codice.gs` e non serve una nuova distribuzione: la pulizia non cambia l'app web.

### Permessi del progetto (appsscript.json)
Il progetto deve dichiarare anche l'accesso a Gmail, oltre all'invio delle email. Impostazioni progetto (ingranaggio)
→ spunta **Mostra il file manifest "appsscript.json" nell'editor** → nell'editor apri `appsscript.json` e sostituisci
il contenuto con `scripts/google-apps-script/appsscript.json`, poi Salva. Le impostazioni dell'app web non cambiano.

Se Google non chiede il nuovo consenso ("The script does not have permission…"): myaccount.google.com/connections
(account solace.gestione@gmail.com) → **Solace richieste** → rimuovi l'accesso, poi esegui subito di nuovo
`verificaSelezione` e concedi il consenso (finché non lo concedi il modulo del sito non invia email). Con più
account Google aperti nel browser la finestra del consenso può dare "Impossibile aprire il file": usare una
finestra privata con il solo account Solace. Dopo il consenso, `provaInvio` conferma che l'invio funziona.

## 2. Verifica (nessuna modifica alla casella)
1. In alto, menu a tendina delle funzioni → **verificaSelezione** → **Esegui**.
2. Alla prima esecuzione Google chiede l'autorizzazione: **Rivedi autorizzazioni** → account
   solace.gestione@gmail.com → **Avanzate** → **Vai a Solace richieste (non sicuro)** → **Consenti**.
   È l'accesso a Gmail necessario per leggere e spostare nel Cestino le richieste; lo script è tuo.
3. Nel **Registro di esecuzione** controlla:
   - `richieste di prova TEST SOLACE (escluse)`: almeno **1** (la prova "TEST SOLACE 3");
   - `oggetto uguale ma formato diverso`: deve essere **0**;
   - `richieste del modulo riconosciute`: il numero di richieste reali ricevute dal sito.

Se i numeri non tornano, **fermati** e manda i soli numeri: nessun dato personale compare nel registro.

## 3. Simulazione (nessuna modifica)
Funzione **simulaPulizia** → **Esegui**. Riporta quanti messaggi verrebbero spostati nel Cestino oggi (all'inizio
è normale che sia 0: le richieste del sito hanno meno di 12 mesi).

## 4. Attivazione mensile
Funzione **installaPuliziaMensile** → **Esegui**. Da qui in poi lo script gira il giorno 1 di ogni mese tra le 3 e
le 4. Per controllare: icona dell'orologio (**Trigger**) a sinistra → una riga `pulisciRichiesteVecchie`,
"Basato sul tempo", "Timer mensile". Rifiuta di partire se la simulazione non è stata eseguita negli ultimi 7 giorni.

Per fermarla: **disattivaPuliziaMensile** → **Esegui**.

## Cosa fa e cosa non fa
- Sposta nel Cestino solo i singoli messaggi generati dal modulo con più di 12 mesi; Gmail li elimina dopo 30 giorni.
- Non tocca mai risposte, inoltri, email di altri mittenti, le prove "TEST SOLACE" e le prove dall'editor.
- Non elimina conversazioni intere: le risposte scambiate con il proprietario restano.
- Le richieste di prova "TEST SOLACE" vanno eliminate a mano quando non servono più.

## Stato
Configurata il 2/10/2026: `verificaSelezione` ha riconosciuto 3 conversazioni, 3 richieste di prova "TEST SOLACE"
(escluse), 0 richieste reali, 0 altri messaggi, 0 messaggi con formato diverso; simulazione eseguita e pulizia
mensile attivata dal titolare.
