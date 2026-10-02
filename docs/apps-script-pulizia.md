# Pulizia automatica delle richieste (12 mesi) — Apps Script

Da fare una sola volta, dal browser, con l'account **solace.gestione@gmail.com**. Circa 5 minuti.
Il file da incollare è `scripts/google-apps-script/Pulizia.gs` (nessun segreto: si può copiare da GitHub).

## 1. Inserire il codice
1. Apri <https://script.google.com> → progetto **Solace richieste**.
2. A sinistra, file **Senza titolo.gs** (se non c'è: **+** accanto a "File" → **Script**). Menu ⋮ del file →
   **Rinomina** → `Pulizia`.
3. Cancella tutto il contenuto del file, incolla l'intero `Pulizia.gs`, poi **Salva** (icona del dischetto).
   Non toccare `Codice.gs` e non serve una nuova distribuzione: la pulizia non cambia l'app web.

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
