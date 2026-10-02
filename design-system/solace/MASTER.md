# Design System – Solace (MASTER)

Fonte di verità per l'interfaccia del sito. Le regole specifiche di una pagina vanno in
`design-system/solace/pages/<pagina>.md` e prevalgono su questo file.

Definito con la skill UI UX Pro Max (v2.13.0) a partire dal brand autentico: logo vettoriale
Solace, brochure e presentazioni. Animazioni progettate con la skill Motion (pacchetto `motion`).

## Prodotto

- **Tipo:** sito di acquisizione proprietari per una società di gestione affitti brevi a Milano.
- **Pubblico:** proprietari, investitori, chi vuole delegare la gestione. Spesso da smartphone.
- **Obiettivo:** richiesta di analisi gratuita → contatto → chiamata o sopralluogo → proposta.
- **Stack:** Next.js 16 (App Router), TypeScript, CSS globale con token, `motion` per le animazioni.

## Architettura

`/` home · `/servizi` · `/come-funziona` · `/immobili` + `/immobili/[slug]` · `/chi-siamo` · `/faq` ·
`/analisi-gratuita` (modulo + Calendly). Una sola CTA primaria in tutto il sito: **Richiedi un'analisi gratuita**.
CTA secondaria: **Prenota una chiamata** (Calendly verificato) o **Scopri come funziona**.

## Stile

**Lusso editoriale contemporaneo.** Blu notte profondo con sezioni "carta" avorio in alternanza,
oro usato solo come accento (titoli in corsivo, linee, numeri, CTA). Fotografie reali grandi,
linee sottili color oro, numerazioni editoriali (01, 02…). Niente ombre pesanti né gradienti colorati.
Elementi grafici del mondo casa: pianta d'appartamento disegnata a linea (percorso), skyline di Milano
a linea (footer), monogramma SR del logo.

## Colori (token in `app/globals.css`)

| Token | Scuro (default) | Carta (`.section--paper`) |
|---|---|---|
| `--bg` | `#070b16` | `#f5f0e7` |
| `--surface` | `#111a2e` | `#fbf8f2` |
| `--text` | `#f3efe6` (17:1) | `#0b1222` (16,5:1) |
| `--muted` | `#a9a49a` (7,9:1) | `#59524a` (6,8:1) |
| `--accent` | `#e2c88f` (12:1) | `#7a5a1f` (5,6:1) |
| `--field-border` | `#77736b` (≥3,7:1) | `#8d8577` (3,2:1) |
| `--error` | `#f2a69b` (8,8:1) | `#a1271b` (6,6:1) |

Pulsante primario: fondo oro `#c9a45c`, testo `#0b1222` (8:1). Le sezioni carta ridefiniscono i token,
quindi i componenti non contengono colori esadecimali propri.

## Tipografia

Cormorant Garamond (titoli, corsivo per l'enfasi) + Montserrat (testo, etichette), via `next/font`.
Testo 16px / 1,65; etichette maiuscole spaziate ≥ 12px; H1 hero `clamp(2.9rem, 7.4vw, 6.4rem)`.

## Icone (liquid glass)

Set lineare in `components/Icon.tsx`: griglia 24×24, tratto 1,6 uniforme, estremità e giunture arrotondate,
forme con raggi morbidi. Contenitore `components/GlassIcon.tsx` (stili `.glass-icon` in `globals.css`):

- **Forma:** squircle (`corner-shape: squircle` dove supportato, altrimenti `border-radius: 30%`).
- **Taglie:** `lg` 60px / simbolo 24px (icone di sezione), `md` 44px / 20px (FAQ, numeri, social, galleria),
  `sm` 32px / 16px (elenchi e righe di contatto). Il simbolo occupa circa il 40% del contenitore.
- **Vetro:** riempimento semitrasparente a gradiente, `backdrop-filter: blur(14px) saturate(140%)`, bordo 1px
  luminoso, riflesso nella metà superiore, punto luce interno dorato tenue, ombra esterna morbida.
- **Tema:** token `--glass-*` scuri di default, ridefiniti nelle sezioni carta (vetro chiaro, simbolo `--gold-ink` 5,6:1).
- **Hover** (solo elementi interattivi): sollevamento di 2px e luminosità +12% in 400ms; con movimento ridotto
  nessuno spostamento.
- Restano senza contenitore solo le icone dentro testi e pulsanti (frecce, link esterni, spunte dei vantaggi,
  stelle, posizione): un contenitore lì appesantirebbe la lettura.

## Movimento (`lib/motion.ts`)

| Token | Valore | Uso |
|---|---|---|
| `duration.fast` | 0,2 s | hover, icone, feedback modulo |
| `duration.base` | 0,5 s | comparse di testo e card |
| `duration.slow` | 0,9 s | immagini, linee, dissolvenze incrociate |
| `duration.hero` | 1,1 s | ingresso hero |
| `ease.out` | `[0.22, 1, 0.36, 1]` | entrate |
| `ease.inOut` | `[0.65, 0, 0.35, 1]` | cambi di stato, disegno linee |
| `spring.soft` / `spring.snappy` | bounce 0,12 / 0,08 | elementi interrompibili (icone FAQ, conferme) |
| `stagger` | 0,06 / 0,1 / 0,16 s | sequenze |
| `rise` | 20px | spostamento massimo delle comparse |

Effetti: ingresso progressivo hero, reveal allo scroll (`Reveal`, `Stagger`), parallasse leggera su poche
immagini (`Parallax`), contatori per dati verificati (`Counter`), menu mobile con clip-path e sequenza,
FAQ con `grid-template-rows`, lightbox con dissolvenza direzionale, dissolvenza incrociata nei dettagli,
pianta che si disegna con lo scroll (`ProcessStory`), skyline disegnato, feedback del modulo.

Regole: solo `transform`, `opacity`, `clip-path` e `pathLength`; `MotionConfig reducedMotion="user"`;
parallasse, contatori e disegni sono statici con movimento ridotto; senza JavaScript la classe `.reveal`
rende tutto visibile; nessuna animazione blocca lo scroll o ritarda un'azione.

## Accessibilità

Contrasti come da tabella; focus visibile ovunque; link "Vai al contenuto"; menu mobile con trappola del
focus, Esc e ritorno del focus; lightbox su `<dialog>` con frecce e Esc; FAQ con `aria-expanded`;
modulo con etichette visibili, errori sotto il campo, riepilogo errori focalizzato, stato di invio e
conferma solo dopo risposta positiva del server; target ≥ 44px; un solo H1 per pagina.

## Contenuti: regole

- Solo dati verificati (fonte annotata in `lib/site.ts`). Niente garanzie di rendimento o occupazione.
- Recensioni: solo quelle reali degli ospiti, con attribuzione e lingua originale.
- Immobili: zona indicata nell'annuncio, mai l'indirizzo esatto; link all'annuncio reale.
- Compenso e condizioni: rimandati alla proposta personalizzata.

## Checklist prima della consegna

- [x] Nessuna emoji come icona (set SVG lineare in `components/Icon.tsx`)
- [x] Hover 150–450ms, transizioni su transform/opacity
- [x] Contrasti verificati, focus visibile
- [x] `prefers-reduced-motion` gestito (CSS + Motion)
- [x] Nessuno scroll orizzontale a 360, 390, 768, 1024, 1440px
- [x] `next/image`, `next/font`, metadata, sitemap, robots, JSON-LD
