#!/bin/sh
# Reinstalla le dipendenze solo quando package.json o il lockfile cambiano.
set -e

stamp=node_modules/.deps-hash
current=$(cat package.json pnpm-lock.yaml 2>/dev/null | sha256sum | cut -d' ' -f1)

if [ ! -f "$stamp" ] || [ "$(cat "$stamp")" != "$current" ]; then
  echo "▸ Dipendenze cambiate: pnpm install"
  pnpm install
  # ricalcola: pnpm install può aver creato/aggiornato il lockfile
  cat package.json pnpm-lock.yaml | sha256sum | cut -d' ' -f1 > "$stamp"
fi

exec "$@"
