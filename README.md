# Solace – Sito

Sito di Solace Real Estate Short Rent per proprietari di immobili a Milano.
Next.js 16 (App Router), TypeScript, animazioni con [Motion](https://motion.dev).

## Avvio in locale

Requisiti: Node.js 20 o superiore.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Poi apri http://localhost:3000.

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | sito in sviluppo |
| `npm run build` | build di produzione |
| `npm run lint` | controllo ESLint |
| `npm run typecheck` | controllo TypeScript |
| `npm run test:api` | test del modulo contatti con servizi simulati (dopo `npm run build`; nessuna email reale) |

## Configurazione (`.env.local`)

Vedi `.env.example`. Prima della pubblicazione servono almeno:

- Ricezione delle richieste: `LEAD_WEBHOOK_URL` (webhook di Make, Zapier, n8n o CRM) e/o
  `RESEND_API_KEY` + `LEAD_EMAIL_TO` (email tramite Resend). Senza almeno un canale il modulo mostra
  un errore e non conferma mai un invio. Con la richiesta arrivano anche pagina d'ingresso, sito di
  provenienza e parametri UTM.
- Limite alle richieste e doppi invii: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (oppure
  `KV_REST_API_URL` + `KV_REST_API_TOKEN` creati dall'integrazione Upstash di Vercel). Obbligatori sul sito
  pubblicato: senza, il modulo non accetta richieste. Limiti: 5 invii ogni 10 minuti e 20 al giorno per
  connessione, 60 l'ora per tutto il sito.
- Sicurezza: intestazioni e Content Security Policy sono in `next.config.ts`. Se si aggiungono servizi esterni
  (Tag Manager, Analytics, widget incorporati) vanno aggiunti i loro domini alla policy.
- Misurazione: gli eventi (`cta_click`, `form_start`, `form_error`, `lead_submit_success`,
  `whatsapp_click`, `phone_click`, `email_click`, `calendly_click`) vengono scritti in `window.dataLayer`
  solo quando Tag Manager / GA4 saranno installati, nel rispetto dei consensi. Nessun dato personale.
- `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_SITE_ENV=production` sul dominio definitivo.
- Recapiti pubblici e URL dell'informativa privacy, se disponibili.

## Dove modificare

- `lib/site.ts` – contenuti verificati: numeri, servizi, passi, FAQ, recensioni, immobili
- `lib/motion.ts` – durate, curve e spring condivise da tutte le animazioni
- `app/globals.css` – token di colore, tipografia e layout
- `design-system/solace/MASTER.md` – regole del design system
- `public/images/` – foto degli immobili; `public/brand/` – logo vettoriale
