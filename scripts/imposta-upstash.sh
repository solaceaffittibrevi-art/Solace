#!/bin/bash
# Salva in .env.local l'indirizzo REST e il token di Upstash Redis senza mostrarli.
# Dove trovarli: console.upstash.com → database → sezione "REST API" (UPSTASH_REDIS_REST_URL e _TOKEN).
# Uso: bash scripts/imposta-upstash.sh
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env.local ] || { cp .env.example .env.local; chmod 600 .env.local; }

printf "Incolla UPSTASH_REDIS_REST_URL (https://…upstash.io, non verrà mostrato) e premi Invio: "
IFS= read -rs URL || true
echo
printf "Incolla UPSTASH_REDIS_REST_TOKEN (non verrà mostrato) e premi Invio: "
IFS= read -rs TOKEN || true
echo
URL="$(printf %s "$URL" | tr -d '[:space:]')"
TOKEN="$(printf %s "$TOKEN" | tr -d '[:space:]')"
if [[ ! "$URL" =~ ^https://[A-Za-z0-9.-]+\.upstash\.io/?$ ]]; then echo "L'indirizzo non sembra di Upstash. Nessuna modifica fatta."; exit 1; fi
if [[ ${#TOKEN} -lt 20 ]]; then echo "Il token sembra incompleto. Nessuna modifica fatta."; exit 1; fi

U="$URL" T="$TOKEN" python3 - <<'PY'
import os, re
p = ".env.local"; s = open(p).read()
for k, v in (("UPSTASH_REDIS_REST_URL", os.environ["U"]), ("UPSTASH_REDIS_REST_TOKEN", os.environ["T"])):
    line = k + "=" + v
    s = re.sub(rf"(?m)^{k}=.*$", lambda m: line, s) if re.search(rf"(?m)^{k}=", s) else s.rstrip("\n") + "\n" + line + "\n"
open(p, "w").write(s)
PY
chmod 600 .env.local
unset URL TOKEN
echo "Credenziali Upstash salvate in .env.local (file escluso da Git)."
