// Test del modulo contatti con servizi SIMULATI: nessuna email reale, nessun servizio a pagamento.
// Avvia un finto Resend, un finto webhook e un finto Upstash Redis in locale, poi due istanze
// del sito che condividono lo stesso archivio (come su più istanze serverless) e una terza
// istanza "pubblicata" senza archivio. Richiede una build: `npm run build && npm run test:api`.
import { spawn } from "node:child_process";
import http from "node:http";

const PORT_A = 3301;
const PORT_B = 3302;
const PORT_C = 3303;
const MOCK = 3399;
const FAKE_KEY = "fake-test-key-not-real"; // valore finto, non è una credenziale

// ---- Servizi simulati -------------------------------------------------------------------
const emails = [];
const hooks = [];
const mode = { fail: false, delay: 0 };
const kv = new Map();
const kvGet = (k) => {
  const e = kv.get(k);
  if (e && e.exp && e.exp <= Date.now()) kv.delete(k);
  return kv.get(k)?.v ?? null;
};
function kvRun([cmd, key, ...args]) {
  switch (String(cmd).toUpperCase()) {
    case "SET": {
      const [value, ...opts] = args;
      const nx = opts.includes("NX");
      const exIdx = opts.indexOf("EX");
      if (nx && kvGet(key) !== null) return null;
      kv.set(key, { v: String(value), exp: exIdx >= 0 ? Date.now() + Number(opts[exIdx + 1]) * 1000 : 0 });
      return "OK";
    }
    case "INCR": {
      const cur = kvGet(key);
      const n = Number(cur ?? 0) + 1;
      const e = kv.get(key);
      kv.set(key, { v: String(n), exp: e?.exp ?? 0 });
      return n;
    }
    case "GET":
      return kvGet(key);
    case "DEL":
      return kv.delete(key) ? 1 : 0;
    default:
      throw new Error(`comando non simulato: ${cmd}`);
  }
}

const mock = http.createServer((req, res) => {
  let data = "";
  req.on("data", (c) => (data += c));
  req.on("end", async () => {
    const send = (status, body) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };
    if (req.url === "/redis/pipeline") {
      if (req.headers.authorization !== `Bearer ${FAKE_KEY}`) return send(401, { error: "unauthorized" });
      return send(200, JSON.parse(data).map((c) => ({ result: kvRun(c) })));
    }
    if (mode.delay) await new Promise((r) => setTimeout(r, mode.delay));
    if (mode.fail) return send(500, { error: "simulated" });
    if (req.url === "/resend/emails") {
      emails.push({ auth: req.headers.authorization, body: JSON.parse(data) });
      return send(200, { id: "simulated" });
    }
    if (req.url === "/webhook") {
      hooks.push(JSON.parse(data));
      return send(200, { ok: true });
    }
    send(404, {});
  });
});
await new Promise((r) => mock.listen(MOCK, r));

