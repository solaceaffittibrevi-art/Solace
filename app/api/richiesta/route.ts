import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { contactKind, validateLead, type LeadInput } from "@/lib/lead";
import type { LeadSource } from "@/lib/source";
import { getStore, isDegraded, type Store } from "@/lib/kv";

// Riceve la richiesta di valutazione e la consegna a uno o entrambi i canali configurati:
//  - LEAD_WEBHOOK_URL: webhook (Make, Zapier, n8n, CRM)
//  - RESEND_API_KEY + LEAD_EMAIL_TO (+ LEAD_EMAIL_FROM): email di solo testo tramite Resend
// La richiesta è "ricevuta" solo se almeno un canale conferma la consegna: il sito non mostra mai
// una conferma non vera. Le risposte pubbliche usano codici generici; i log non contengono dati
// del contatto, indirizzi IP o credenziali.

const MAX_BODY_BYTES = 16 * 1024;

// Durata massima della funzione sull'hosting (secondi): copre l'attesa del webhook.
export const maxDuration = 30;

// Limiti per indirizzo IP (salvato solo come impronta SHA-256) e per tutto il sito, che
// protegge anche la quota del servizio email da invii distribuiti.
const LIMITS = [
  { name: "ip10m", window: 10 * 60, max: 5, perIp: true },
  { name: "ip1d", window: 24 * 60 * 60, max: 20, perIp: true },
  { name: "all1h", window: 60 * 60, max: 60, perIp: false },
];

// Doppi invii: lo stesso requestId viene prenotato durante la consegna e segnato come
// consegnato solo dopo il successo. Se la consegna fallisce la prenotazione viene liberata,
// così il visitatore può riprovare subito.
const PENDING_TTL = 60;
const DONE_TTL = 60 * 60;

const json = (body: object, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

const fail = (error: string, status: number, headers?: Record<string, string>) => json({ ok: false, error }, status, headers);

// Testo su una riga (niente a capo o caratteri di controllo, utile anche per l'oggetto email).
const line = (v: unknown, max = 300) =>
  (typeof v === "string" ? v : "").replace(/[\u0000-\u001F\u007F]+/g, " ").slice(0, max);
// Testo su più righe: conserva solo gli a capo.
const text = (v: unknown, max = 2000) =>
  (typeof v === "string" ? v : "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]+/g, " ")
    .slice(0, max);

function sameOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const allowed = new Set<string>();
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (host) allowed.add(host);
  try {
    allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "").host);
  } catch {}
  return allowed.has(originHost);
}

// Legge il corpo fermandosi appena supera il limite, anche senza Content-Length.
async function readBody(request: Request): Promise<string | null> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

function clientKey(request: Request) {
  const ip =
    request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return createHash("sha256").update(`solace:${ip}`).digest("hex").slice(0, 32);
}

async function rateLimited(store: Store, request: Request) {
  const now = Math.floor(Date.now() / 1000);
  const ip = clientKey(request);
  const entries = LIMITS.map((l) => ({
    key: `rl:${l.name}:${l.perIp ? `${ip}:` : ""}${Math.floor(now / l.window)}`,
    ttl: l.window,
  }));
  const counts = await store.incr(entries);
  // Con Upstash non raggiungibile i contatori valgono per singola istanza: limiti dimezzati.
  const strict = isDegraded();
  const hit = LIMITS.findIndex((l, i) => counts[i] > (strict ? Math.max(1, Math.floor(l.max / 2)) : l.max));
  if (hit === -1) return null;
  const { name, window } = LIMITS[hit];
  return { name, retryAfter: window - (now % window) };
}

// Motivo dell'errore senza URL, chiavi o contenuti della richiesta.
const reason = (err: unknown) =>
  err instanceof Error && /^(webhook|resend)_[a-z0-9]+$/.test(err.message) ? err.message : err instanceof Error ? err.name : "errore";

