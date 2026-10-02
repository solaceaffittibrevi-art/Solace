// Verifica del limite alle richieste con il VERO Upstash (credenziali in .env.local, mai stampate).
// L'email NON parte: il webhook punta a un ricevitore finto locale. Richiede una build.
// Uso: npm run build && npm run test:upstash
import { spawn } from "node:child_process";
import http from "node:http";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "").replace(/\/+$/, "");
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
if (!url || !token) {
  console.log("Credenziali Upstash mancanti in .env.local: esegui prima bash scripts/imposta-upstash.sh");
  process.exit(1);
}

const PORT = 3311;
const HOOK = 3397;
let delivered = 0;
const hook = http.createServer((req, res) => {
  req.resume();
  req.on("end", () => {
    delivered++;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end('{"ok":true}');
  });
});
await new Promise((r) => hook.listen(HOOK, r));

const logs = [];
const child = spawn("node_modules/.bin/next", ["start", "-p", String(PORT)], {
  env: {
    ...process.env,
    VERCEL: "1", // come in produzione: senza archivio condiviso il modulo rifiuterebbe le richieste
    LEAD_WEBHOOK_URL: `http://127.0.0.1:${HOOK}/`,
    LEAD_WEBHOOK_SECRET: "solo-test",
    RESEND_API_KEY: "",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
child.stdout.on("data", (d) => logs.push(String(d)));
child.stderr.on("data", (d) => logs.push(String(d)));
for (let i = 0; i < 100; i++) {
  try {
    await fetch(`http://localhost:${PORT}/`);
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 200));
  }
}

const ip = `198.18.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`; // rete di test
const statuses = [];
for (let i = 0; i < 6; i++) {
  const res = await fetch(`http://localhost:${PORT}/api/richiesta`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: `http://localhost:${PORT}`, "X-Real-IP": ip },
    body: JSON.stringify({ name: "Test Upstash", contact: "test@example.invalid", zone: "Milano", message: "", requestId: crypto.randomUUID() }),
  });
  statuses.push(res.status);
}

// Chiavi effettivamente create su Upstash (solo conteggio, nessun valore)
const scan = await fetch(`${url}/pipeline`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify([["SCAN", "0", "MATCH", "rl:*", "COUNT", "1000"], ["SCAN", "0", "MATCH", "lead:*", "COUNT", "1000"]]),
}).then((r) => r.json());
const rlKeys = scan[0]?.result?.[1]?.length ?? 0;
const leadKeys = scan[1]?.result?.[1]?.length ?? 0;

const ok = statuses.slice(0, 5).every((s) => s === 200) && statuses[5] === 429;
const kvErrors = logs.join("").match(/\[kv\][^\n]*/g) ?? [];
console.log(`Risposte: ${statuses.join(", ")} → ${ok ? "OK: 5 accettate, la 6ª bloccata" : "NON corretto"}`);
console.log(`Invii al ricevitore finto: ${delivered} (attesi 5)`);
console.log(`Chiavi su Upstash: limite ${rlKeys}, doppi invii ${leadKeys}`);
console.log(kvErrors.length ? `Errori Upstash nei log: ${kvErrors.length}` : "Nessun errore Upstash nei log");

child.kill();
hook.close();
process.exit(ok && delivered === 5 && rlKeys > 0 && !kvErrors.length ? 0 : 1);