// ---- Istanze del sito -------------------------------------------------------------------
const logs = [];
const children = [];
function start(port, extraEnv) {
  const env = { ...process.env, PORT: String(port), NODE_ENV: "production", ...extraEnv };
  delete env.LEAD_WEBHOOK_URL;
  delete env.RESEND_API_KEY;
  delete env.UPSTASH_REDIS_REST_URL;
  delete env.UPSTASH_REDIS_REST_TOKEN;
  delete env.KV_REST_API_URL;
  delete env.KV_REST_API_TOKEN;
  Object.assign(env, extraEnv);
  const child = spawn("node_modules/.bin/next", ["start", "-p", String(port)], { env, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.on("data", (d) => logs.push(String(d)));
  child.stderr.on("data", (d) => logs.push(String(d)));
  children.push(child);
}
const shared = {
  UPSTASH_REDIS_REST_URL: `http://127.0.0.1:${MOCK}/redis`,
  UPSTASH_REDIS_REST_TOKEN: FAKE_KEY,
  RESEND_API_KEY: FAKE_KEY,
  RESEND_API_URL: `http://127.0.0.1:${MOCK}/resend/emails`,
  LEAD_EMAIL_TO: "test@example.invalid",
  LEAD_WEBHOOK_URL: `http://127.0.0.1:${MOCK}/webhook`,
};
start(PORT_A, shared);
start(PORT_B, shared);
start(PORT_C, { VERCEL: "1", RESEND_API_KEY: FAKE_KEY, RESEND_API_URL: shared.RESEND_API_URL, LEAD_EMAIL_TO: "test@example.invalid" });

async function waitUp(port) {
  for (let i = 0; i < 100; i++) {
    try {
      await fetch(`http://localhost:${port}/`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error(`server ${port} non avviato`);
}
await Promise.all([waitUp(PORT_A), waitUp(PORT_B), waitUp(PORT_C)]);

// ---- Test -------------------------------------------------------------------------------
let passed = 0;
let failed = 0;
function check(name, cond, detail = "") {
  if (cond) passed++;
  else failed++;
  console.log(`${cond ? "OK  " : "FAIL"} ${name}${!cond && detail ? ` → ${detail}` : ""}`);
}

let ipSeq = 10;
const PII = { name: "Mario Prova", email: "mario.prova@example.invalid", phone: "+39 333 000 1111" };
const lead = (over = {}) => ({
  name: PII.name,
  contact: PII.email,
  zone: "Milano, Navigli",
  type: "",
  count: "",
  status: "",
  message: "Ciao <script>alert('x')</script> <b>grassetto</b> <img src=x onerror=alert(1)>",
  website: "",
  requestId: crypto.randomUUID(),
  source: { landingPage: "/" },
  ...over,
});
async function post(port, body, { ip, headers = {}, raw } = {}) {
  const res = await fetch(`http://localhost:${port}/api/richiesta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: `http://localhost:${port}`,
      "Sec-Fetch-Site": "same-origin",
      "X-Real-IP": ip ?? `198.51.100.${ipSeq++}`,
      ...headers,
    },
    body: raw ?? JSON.stringify(body),
    duplex: "half",
  });
  const text = await res.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch {}
  return { status: res.status, data, text, headers: res.headers };
}

// Formato, provenienza, dimensione
let r = await post(PORT_A, null, { headers: { "Content-Type": "text/plain" }, raw: JSON.stringify(lead()) });
check("Formato diverso da JSON rifiutato (415)", r.status === 415, r.status);
r = await post(PORT_A, lead(), { headers: { Origin: "https://sito-esterno.example" } });
check("Origine esterna rifiutata (403)", r.status === 403, r.status);
r = await post(PORT_A, lead(), { headers: { "Sec-Fetch-Site": "cross-site" } });
check("Sec-Fetch-Site cross-site rifiutato (403)", r.status === 403, r.status);
{
  const res = await fetch(`http://localhost:${PORT_A}/api/richiesta`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Real-IP": "198.51.100.250" },
    body: JSON.stringify(lead()),
  });
  check("Richiesta senza Origin rifiutata (403)", res.status === 403, res.status);
}
r = await post(PORT_A, null, { raw: JSON.stringify(lead({ message: "x".repeat(20_000) })) });
check("Corpo oltre 16 KB rifiutato (413)", r.status === 413, r.status);
{
  // Corpo a blocchi senza Content-Length: il limite deve valere durante la lettura.
  const big = new ReadableStream({
    start(c) {
      for (let i = 0; i < 40; i++) c.enqueue(new TextEncoder().encode("a".repeat(1024)));
      c.close();
    },
  });
  r = await post(PORT_A, null, { raw: big });
  check("Corpo a blocchi oltre 16 KB rifiutato durante la lettura (413)", r.status === 413, r.status);
}
r = await post(PORT_A, null, { raw: "{non json" });
check("JSON non valido: errore generico (400)", r.status === 400 && r.data.error === "invalid", r.text);
r = await post(PORT_A, lead({ name: "", contact: "x" }));
check("Validazione lato server (422)", r.status === 422 && r.data.errors?.name, r.text);

// Campo trappola
const before = emails.length;
r = await post(PORT_A, lead({ website: "http://spam.example" }));
check("Campo trappola: risposta neutra, nessun inoltro", r.status === 200 && emails.length === before, r.status);

// Consegna e trattamento come testo
const ok = lead({ contact: PII.email });
r = await post(PORT_A, ok);
const mail = emails.at(-1)?.body;
const hook = hooks.at(-1);
check("Invio valido consegnato (200 ok)", r.status === 200 && r.data.ok === true, r.text);
check("Email simulata ricevuta con chiave nell'intestazione", emails.length === before + 1 && emails.at(-1).auth === `Bearer ${FAKE_KEY}`);
check("Email solo testo: nessun campo html", mail && !("html" in mail) && typeof mail.text === "string");
check("HTML del messaggio conservato come testo letterale", mail?.text.includes("<script>alert('x')</script>"));
check("Oggetto email richiesto", mail?.subject === "Solace — Nuova richiesta di analisi immobile", mail?.subject);
check("Reply-To impostato sull'email del visitatore", mail?.reply_to === PII.email, mail?.reply_to);
check("Email con tutti i campi compilati", ["Nome: " + PII.name, "Email: " + PII.email, "Comune o zona: Milano, Navigli", "Messaggio: ", "Pagina d'ingresso: /", "Ricevuta il: "].every((t) => mail?.text.includes(t)));
check("Webhook ricevuto con format text/plain", hook?.format === "text/plain" && hook?.message.includes("<img src=x"));
r = await post(PORT_A, lead({ zone: "Milano\r\nBcc: altro@example.invalid", requestId: crypto.randomUUID() }));
check("A capo rimossi dai campi su una riga", r.status === 200 && emails.at(-1).body.text.includes("Comune o zona: Milano Bcc: altro@example.invalid"), emails.at(-1)?.body.text.split("\n")[1]);
{
  const phoneLead = lead({ contact: PII.phone, requestId: crypto.randomUUID() });
  const pr = await post(PORT_A, phoneLead);
  const m = emails.at(-1)?.body;
  check("Con il solo telefono: nessun Reply-To, telefono nel testo", pr.status === 200 && !m?.reply_to && m?.text.includes("Telefono: " + PII.phone));
}

// Doppi invii tra istanze diverse
const sentBefore = emails.length;
r = await post(PORT_B, ok);
check("Doppio invio sull'altra istanza: confermato senza reinoltro", r.status === 200 && emails.length === sentBefore, `${r.status} ${emails.length - sentBefore}`);

// Errore di consegna e nuovo tentativo legittimo con lo stesso requestId
const retry = lead();
mode.fail = true;
r = await post(PORT_A, retry);
check("Consegna fallita: nessuna falsa conferma (503 generico)", r.status === 503 && r.data.error === "unavailable", r.text);
mode.fail = false;
r = await post(PORT_B, retry);
check("Nuovo tentativo dopo l'errore accettato e consegnato", r.status === 200 && r.data.ok === true, r.text);

// Invio contemporaneo dello stesso requestId su due istanze: uno solo viene inoltrato
mode.delay = 1500;
const twin = lead();
const sentTwin = emails.length;
const [t1, t2] = await Promise.all([post(PORT_A, twin), post(PORT_B, twin)]);
mode.delay = 0;
const statuses = [t1.status, t2.status].sort().join(",");
check("Invii simultanei: uno consegnato, l'altro 'in elaborazione' (409)", statuses === "200,409" && emails.length === sentTwin + 1, `${statuses} ${emails.length - sentTwin}`);

// Limite alle richieste condiviso tra istanze
const ip = "203.0.113.7";
const seq = [];
for (let i = 0; i < 6; i++) {
  const x = await post(i % 2 ? PORT_B : PORT_A, lead(), { ip });
  seq.push(x.status);
  if (i === 5) r = x;
}
check("Limite per IP condiviso tra due istanze: 5 accettate, la 6ª bloccata (429)", seq.slice(0, 5).every((s) => s === 200) && seq[5] === 429, seq.join(","));
check("429 con Retry-After e codice generico", r.headers.get("retry-after") && r.data.error === "rate_limited", r.text);

// Sito pubblicato senza archivio condiviso: non accetta richieste senza limite affidabile
const sentC = emails.length;
r = await post(PORT_C, lead());
check("Pubblicato senza Upstash: richiesta non accettata (503), nessun inoltro", r.status === 503 && emails.length === sentC, r.status);

// Risposte e intestazioni
const page = await fetch(`http://localhost:${PORT_A}/`);
const h = page.headers;
check("X-Powered-By assente", !h.get("x-powered-by"));
for (const k of ["content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy", "strict-transport-security"]) {
  check(`Intestazione ${k} presente`, Boolean(h.get(k)));
}
const api = await post(PORT_A, lead({ name: "" }));
check("API con Cache-Control no-store", api.headers.get("cache-control")?.includes("no-store"));
const get = await fetch(`http://localhost:${PORT_A}/api/richiesta`);
check("GET sull'API non consentito (405)", get.status === 405, get.status);

// Log: nessun dato del contatto, IP o credenziale
await new Promise((r) => setTimeout(r, 300));
const allLogs = logs.join("");
const leaks = [PII.name, PII.email, "203.0.113.7", "198.51.100.", FAKE_KEY, "127.0.0.1:" + MOCK].filter((s) => allLogs.includes(s));
check("Log senza nome, email, IP, chiavi o indirizzi dei servizi", leaks.length === 0, leaks.join(", "));
check("Nessun messaggio d'errore pubblico che riveli la configurazione", !JSON.stringify([r.data, api.data]).includes("configured"));

console.log(`\n${passed} superati, ${failed} falliti. Email simulate ricevute: ${emails.length}.`);
console.log("--- Log del server (estratto) ---\n" + allLogs.split("\n").filter((l) => /\[(richiesta|kv)\]/.test(l)).slice(0, 12).join("\n"));

for (const c of children) c.kill();
mock.close();
process.exit(failed ? 1 : 0);
