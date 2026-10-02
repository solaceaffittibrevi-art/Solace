import { NextResponse } from "next/server";
import { contactKind, validateLead, type LeadInput } from "@/lib/lead";
import type { LeadSource } from "@/lib/source";

// Riceve la richiesta di valutazione e la consegna a uno o entrambi i canali configurati:
//  - LEAD_WEBHOOK_URL: webhook (Make, Zapier, n8n, CRM)
//  - RESEND_API_KEY + LEAD_EMAIL_TO (+ LEAD_EMAIL_FROM): email tramite Resend
// La richiesta è "ricevuta" solo se almeno un canale conferma la consegna. Senza canali
// configurati risponde con un errore: il sito non mostra mai una conferma non vera.

// Protezione dai doppi invii (doppio clic, rete lenta): stesso requestId entro 10 minuti.
const recent = new Map<string, number>();
const DEDUPE_MS = 10 * 60 * 1000;

function seen(id: string) {
  const now = Date.now();
  for (const [key, at] of recent) if (now - at > DEDUPE_MS) recent.delete(key);
  if (recent.has(id)) return true;
  recent.set(id, now);
  return false;
}

const clean = (v: unknown, max = 300) => String(v ?? "").slice(0, max);

export async function POST(request: Request) {
  let body: LeadInput & { source?: LeadSource };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const input: LeadInput = {
    name: clean(body.name, 120),
    contact: clean(body.contact, 120),
    zone: clean(body.zone, 120),
    type: clean(body.type, 60),
    count: clean(body.count, 20),
    status: clean(body.status, 60),
    message: clean(body.message, 2000),
    website: clean(body.website, 200),
    requestId: clean(body.requestId, 80),
  };

  // Bot: risposta neutra, nessun inoltro.
  if (input.website) return NextResponse.json({ ok: true });

  const errors = validateLead(input);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "validation", errors }, { status: 422 });
  }

  if (input.requestId && seen(input.requestId)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const s = body.source ?? {};
  const kind = contactKind(input.contact);
  const lead = {
    name: input.name,
    email: kind === "email" ? input.contact.trim() : "",
    phone: kind === "phone" ? input.contact.trim() : "",
    zone: input.zone,
    type: input.type,
    count: input.count,
    status: input.status,
    message: input.message,
    source: {
      landingPage: clean(s.landingPage),
      referrer: clean(s.referrer),
      utmSource: clean(s.utmSource, 100),
      utmMedium: clean(s.utmMedium, 100),
      utmCampaign: clean(s.utmCampaign, 100),
      utmContent: clean(s.utmContent, 100),
      utmTerm: clean(s.utmTerm, 100),
    },
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.LEAD_EMAIL_TO;
  const emailFrom = process.env.LEAD_EMAIL_FROM || "Sito Solace <onboarding@resend.dev>";

  const deliveries: Promise<void>[] = [];

  if (webhook) {
    deliveries.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, origin: "sito-solace" }),
        signal: AbortSignal.timeout(10_000),
      }).then((res) => {
        if (!res.ok) throw new Error(`webhook ${res.status}`);
      }),
    );
  }

  if (resendKey && emailTo) {
    const rows = [
      ["Nome", lead.name],
      ["Telefono", lead.phone],
      ["Email", lead.email],
      ["Zona", lead.zone],
      ["Tipologia", lead.type],
      ["Numero di immobili", lead.count],
      ["Situazione attuale", lead.status],
      ["Messaggio", lead.message],
      ["Pagina d'ingresso", lead.source.landingPage],
      ["Provenienza", lead.source.referrer],
      ["Campagna (utm)", [lead.source.utmSource, lead.source.utmMedium, lead.source.utmCampaign].filter(Boolean).join(" / ")],
    ].filter(([, v]) => v);
    deliveries.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: emailFrom,
          to: emailTo.split(",").map((x) => x.trim()),
          reply_to: lead.email || undefined,
          subject: `Nuova richiesta di valutazione: ${lead.zone}`,
          text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
        }),
        signal: AbortSignal.timeout(10_000),
      }).then((res) => {
        if (!res.ok) throw new Error(`resend ${res.status}`);
      }),
    );
  }

  if (!deliveries.length) {
    console.error("[richiesta] Nessun canale di consegna configurato: richiesta non inoltrata.");
    if (input.requestId) recent.delete(input.requestId);
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const results = await Promise.allSettled(deliveries);
  const delivered = results.some((r) => r.status === "fulfilled");
  for (const r of results) if (r.status === "rejected") console.error("[richiesta] Consegna non riuscita:", r.reason);

  if (!delivered) {
    if (input.requestId) recent.delete(input.requestId);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
