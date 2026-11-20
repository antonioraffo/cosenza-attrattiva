#!/usr/bin/env bash
# Lighthouse (mobile) sulle pagine principali. Da eseguire nel container e2e
# contro la build di produzione (make prod-local): make lighthouse
set -euo pipefail
export CHROME_PATH="$(ls -d /ms-playwright/chromium-*/chrome-linux*/chrome | head -1)"
mkdir -p docs/lighthouse
for path in /it /it/itinerari/il-re-nel-fiume /it/luoghi/castello-svevo; do
  name=$(echo "$path" | tr '/' '_' | sed 's/^_//')
  npx -y lighthouse@12 "$BASE_URL$path" --quiet --form-factor=mobile --screenEmulation.mobile \
    --only-categories=performance,accessibility,best-practices,seo \
    --chrome-flags="--headless=new --no-sandbox --ignore-certificate-errors" \
    --output=json --output=html --output-path="docs/lighthouse/$name" >/dev/null
  node -e "const r=require('./docs/lighthouse/$name.report.json');console.log('$path', Object.values(r.categories).map(c=>c.id+'='+Math.round(c.score*100)).join(' '))"
done
