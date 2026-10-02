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
| `NEXT_PUBLIC_SITE_URL` | Production | Dominio definitivo con https, es. `https://www.dominio.it`. |
| `NEXT_PUBLIC_SITE_ENV` | **solo Production** | `production`. Nelle anteprime lasciarla vuota: restano fuori dai motori di ricerca. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Production, Preview | Create in automatico collegando Upstash (punto 3). |
| `NEXT_PUBLIC_PRIVACY_URL` | Production | Indirizzo dell'informativa privacy, quando pubblicata. |

Da **non** impostare online: `RESEND_API_URL`, `LEAD_WEBHOOK_TIMEOUT_MS` (servono solo ai test),
`RESEND_API_KEY` (non usata: l'invio passa da Google Apps Script).

## 3. Upstash Redis (limite alle richieste e doppi invii)
Storage → Marketplace → **Upstash for Redis** → piano gratuito → collega al progetto (Production e Preview).
Senza Upstash, sul sito pubblicato il modulo risponde con un errore e non accetta richieste.

## 4. Dopo il primo deploy
1. `https://<dominio>/robots.txt` deve permettere l'indicizzazione solo in Production.
2. Intestazioni di sicurezza presenti (Content-Security-Policy, Strict-Transport-Security, X-Frame-Options).
3. Un invio reale "TEST SOLACE" dal modulo online: email ricevuta su solace.gestione@gmail.com, conferma a schermo.
4. Nei log della funzione nessun errore `[kv]` (Upstash raggiungibile).

## 5. Se si cambia il codice condiviso o lo script
Script Google: incollare il nuovo codice, salvare, poi Esegui il deployment → Gestisci deployment → modifica →
**Nuova versione** (l'indirizzo resta lo stesso). Aggiornare `LEAD_WEBHOOK_SECRET` su Vercel e in `.env.local`.
