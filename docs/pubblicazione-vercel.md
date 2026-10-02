# Pubblicazione su Vercel

Checklist per mettere online il sito Solace. Nessun valore segreto è scritto qui: i valori stanno solo in
`.env.local` (sul Mac, escluso da Git) e nelle impostazioni del progetto su Vercel.

## 0. Anteprima protetta (prima della pubblicazione definitiva)
Serve a provare il sito online, visibile solo a chi ha accesso al progetto Vercel. Dominio e DNS non servono.

1. <https://vercel.com/new> → accedi con GitHub → **Import** del repository `solaceaffittibrevi-art/Solace`.
   Framework: Next.js (rilevato da solo), nessuna impostazione di build da cambiare.
2. Prima di **Deploy** apri **Environment Variables** e aggiungi le 4 variabili riservate del punto 2
   (`LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`), ciascuna con
   **Sensitive** attivo e ambienti **Production** e **Preview**. I valori si copiano da `.env.local` sul Mac
   (aprilo con `open -a TextEdit "/Users/gabrieldalmolin/Desktop/SOLACE SITO/.env.local"`), uno alla volta, senza
   incollarli altrove. **Non** aggiungere `NEXT_PUBLIC_SITE_ENV` né `NEXT_PUBLIC_SITE_URL`.
