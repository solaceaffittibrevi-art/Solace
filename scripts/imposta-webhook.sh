#!/bin/bash
# Salva in .env.local l'indirizzo dell'app web Google Apps Script (LEAD_WEBHOOK_URL) senza mostrarlo.
# Uso: bash scripts/imposta-webhook.sh
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env.local ] || { cp .env.example .env.local; chmod 600 .env.local; }

printf "Incolla l'URL dell'app web (termina con /exec, non verrà mostrato) e premi Invio: "
IFS= read -rs URL
echo
URL="$(printf %s "$URL" | tr -d '[:space:]')"
if [[ ! "$URL" =~ ^https://script\.google\.com/macros/s/[A-Za-z0-9_-]+/exec$ ]]; then
  echo "L'indirizzo non sembra quello di un'app web Google Apps Script (…/macros/s/…/exec). Nessuna modifica fatta."
  exit 1
fi

HOOK="$URL" python3 - <<'PY'
import os, re
p = ".env.local"
s = open(p).read()
line = "LEAD_WEBHOOK_URL=" + os.environ["HOOK"]
s = re.sub(r"(?m)^LEAD_WEBHOOK_URL=.*$", lambda m: line, s) if re.search(r"(?m)^LEAD_WEBHOOK_URL=", s) else s.rstrip("\n") + "\n" + line + "\n"
open(p, "w").write(s)
PY
chmod 600 .env.local
unset URL
echo "Indirizzo salvato in .env.local (file escluso da Git)."