export async function POST(request: Request) {
  if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return fail("unsupported", 415);
  }
  // La provenienza blocca gli invii da altri siti; non sostituisce il limite alle richieste.
  if (!sameOrigin(request)) return fail("forbidden", 403);

  const raw = await readBody(request);
  if (raw === null) return fail("too_large", 413);

  let body: Partial<Record<keyof LeadInput, unknown>> & { source?: Partial<Record<keyof LeadSource, unknown>> };
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("invalid", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail("invalid", 400);

  const input: LeadInput = {
    name: line(body.name, 120),
    contact: line(body.contact, 120),
    zone: line(body.zone, 120),
    type: line(body.type, 60),
    count: line(body.count, 20),
    status: line(body.status, 60),
    message: text(body.message, 2000),
    website: line(body.website, 200),
    requestId: /^[A-Za-z0-9.-]{8,80}$/.test(String(body.requestId ?? "")) ? String(body.requestId) : "",
  };

  // Bot: risposta neutra, nessun inoltro.
  if (input.website) return json({ ok: true });

  const errors = validateLead(input);
  if (Object.keys(errors).length) return json({ ok: false, error: "validation", errors }, 422);

  const store = getStore();
  if (!store) {
    console.error("[richiesta] Archivio condiviso (Upstash) non configurato: richiesta non accettata.");
    return fail("unavailable", 503);
  }

  const limited = await rateLimited(store, request);
  if (limited) {
    console.warn(`[richiesta] Limite superato (${limited.name}).`);
    return fail("rate_limited", 429, { "Retry-After": String(limited.retryAfter) });
  }

  const dedupeKey = input.requestId ? `lead:${input.requestId}` : "";
  if (dedupeKey) {
    const previous = await store.claim(dedupeKey, "pending", PENDING_TTL);
    // Già consegnata: è vero che è stata ricevuta, quindi si conferma senza inoltrarla di nuovo.
    if (previous === "done") return json({ ok: true });
    if (previous !== null) return fail("in_progress", 409);
  }

  const s = body.source && typeof body.source === "object" ? body.source : {};
  const kind = contactKind(input.contact);
  const lead = {
    name: input.name.trim(),
    email: kind === "email" ? input.contact.trim() : "",
    phone: kind === "phone" ? input.contact.trim() : "",
    zone: input.zone.trim(),
    type: input.type,
    count: input.count,
    status: input.status,
    message: input.message,
    source: {
      landingPage: line(s.landingPage),
      referrer: line(s.referrer),
      utmSource: line(s.utmSource, 100),
      utmMedium: line(s.utmMedium, 100),
      utmCampaign: line(s.utmCampaign, 100),
      utmContent: line(s.utmContent, 100),
      utmTerm: line(s.utmTerm, 100),
    },
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  // Destinatario delle richieste (indicato dal titolare il 2/10/2026); LEAD_EMAIL_TO lo sostituisce.
  const emailTo = process.env.LEAD_EMAIL_TO || "solace.gestione@gmail.com";
  // Mittente: deve essere autorizzato da Resend. Senza un dominio verificato si usa l'indirizzo di prova
  // di Resend, che consegna solo all'email con cui è stato creato l'account Resend.
  const emailFrom = process.env.LEAD_EMAIL_FROM || "Sito Solace <onboarding@resend.dev>";
  // Indirizzo dell'API Resend: si cambia solo per i test con un servizio simulato.
  const resendUrl = process.env.RESEND_API_URL || "https://api.resend.com/emails";

  // Testo dell'email, uguale per Resend e per il webhook (es. Google Apps Script che invia da Gmail).
  const src = lead.source;
  const rows = [
    ["Nome", lead.name],
    ["Telefono", lead.phone],
    ["Email", lead.email],
    ["Comune o zona", lead.zone],
    ["Tipologia", lead.type],
    ["Numero di immobili", lead.count],
    ["Situazione attuale", lead.status],
    ["Messaggio", lead.message],
    ["Pagina d'ingresso", src.landingPage],
    ["Provenienza", src.referrer],
    ["utm_source", src.utmSource],
    ["utm_medium", src.utmMedium],
    ["utm_campaign", src.utmCampaign],
    ["utm_content", src.utmContent],
    ["utm_term", src.utmTerm],
    ["Ricevuta il", new Date(lead.receivedAt).toLocaleString("it-IT", { timeZone: "Europe/Rome" })],
  ].filter(([, v]) => v);
  const email = {
    to: emailTo,
    subject: "Solace — Nuova richiesta di analisi immobile",
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    // Rispondendo all'email si scrive direttamente al visitatore, se ha lasciato un'email valida.
    replyTo: lead.email || "",
  };

  // Attesa massima del webhook; LEAD_WEBHOOK_TIMEOUT_MS serve solo ai test (1–25 s).
  const webhookTimeout = Math.min(25_000, Math.max(1_000, Number(process.env.LEAD_WEBHOOK_TIMEOUT_MS) || 25_000));

  const deliveries: Promise<void>[] = [];

  if (webhook) {
    // I campi sono testo semplice: chi li riceve deve mostrarli come testo, non come HTML.
    // LEAD_WEBHOOK_SECRET (facoltativo) permette al ricevente di scartare le chiamate non del sito.
    deliveries.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          ...email,
          origin: "sito-solace",
          format: "text/plain",
          secret: process.env.LEAD_WEBHOOK_SECRET || undefined,
          // Identificativo dell'invio: il ricevente lo usa per non inviare due volte la stessa
          // richiesta (es. dopo un timeout, quando il visitatore riprova).
          requestId: input.requestId || undefined,
        }),
        cache: "no-store",
        redirect: "follow",
        // Google Apps Script risponde di norma in 1–5 s, ma al primo avvio può impiegare di più.
        signal: AbortSignal.timeout(webhookTimeout),
      }).then(async (res) => {
        if (!res.ok) throw new Error(`webhook_${res.status}`);
        // Una pagina HTML (errore, login) o una risposta JSON con ok:false non è una consegna riuscita.
        const type = res.headers.get("content-type") ?? "";
        if (type.includes("text/html")) throw new Error("webhook_html");
        if (type.includes("application/json")) {
          const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
          if (!data || data.ok === false) throw new Error("webhook_rifiutato");
        }
      }),
    );
  }

  if (resendKey) {
    deliveries.push(
      fetch(resendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
          // Resend non invia di nuovo un'email con la stessa chiave entro 24 ore.
          ...(input.requestId ? { "Idempotency-Key": `solace-${input.requestId}` } : {}),
        },
        // Solo testo: nessun campo "html", quindi nulla di quanto scritto nel modulo viene interpretato.
        body: JSON.stringify({
          from: emailFrom,
          to: emailTo.split(",").map((x) => x.trim()),
          reply_to: email.replyTo || undefined,
          subject: email.subject,
          text: email.text,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      }).then((res) => {
        if (!res.ok) throw new Error(`resend_${res.status}`);
      }),
    );
  }

  if (!deliveries.length) {
    console.error("[richiesta] Nessun canale di consegna configurato: richiesta non inoltrata.");
    if (dedupeKey) await store.del(dedupeKey);
    return fail("unavailable", 503);
  }

  const results = await Promise.allSettled(deliveries);
  for (const r of results) if (r.status === "rejected") console.error(`[richiesta] Consegna non riuscita (${reason(r.reason)}).`);

  if (!results.some((r) => r.status === "fulfilled")) {
    if (dedupeKey) await store.del(dedupeKey);
    // Timeout: l'email potrebbe essere già partita. Riprovare è sicuro, perché lo stesso requestId
    // non genera un secondo invio (script Google e Resend riconoscono le richieste già consegnate).
    const timedOut = results.some((r) => r.status === "rejected" && r.reason instanceof Error && r.reason.name === "TimeoutError");
    return fail(timedOut ? "retry" : "unavailable", 503);
  }
  if (dedupeKey) await store.set(dedupeKey, "done", DONE_TTL);
  return json({ ok: true });
}
