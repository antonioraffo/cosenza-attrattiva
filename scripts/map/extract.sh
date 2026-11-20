#!/usr/bin/env bash
# Regenerate self-hosted offline map assets for MapLibre (see README.md).
# Idempotent: re-running overwrites the PMTiles extract and skips fonts/sprites already present
# (set FORCE=1 to re-download them too).
#
# Env overrides:
#   BUILD=YYYYMMDD     Protomaps daily build to use (default: latest from builds.json)
#   PMTILES_VERSION=x  go-pmtiles version (default: latest GitHub release)
#   BBOX, MAXZOOM      extract area / max zoom
#   FORCE=1            re-download fonts and sprites
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/public/map"
BBOX="${BBOX:-16.19,39.20,16.35,39.34}"
MAXZOOM="${MAXZOOM:-15}"
FONTS=("Noto Sans Regular" "Noto Sans Medium" "Noto Sans Italic")
RANGES=("0-255" "256-511" "512-767" "768-1023" "7936-8191" "8192-8447" "8448-8703" "8704-8959" "65280-65535")
ASSETS_RAW="https://raw.githubusercontent.com/protomaps/basemaps-assets/main"
FORCE="${FORCE:-0}"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT/fonts" "$OUT/sprites/v4"

# --- 1. pmtiles CLI ---------------------------------------------------------
if [[ -z "${PMTILES_VERSION:-}" ]]; then
  PMTILES_VERSION="$(curl -fsSL https://api.github.com/repos/protomaps/go-pmtiles/releases/latest \
    | sed -n 's/.*"tag_name": *"v\{0,1\}\([^"]*\)".*/\1/p' | head -1)"
fi
case "$(uname -s)_$(uname -m)" in
  Darwin_arm64)  PLAT="Darwin_arm64";  EXT=zip ;;
  Darwin_x86_64) PLAT="Darwin_x86_64"; EXT=zip ;;
  Linux_x86_64)  PLAT="Linux_x86_64";  EXT=tar.gz ;;
  Linux_aarch64|Linux_arm64) PLAT="Linux_arm64"; EXT=tar.gz ;;
  *) echo "Unsupported platform $(uname -s)_$(uname -m)" >&2; exit 1 ;;
esac
echo ">> go-pmtiles v$PMTILES_VERSION ($PLAT)"
curl -fsSL -o "$TMP/pmtiles.$EXT" \
  "https://github.com/protomaps/go-pmtiles/releases/download/v${PMTILES_VERSION}/go-pmtiles-${PMTILES_VERSION}_${PLAT}.${EXT}"
if [[ "$EXT" == zip ]]; then unzip -q -o "$TMP/pmtiles.zip" -d "$TMP"; else tar -xzf "$TMP/pmtiles.tar.gz" -C "$TMP"; fi
PMTILES="$TMP/pmtiles"; chmod +x "$PMTILES"

# --- 2. PMTiles extract -----------------------------------------------------
if [[ -z "${BUILD:-}" ]]; then
  BUILD="$(curl -fsSL https://build-metadata.protomaps.dev/builds.json \
    | grep -o '"key":"[0-9]\{8\}\.pmtiles"' | sed 's/.*"\([0-9]\{8\}\)\.pmtiles"/\1/' | sort | tail -1)"
fi
SRC="https://build.protomaps.com/${BUILD}.pmtiles"
echo ">> extracting $SRC bbox=$BBOX maxzoom=$MAXZOOM"
"$PMTILES" extract "$SRC" "$TMP/cosenza.pmtiles" --bbox="$BBOX" --maxzoom="$MAXZOOM"
mv -f "$TMP/cosenza.pmtiles" "$OUT/cosenza.pmtiles"
echo "$BUILD" > "$OUT/BUILD"
"$PMTILES" show "$OUT/cosenza.pmtiles"

# --- 3. Glyphs --------------------------------------------------------------
for font in "${FONTS[@]}"; do
  mkdir -p "$OUT/fonts/$font"
  enc="${font// /%20}"
  for r in "${RANGES[@]}"; do
    dest="$OUT/fonts/$font/$r.pbf"
    [[ -s "$dest" && "$FORCE" != 1 ]] && continue
    echo ">> font $font $r"
    curl -fsSL -o "$dest.tmp" "$ASSETS_RAW/fonts/$enc/$r.pbf" && mv -f "$dest.tmp" "$dest"
  done
done

# --- 4. Sprites (light flavor) ---------------------------------------------
for f in light.json light.png light@2x.json light@2x.png; do
  dest="$OUT/sprites/v4/$f"
  [[ -s "$dest" && "$FORCE" != 1 ]] && continue
  echo ">> sprite $f"
  curl -fsSL -o "$dest.tmp" "$ASSETS_RAW/sprites/v4/$f" && mv -f "$dest.tmp" "$dest"
done

echo ">> done"; du -sh "$OUT"/cosenza.pmtiles "$OUT"/fonts "$OUT"/sprites
