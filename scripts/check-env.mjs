// Mostra quali variabili del modulo contatti sono configurate, SENZA stamparne i valori.
// Uso: npm run check:env
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
const e = process.env;
const set = (k) => Boolean(e[k] && e[k].trim());
const rows = [
  ["RESEND_API_KEY", set("RESEND_API_KEY") ? (/^re_[A-Za-z0-9_]{10,}$/.test(e.RESEND_API_KEY) ? "presente, formato valido" : "presente, formato NON valido") : "non usata"],
  ["LEAD_EMAIL_TO", set("LEAD_EMAIL_TO") ? e.LEAD_EMAIL_TO : "non impostata (predefinito solace.gestione@gmail.com)"],
  ["LEAD_EMAIL_FROM", set("LEAD_EMAIL_FROM") ? "personalizzato" : "predefinito onboarding@resend.dev"],
  ["LEAD_WEBHOOK_URL", set("LEAD_WEBHOOK_URL") ? (/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(e.LEAD_WEBHOOK_URL) ? "presente (Google Apps Script)" : "presente") : "mancante"],
  ["LEAD_WEBHOOK_SECRET", set("LEAD_WEBHOOK_SECRET") ? `presente (${e.LEAD_WEBHOOK_SECRET.length} caratteri)` : "mancante"],
  ["Upstash (archivio condiviso)", set("UPSTASH_REDIS_REST_URL") || set("KV_REST_API_URL") ? "presente" : "mancante (obbligatorio solo online)"],
  ["RESEND_API_URL", set("RESEND_API_URL") ? "ATTENZIONE: impostato, solo per test" : "non impostato (corretto)"],
];
for (const [k, v] of rows) console.log(`${k.padEnd(30)} ${v}`);
