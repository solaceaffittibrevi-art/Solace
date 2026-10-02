#!/bin/bash
# Inserisce la chiave API di Resend in .env.local senza mostrarla a schermo e senza salvarla
# nella cronologia del terminale. Uso: bash scripts/imposta-chiave-resend.sh
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env.local ] || { cp .env.example .env.local; chmod 600 .env.local; }

printf "Incolla la chiave API di Resend (non verrà mostrata) e premi Invio: "
IFS= read -rs KEY
echo
KEY="$(printf %s "$KEY" | tr -d '[:space:]')"
if [[ ! "$KEY" =~ ^re_[A-Za-z0-9_]{10,}$ ]]; then
  echo "La chiave non sembra di Resend (deve iniziare con re_). Nessuna modifica fatta."
  exit 1
fi

RESEND_KEY="$KEY" python3 - <<'PY'
import os, re
p = ".env.local"
s = open(p).read()
line = "RESEND_API_KEY=" + os.environ["RESEND_KEY"]
s = re.sub(r"(?m)^RESEND_API_KEY=.*$", lambda m: line, s) if re.search(r"(?m)^RESEND_API_KEY=", s) else s.rstrip("\n") + "\n" + line + "\n"
open(p, "w").write(s)
PY
chmod 600 .env.local
unset KEY
echo "Chiave salvata in .env.local (file escluso da Git)."
