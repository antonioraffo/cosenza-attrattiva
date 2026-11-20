# Offline map assets (MapLibre GL JS + Protomaps)

The map is fully self-hosted from `public/map/`, so no third-party tile, font or sprite server is used at runtime.

```
public/map/
├── cosenza.pmtiles              # vector tiles (Protomaps basemap v4 schema), z0–z15
├── BUILD                        # Protomaps daily build used (YYYYMMDD)
├── fonts/<Font Name>/<range>.pbf  # glyphs: "Noto Sans Regular", "Noto Sans Medium", "Noto Sans Italic"
└── sprites/v4/light{,@2x}.{json,png}
```

## Regenerate

```sh
bash scripts/map/extract.sh                 # latest build, default bbox
BUILD=20261118 bash scripts/map/extract.sh  # pin a specific daily build
FORCE=1 bash scripts/map/extract.sh         # also re-download fonts/sprites
```

The script is idempotent. It downloads the `go-pmtiles` CLI into a temp directory (removed on exit), so nothing is installed system-wide. It needs `curl`, `unzip`/`tar` and an internet connection.

### What the script does

1. **pmtiles CLI.** It takes the latest release from <https://github.com/protomaps/go-pmtiles/releases> (asset `go-pmtiles-<ver>_Darwin_arm64.zip` on Apple Silicon). The latest release was v1.31.2 at the time of writing.
2. **Latest daily planet build.** It reads the build list from `https://build-metadata.protomaps.dev/builds.json` and uses the newest `key`. Builds are served at `https://build.protomaps.com/YYYYMMDD.pmtiles`.
3. **Extract.** Only the needed tiles are fetched, using HTTP range requests:
   ```sh
   pmtiles extract https://build.protomaps.com/YYYYMMDD.pmtiles public/map/cosenza.pmtiles \
     --bbox=16.19,39.20,16.35,39.34 --maxzoom=15
   pmtiles show public/map/cosenza.pmtiles
   ```
   The bbox covers Cosenza city and the Donnici hills to the south. The output is about 3 MB.
4. **Glyphs.** It downloads them from <https://github.com/protomaps/basemaps-assets>, at
   `https://raw.githubusercontent.com/protomaps/basemaps-assets/main/fonts/<Font%20Name>/<range>.pbf`.
   - Fonts: these are the ones used by `@protomaps/basemaps` v5 (`light` flavor): `Noto Sans Regular`, `Noto Sans Medium` and `Noto Sans Italic`.
   - Ranges: `0-255`, `256-511`, `512-767`, `768-1023`, `7936-8191`, `8192-8447`, `8448-8703`, `8704-8959` and `65280-65535`. These cover Latin, Latin Extended, Greek, punctuation and symbols.
   - On disk, folder names keep their spaces (no URL-encoding).
   - If you need another script (for example Cyrillic `1024-1279`), add its range to `RANGES` in the script.
5. **Sprites.** It downloads `https://raw.githubusercontent.com/protomaps/basemaps-assets/main/sprites/v4/light{.json,.png,@2x.json,@2x.png}`.

### Using them in MapLibre

```js
import { Protocol } from "pmtiles";
import { layers, namedFlavor } from "@protomaps/basemaps";
maplibregl.addProtocol("pmtiles", new Protocol().tile);
const style = {
  version: 8,
  glyphs: `${location.origin}/map/fonts/{fontstack}/{range}.pbf`,
  sprite: `${location.origin}/map/sprites/v4/light`,
  sources: { protomaps: { type: "vector", url: `pmtiles://${location.origin}/map/cosenza.pmtiles`,
    attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>' } },
  layers: layers("protomaps", namedFlavor("light"), { lang: "it" }),
};
```

`glyphs` and `sprite` must be absolute URLs. The static server must support HTTP `Range` requests for `.pmtiles`; Next.js `public/` does.

## Licenses and required attribution

- **Map data:** © OpenStreetMap contributors. It is available under the **Open Database License (ODbL) 1.0** (<https://www.openstreetmap.org/copyright>, <https://opendatacommons.org/licenses/odbl/>).
  - The map must visibly show "© OpenStreetMap contributors", linked to the copyright page.
  - `cosenza.pmtiles` is a Produced Work / derivative database of OSM. If you redistribute the database itself, it must remain under ODbL.
  - The extract also contains Natural Earth data, which is public domain, at low zooms.
- **Tiles / basemap:** the Protomaps Basemap (<https://protomaps.com>, <https://github.com/protomaps/basemaps>). Credit "Protomaps" in the attribution. The basemap code and styles are BSD-3-Clause.
- **Fonts:** Noto Sans, under the SIL Open Font License 1.1.
- **Sprites/icons:** from protomaps/basemaps-assets. See that repository for its license terms.
- **go-pmtiles:** BSD-3-Clause. It is used only as a build tool and is not shipped.

The recommended attribution string is:
`<a href="https://protomaps.com">Protomaps</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>`
