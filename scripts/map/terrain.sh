#!/usr/bin/env bash
# Scarica i dati di elevazione (Terrain Tiles, formato Terrarium, dataset pubblico AWS "elevation-tiles-prod",
# fonti SRTM/GMTED/ETOPO, nessuna chiave) per l'area dell'estratto di Cosenza, zoom 8–13, in public/map/terrain/.
# Usati dal volo 3D MapLibre (rilievo e ombreggiatura): così il volo non chiama servizi esterni.
set -euo pipefail
OUT=public/map/terrain
W=16.17 S=39.19 E=16.37 N=39.35
python3 - "$W" "$S" "$E" "$N" <<'PY' | while read -r z x y; do
import math, sys
w, s, e, n = map(float, sys.argv[1:])
def tile(lon, lat, z):
    k = 2 ** z
    x = int((lon + 180) / 360 * k)
    y = int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * k)
    return x, y
for z in range(8, 14):
    x0, y0 = tile(w, n, z); x1, y1 = tile(e, s, z)
    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            print(z, x, y)
PY
  mkdir -p "$OUT/$z/$x"
  [ -s "$OUT/$z/$x/$y.png" ] || curl -sf -o "$OUT/$z/$x/$y.png" "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/$z/$x/$y.png"
done
find "$OUT" -name '*.png' | wc -l | xargs echo "tile:"; du -sh "$OUT"
