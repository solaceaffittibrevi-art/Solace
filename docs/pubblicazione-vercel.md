# Pubblicazione su Vercel

Checklist per mettere online il sito Solace. Nessun valore segreto è scritto qui: i valori stanno solo in
`.env.local` (sul Mac, escluso da Git) e nelle impostazioni del progetto su Vercel.

## 1. Progetto
- Importa il repository `solaceaffittibrevi-art/Solace` (Framework: Next.js, impostazioni di build predefinite).
- `vercel.json` esegue le funzioni a Francoforte (`fra1`), vicino ai visitatori e in Europa.
- Node.js: 20 o superiore (predefinito di Vercel).

## 2. Variabili d'ambiente (Settings → Environment Variables)

| Variabile | Ambienti | Note |
|---|---|---|
| `LEAD_WEBHOOK_URL` | Production, Preview | Indirizzo dell'app web Google Apps Script "Solace richieste". **Sensitive**. Copiarlo da `.env.local`. |
| `LEAD_WEBHOOK_SECRET` | Production, Preview | Codice condiviso con lo script. **Sensitive**. Copiarlo da `.env.local`. |
| `LEAD_EMAIL_TO` | Production, Preview | `solace.gestione@gmail.com` (usato solo con Resend; lo script ha il destinatario nel codice). |
| `NEXT_PUBLIC_SITE_URL` | Production | `https://solaceaffittibrevi.com` (dominio definitivo). |
| `NEXT_PUBLIC_SITE_ENV` | **solo Production** | `production`. Nelle anteprime lasciarla vuota: restano fuori dai motori di ricerca. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Production, Preview | Da Upstash (punto 3). **Sensitive** il token. In alternativa `KV_REST_API_URL`/`KV_REST_API_TOKEN` creati dall'integrazione Vercel. |
| `NEXT_PUBLIC_GA4_ID` | Production | Facoltativo: identificativo Google Analytics 4 (`G-…`). Caricato solo dopo il consenso. Ricostruire il sito dopo averlo impostato. |

Da **non** impostare online: `RESEND_API_URL`, `LEAD_WEBHOOK_TIMEOUT_MS` (servono solo ai test),
`RESEND_API_KEY` (non usata: l'invio passa da Google Apps Script).

## 3. Upstash Redis (limite alle richieste e doppi invii)
Creare il database **nella regione europea Frankfurt (eu-central-1)**: l'informativa privacy dichiara server
nell'Unione europea. Due modi equivalenti:
- console.upstash.com → Create Database → Redis, regione `eu-central-1`, piano Free → copiare dalla sezione
  "REST API" `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` (in locale: `bash scripts/imposta-upstash.sh`,
  poi `npm run build && npm run test:upstash` per la verifica reale senza inviare email);
- oppure Vercel → Storage → Marketplace → Upstash for Redis (regione Frankfurt) → collega al progetto.
Senza Upstash, sul sito pubblicato il modulo risponde con un errore e non accetta richieste.
Se Upstash smette di rispondere, il modulo continua a funzionare con limiti dimezzati per singola istanza.

## 4. Dominio
Vercel → Settings → Domains: aggiungere `solaceaffittibrevi.com` (principale) e `www.solaceaffittibrevi.com`
con reindirizzamento al principale, poi aggiornare i DNS come indicato da Vercel. Il dominio oggi ospita la
landing attuale: il passaggio la sostituisce.

## 5. Dopo il primo deploy
1. `https://<dominio>/robots.txt` deve permettere l'indicizzazione solo in Production.
2. Intestazioni di sicurezza presenti (Content-Security-Policy, Strict-Transport-Security, X-Frame-Options).
3. Un invio reale "TEST SOLACE" dal modulo online: email ricevuta su solace.gestione@gmail.com, conferma a schermo.
4. Nei log della funzione nessun errore `[kv]` (Upstash raggiungibile) e, nel Data Browser di Upstash, chiavi
   `rl:*` e `lead:*` create dopo l'invio di prova: è la verifica che il limite alle richieste usa davvero Upstash.
5. Il video della home parte in automatico, muto e in loop (desktop, mobile e Safari).

## 6. Se si cambia il codice condiviso o lo script
Script Google: incollare il nuovo codice, salvare, poi Esegui il deployment → Gestisci deployment → modifica →
**Nuova versione** (l'indirizzo resta lo stesso). Aggiornare `LEAD_WEBHOOK_SECRET` su Vercel e in `.env.local`.

## 7. Conservazione delle richieste (12 mesi)
Le richieste restano solo nella casella solace.gestione@gmail.com. Pulizia automatica: nel progetto Apps Script
aggiungere il file `scripts/google-apps-script/Pulizia.gs` (nessun segreto), eseguire una volta
`installaPuliziaMensile` e dare il consenso Google. In alternativa, ogni mese in Gmail cercare
`subject:"Nuova richiesta di analisi immobile" older_than:12m` ed eliminare i risultati non più necessari.
