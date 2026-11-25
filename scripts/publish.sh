#!/bin/sh
# Pubblica un commit del branch dev su due repository, con lo stesso flusso (dev, poi merge su main):
#   origin  git@github.com:antonioraffo/cosenza-attrattiva.git  progetto nella radice
#   altrama git@github.com:altrama/cosenza-attrativa.git         progetto nella cartella frontend/
#                                                               (Vercel pubblica main, Root Directory frontend)
# Lo lancia l'hook pre-push (scripts/git-hooks/pre-push) a ogni `git push` di dev verso origin;
# a mano: scripts/publish.sh [commit]   (predefinito: dev)
# I cloni di appoggio stanno in .git/publish-sync (fuori dal progetto, mai versionati).
set -eu

SHA=$(git rev-parse "${1:-dev}^{commit}")
SHORT=$(git rev-parse --short "$SHA")
ROOT=$(git rev-parse --show-toplevel)
SYNC="$(cd "$(git rev-parse --git-common-dir)" && pwd)/publish-sync"
ORIGIN_URL=$(git remote get-url origin)
ALTRAMA_URL=$(git remote get-url altrama)
SIGN="Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
export PUBLISH_RUNNING=1 # evita che i push di questo script rilancino l'hook

step() { printf '→ %s\n' "$*"; }

# clone di appoggio aggiornato: $1 = nome, $2 = url
sync_clone() {
  if [ ! -d "$SYNC/$1/.git" ]; then
    mkdir -p "$SYNC"
    git clone -q "$2" "$SYNC/$1"
  fi
  git -C "$SYNC/$1" fetch -q --prune origin
}

# main = merge di dev (avanti veloce se possibile); in caso di conflitto si ferma senza toccare main
merge_main() {
  dir="$SYNC/$1"
  if git -C "$dir" show-ref -q --verify refs/remotes/origin/main; then
    git -C "$dir" checkout -q -B main origin/main
    if ! git -C "$dir" merge -q --no-edit -m "Merge dev in main ($SHORT)" origin/dev; then
      git -C "$dir" merge --abort
      echo "✖ $1: conflitto nel merge di dev su main, risolvilo a mano" >&2
      exit 1
    fi
  else
    git -C "$dir" checkout -q -B main origin/dev
  fi
  git -C "$dir" push -q origin main
}

# 1. origin: dev = il commit, poi main
step "origin ($ORIGIN_URL): dev"
git push -q origin "$SHA:refs/heads/dev"
sync_clone origin "$ORIGIN_URL"
step "origin: merge di dev su main"
merge_main origin

# 2. altrama: le modifiche entrano in frontend/ su dev, poi main
sync_clone altrama "$ALTRAMA_URL"
step "altrama ($ALTRAMA_URL): frontend su dev"
dir="$SYNC/altrama"
git -C "$dir" checkout -q -B dev origin/dev
git -C "$dir" fetch -q "$ROOT" "$SHA"
if ! git -C "$dir" merge -q --no-edit -X subtree=frontend -m "Aggiorna frontend ($SHORT)

$SIGN" FETCH_HEAD; then
  git -C "$dir" merge --abort
  echo "✖ altrama: conflitto aggiornando frontend su dev, risolvilo a mano" >&2
  exit 1
fi
git -C "$dir" push -q origin dev
git -C "$dir" fetch -q origin
step "altrama: merge di dev su main"
merge_main altrama

step "pubblicato $SHORT su entrambi i repository (dev e main)"
