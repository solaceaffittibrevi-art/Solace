import { NextResponse } from "next/server";
import { validateLead, type LeadInput } from "@/lib/lead";

// Riceve la richiesta di analisi e la inoltra al servizio configurato in LEAD_WEBHOOK_URL
// (per esempio un webhook di Make, Zapier, n8n o del CRM). Senza destinazione risponde con un errore:
// il sito non mostra mai una conferma se la richiesta non è stata consegnata davvero.
export async function POST(request: Request) {
  let body: LeadInput;
  try {
    body = (await request.json()) as LeadInput;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const input: LeadInput = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    zone: String(body.zone ?? ""),
    type: String(body.type ?? ""),
    count: String(body.count ?? ""),
    status: String(body.status ?? ""),
    message: String(body.message ?? ""),
    consent: body.consent === true,
    website: String(body.website ?? ""),
  };

  // Bot: risposta neutra, nessun inoltro.
  if (input.website) return NextResponse.json({ ok: true });

  const errors = validateLead(input);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "validation", errors }, { status: 422 });
  }

  const target = process.env.LEAD_WEBHOOK_URL;
  if (!target) {
    console.error("[richiesta] LEAD_WEBHOOK_URL non configurato: richiesta non inoltrata.");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const { website: _ignored, ...lead } = input;
  void _ignored;
  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, source: "sito-solace", receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook ${res.status}`);
  } catch (error) {
    console.error("[richiesta] Inoltro non riuscito:", error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
