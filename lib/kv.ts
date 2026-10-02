// Archivio condiviso tra tutte le istanze del server, usato per il limite alle richieste e per i
// doppi invii. È Upstash Redis tramite la sua API REST, quindi non serve nessuna dipendenza.
// Variabili: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, oppure KV_REST_API_URL +
// KV_REST_API_TOKEN (i nomi creati dall'integrazione Upstash nel marketplace di Vercel).
// Va usato solo lato server: le variabili non hanno il prefisso NEXT_PUBLIC_ e non arrivano al browser.

type Command = (string | number)[];

export type Store = {
  kind: "redis" | "memory";
  // Incrementa più contatori; ognuno nasce a 0 con la sua scadenza in secondi.
  incr(entries: { key: string; ttl: number }[]): Promise<number[]>;
  // Prenota una chiave se libera. Restituisce null se prenotata ora, altrimenti il valore già presente.
  claim(key: string, value: string, ttl: number): Promise<string | null>;
  set(key: string, value: string, ttl: number): Promise<void>;
  del(key: string): Promise<void>;
};

const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "").replace(/\/+$/, "");
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

export const sharedStoreConfigured = Boolean(url && token);

// Sul sito pubblicato (Vercel o produzione) l'archivio condiviso è obbligatorio: in memoria ogni
// istanza avrebbe contatori propri e il limite non sarebbe affidabile.
export const sharedStoreRequired =
  Boolean(process.env.VERCEL) || process.env.NEXT_PUBLIC_SITE_ENV === "production";

async function pipeline(commands: Command[]): Promise<unknown[]> {
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
    signal: AbortSignal.timeout(3_000),
  });
  if (!res.ok) throw new Error(`kv_http_${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string }[];
  if (!Array.isArray(data) || data.length !== commands.length) throw new Error("kv_bad_response");
  return data.map((d) => {
    if (d.error) throw new Error("kv_command_error");
    return d.result;
  });
}

const redis: Store = {
  kind: "redis",
  async incr(entries) {
    const out = await pipeline(entries.flatMap(({ key, ttl }) => [["SET", key, 0, "EX", ttl, "NX"], ["INCR", key]]));
    return entries.map((_, i) => Number(out[i * 2 + 1]));
  },
  async claim(key, value, ttl) {
    const [set, current] = await pipeline([["SET", key, value, "EX", ttl, "NX"], ["GET", key]]);
    return set === "OK" ? null : String(current ?? "");
  },
  async set(key, value, ttl) {
    await pipeline([["SET", key, value, "EX", ttl]]);
  },
  async del(key) {
    await pipeline([["DEL", key]]);
  },
};

// Solo per lo sviluppo locale, o come ripiego temporaneo se Upstash non risponde.
const mem = new Map<string, { value: string; expires: number }>();
const live = (key: string) => {
  const e = mem.get(key);
  if (e && e.expires <= Date.now()) {
    mem.delete(key);
    return undefined;
  }
  return e;
};
const memory: Store = {
  kind: "memory",
  async incr(entries) {
    if (mem.size > 5_000) for (const k of mem.keys()) live(k);
    return entries.map(({ key, ttl }) => {
      const e = live(key) ?? { value: "0", expires: Date.now() + ttl * 1000 };
      e.value = String(Number(e.value) + 1);
      mem.set(key, e);
      return Number(e.value);
    });
  },
  async claim(key, value, ttl) {
    const e = live(key);
    if (e) return e.value;
    mem.set(key, { value, expires: Date.now() + ttl * 1000 });
    return null;
  },
  async set(key, value, ttl) {
    mem.set(key, { value, expires: Date.now() + ttl * 1000 });
  },
  async del(key) {
    mem.delete(key);
  },
};

// Ultimo guasto di Upstash: per i 5 minuti successivi il sito applica limiti più severi.
let lastFailure = 0;
export const isDegraded = () => Date.now() - lastFailure < 5 * 60 * 1000;

// Con Upstash configurato usa Redis; se una chiamata fallisce ripiega sulla memoria per quella
// operazione (protezione per singola istanza, con limiti dimezzati: vedi isDegraded) e lo
// segnala nei log senza dati personali.
function withFallback(primary: Store): Store {
  const run = async <T>(op: keyof Omit<Store, "kind">, call: (s: Store) => Promise<T>) => {
    try {
      return await call(primary);
    } catch (err) {
      lastFailure = Date.now();
      console.error(`[kv] ${op} non riuscito (${err instanceof Error ? err.message : "errore"}): uso la memoria locale.`);
      return call(memory);
    }
  };
  return {
    kind: primary.kind,
    incr: (entries) => run("incr", (s) => s.incr(entries)),
    claim: (key, value, ttl) => run("claim", (s) => s.claim(key, value, ttl)),
    set: (key, value, ttl) => run("set", (s) => s.set(key, value, ttl)),
    del: (key) => run("del", (s) => s.del(key)),
  };
}

// null: archivio condiviso obbligatorio ma non configurato.
export function getStore(): Store | null {
  if (sharedStoreConfigured) return withFallback(redis);
  return sharedStoreRequired ? null : memory;
}