3. **Deploy**. Il ramo `main` contiene ancora lo scheletro iniziale: l'anteprima del sito completo è quella del ramo
   di lavoro. Vercel → progetto → **Deployments** → la riga del ramo `claude/trusting-thompson-uzpyam` → **Visit**
   (se non c'è ancora: **Create Deployment** → ramo `claude/trusting-thompson-uzpyam`).
4. Protezione: **Settings → Deployment Protection → Vercel Authentication** deve essere **attivo**, livello
   **Standard Protection** (predefinito: protegge tutti gli indirizzi `*.vercel.app`, compreso quello di produzione,
   finché non c'è un dominio personalizzato). Lasciare **disattivati** "Protection Bypass for Automation" e i link
   di condivisione.
5. Verifica che la protezione funzioni: apri l'indirizzo dell'anteprima in una **finestra privata** del browser.
   Deve comparire la pagina di accesso di Vercel, non il sito. Nella finestra normale, con l'accesso a Vercel,
   compare il sito. `robots.txt` deve rispondere `Disallow: /`.
6. Prova del modulo sull'anteprima: una richiesta con nome "TEST SOLACE 4" deve arrivare a
   solace.gestione@gmail.com (sarà esclusa dalla pulizia automatica perché è una prova).

## 1. Progetto
- Importa il repository `solaceaffittibrevi-art/Solace` (Framework: Next.js, impostazioni di build predefinite).
- `vercel.json` esegue le funzioni a Francoforte (`fra1`), vicino ai visitatori e in Europa.
- Node.js: 20 o superiore (predefinito di Vercel).

## 2. Variabili d'ambiente (Settings → Environment Variables)

Le variabili **riservate** vanno create con l'opzione **Sensitive** (Vercel non le mostra più dopo il salvataggio)
e non hanno il prefisso `NEXT_PUBLIC_`, quindi restano sul server e non finiscono mai nel codice inviato al
browser. Le variabili **pubbliche** (`NEXT_PUBLIC_…`) sono visibili a chiunque apra il sito: non contengono segreti.

### Riservate (Sensitive)
| Variabile | Ambienti | Note |
|---|---|---|
| `LEAD_WEBHOOK_URL` | Production, Preview | Indirizzo dell'app web Google Apps Script "Solace richieste" (…/exec). Copiarlo da `.env.local`. |
| `LEAD_WEBHOOK_SECRET` | Production, Preview | Codice condiviso con lo script (uguale a `CODICE_CONDIVISO`). Copiarlo da `.env.local`. |
| `UPSTASH_REDIS_REST_URL` | Production, Preview | Database Upstash `solace-sito` (Frankfurt, eu-central-1). In alternativa `KV_REST_API_URL` creato dall'integrazione Vercel. |
| `UPSTASH_REDIS_REST_TOKEN` | Production, Preview | Token dello stesso database. In alternativa `KV_REST_API_TOKEN`. |

### Pubbliche
| Variabile | Ambienti | Note |
|---|---|---|
| `NEXT_PUBLIC_GA4_ID` | Production | `G-1RM79G8DR2` (flusso GA4 già creato). Lo script parte solo dopo il consenso "statistiche". Prima di attivarla, aggiornare in GA4 l'URL del flusso con il dominio confermato. |
| `NEXT_PUBLIC_SITE_URL` | Production | **Solo dopo la conferma del dominio**, es. `https://<dominio-confermato>`. Senza, il sito usa l'indirizzo `*.vercel.app`. |
| `NEXT_PUBLIC_SITE_ENV` | **solo Production** | `production` **solo quando il dominio è confermato e collegato**: attiva l'indicizzazione. Finché manca, robots.txt blocca i motori di ricerca. |

### Facoltative / da non impostare
- `LEAD_EMAIL_TO` serve solo con Resend (non in uso: il destinatario è scritto nello script Google).
- `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`: solo per cambiare i
  recapiti predefiniti di `lib/site.ts` (solace.gestione@gmail.com, +39 351 402 1923).
- **Non** impostare online: `RESEND_API_URL`, `LEAD_WEBHOOK_TIMEOUT_MS` (solo test), `RESEND_API_KEY` (non usata).

## 3. Upstash Redis (limite alle richieste e doppi invii)
Creare il database **nella regione europea Frankfurt (eu-central-1)**: l'informativa privacy dichiara server
nell'Unione europea. Due modi equivalenti:
- console.upstash.com → Create Database → Redis, regione `eu-central-1`, piano Free → copiare dalla sezione
  "REST API" `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` (in locale: `bash scripts/imposta-upstash.sh`,
  poi `npm run build && npm run test:upstash` per la verifica reale senza inviare email);
- oppure Vercel → Storage → Marketplace → Upstash for Redis (regione Frankfurt) → collega al progetto.
Senza Upstash, sul sito pubblicato il modulo risponde con un errore e non accetta richieste.
Se Upstash smette di rispondere, il modulo continua a funzionare con limiti dimezzati per singola istanza.

## 4. Dominio (da fare solo dopo la conferma)
Il dominio definitivo **non è ancora confermato**: non aggiungere domini su Vercel e non modificare DNS.
Finché manca, il sito si prova sugli indirizzi di anteprima `*.vercel.app` (non indicizzati).
Quando il dominio è confermato: Vercel → Settings → Domains → aggiungere il dominio principale e la variante
`www` con reindirizzamento al principale; aggiornare i DNS come indicato da Vercel; poi impostare
`NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_SITE_ENV=production` e ripubblicare (canonical, sitemap e Open Graph
usano quell'indirizzo).

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
Guida passo passo: `docs/apps-script-pulizia.md`.
Le richieste restano solo nella casella solace.gestione@gmail.com. Pulizia automatica: nel progetto Apps Script
aggiungere il file `scripts/google-apps-script/Pulizia.gs` (nessun segreto), poi dal menu "Esegui", in ordine:
1. `verificaSelezione` (dare il consenso Google): solo conteggi su tutte le date. La prova "TEST SOLACE 3" deve
   risultare tra le "richieste di prova" e "oggetto uguale ma formato diverso" deve essere 0.
2. `simulaPulizia`: numero di messaggi che verrebbero eliminati oggi (nessuna modifica).
3. `installaPuliziaMensile`: attiva l'esecuzione del giorno 1 di ogni mese (rifiuta se manca la simulazione).
Elimina solo i singoli messaggi del modulo (mai le conversazioni, le risposte o le prove), spostandoli nel
Cestino di Gmail, che li cancella definitivamente dopo 30 giorni. `disattivaPuliziaMensile` la ferma.
