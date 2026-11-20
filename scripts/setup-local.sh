#!/usr/bin/env bash
# Bootstrap dell'ambiente locale di Cosenza Attrattiva.
#   1. verifica Docker e mkcert
#   2. genera i certificati TLS (se mancanti)
#   3. aggiunge cosenzaattrattiva.test a /etc/hosts (con conferma)
#   4. crea .env, avvia lo stack, esegue migrazioni e seed
#
# Uso: scripts/setup-local.sh [--yes]   (--yes = nessuna domanda interattiva)
set -euo pipefail

DOMAIN="cosenzaattrattiva.test"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CERT_DIR="$ROOT/docker/certs"
CERT="$CERT_DIR/$DOMAIN.pem"
KEY="$CERT_DIR/$DOMAIN-key.pem"
ASSUME_YES=false
[[ "${1:-}" == "--yes" ]] && ASSUME_YES=true

bold() { printf '\033[1m%s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✔\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
die()  { printf '  \033[31m✘\033[0m %s\n' "$*" >&2; exit 1; }
confirm() {
  $ASSUME_YES && return 0
  read -r -p "  $1 [s/N] " reply
  [[ "$reply" =~ ^[sSyY]$ ]]
}

cd "$ROOT"

bold "1/4 · Prerequisiti"
command -v docker >/dev/null || die "Docker non trovato: installa Docker Desktop (https://www.docker.com/products/docker-desktop/)"
docker compose version >/dev/null 2>&1 || die "Docker Compose v2 non disponibile"
docker info >/dev/null 2>&1 || die "Il daemon Docker non risponde: avvia Docker Desktop"
ok "Docker $(docker version --format '{{.Server.Version}}')"
command -v mkcert >/dev/null || die "mkcert non trovato: brew install mkcert nss  (Linux: vedi https://github.com/FiloSottile/mkcert)"
ok "mkcert $(mkcert -version 2>/dev/null || echo '')"

bold "2/4 · Certificati TLS"
CAROOT="$(mkcert -CAROOT)"
if [[ ! -f "$CAROOT/rootCA.pem" ]]; then
  warn "CA locale assente: mkcert -install (potrebbe chiedere la password)"
fi
# Idempotente: registra la CA nel trust store di sistema e dei browser
mkcert -install >/dev/null 2>&1 || mkcert -install
ok "CA locale fidata ($CAROOT)"

if [[ -f "$CERT" && -f "$KEY" ]]; then
  ok "Certificato già presente: docker/certs/$DOMAIN.pem"
else
  mkcert -cert-file "$CERT" -key-file "$KEY" \
    "$DOMAIN" "*.$DOMAIN" localhost 127.0.0.1 ::1 >/dev/null
  ok "Certificato generato per $DOMAIN e *.$DOMAIN"
fi
# Solo il certificato pubblico della CA (mai rootCA-key.pem): serve a smartphone e Playwright
cp "$CAROOT/rootCA.pem" "$CERT_DIR/rootCA.pem"
ok "CA pubblica copiata in docker/certs/rootCA.pem"

bold "3/4 · Risoluzione del dominio"
if grep -Eq "^[^#]*[[:space:]]$DOMAIN([[:space:]]|$)" /etc/hosts; then
  ok "/etc/hosts contiene già $DOMAIN"
elif confirm "Aggiungo '127.0.0.1 $DOMAIN' a /etc/hosts (richiede sudo)?"; then
  printf '\n127.0.0.1 %s\n::1 %s\n' "$DOMAIN" "$DOMAIN" | sudo tee -a /etc/hosts >/dev/null
  ok "Voce aggiunta a /etc/hosts"
else
  warn "Saltato: aggiungi manualmente '127.0.0.1 $DOMAIN' a /etc/hosts"
fi

bold "4/4 · Stack Docker"
if [[ ! -f .env ]]; then
  cp .env.example .env
  ok ".env creato da .env.example"
else
  ok ".env esistente mantenuto (i valori mancanti usano i default di docker-compose.yml)"
fi

docker compose up -d --build --wait
ok "Container avviati e in salute"

docker compose exec -T app pnpm run --if-present db:migrate
docker compose exec -T app pnpm run --if-present db:seed
ok "Migrazioni e seed eseguiti"

echo
bold "Pronto → ${NEXT_PUBLIC_SITE_URL:-https://$DOMAIN}"
