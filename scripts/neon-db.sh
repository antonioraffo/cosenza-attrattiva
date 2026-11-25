#!/bin/sh
# Migrazioni e seed sul database di produzione (Neon), dal container app.
# L'indirizzo viene da .env.neon (non versionato), letto come testo: contiene un "&" e non va eseguito
# con "source". Si usa la connessione diretta (senza "-pooler"); l'indirizzo non viene mai stampato.
# Uso: scripts/neon-db.sh          (migrazioni + seed)
#      scripts/neon-db.sh migrate  (solo migrazioni)
set -eu
cd "$(dirname "$0")/.."
step=${1:-all}
exec docker compose exec -T -e STEP="$step" app sh -c '
  DATABASE_URL="$(sed -n "s/^DATABASE_URL=//p" .env.neon | sed "s/-pooler//")"
  case "$DATABASE_URL" in *neon.tech*) echo "→ Neon" ;; *) echo "✖ URL Neon non trovato in .env.neon" >&2; exit 1 ;; esac
  export DATABASE_URL NODE_OPTIONS="--dns-result-order=ipv4first --network-family-autoselection-attempt-timeout=3000"
  npm run -s db:migrate
  [ "$STEP" = migrate ] || npm run -s db:seed
'
