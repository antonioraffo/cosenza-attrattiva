# Architettura

## Panoramica

```
                ┌──────────────── browser / smartphone ────────────────┐
                │  Next.js (React 19)                                   │
                │  ├─ RSC: home, itinerario, luogo, passaporto          │
                │  ├─ client: mappa MapLibre (PMTiles locali)            │
                │  │          racconto, passeggiata, AR, audio/TTS       │
                │  ├─ store locali: posizione (mai inviata), passaporto, │
                │  │               consenso (localStorage)               │
                │  └─ service worker Serwist: precache + offline-v1      │
                └──────────────────────────┬────────────────────────────┘
                                           │ HTTPS (mkcert in locale)
                                    ┌──────▼──────┐
                                    │    Caddy     │  TLS, HTTP→HTTPS, WS/HMR, X-Forwarded-*
                                    └──────┬──────┘
                                    ┌──────▼──────┐
                                    │  Next.js     │  Route Handlers + Zod, Drizzle
                                    └──────┬──────┘
                                    ┌──────▼──────┐
                                    │ PostGIS 17   │  POINT / LINESTRING / POLYGON, ST_DWithin
                                    └─────────────┘
```

## Scelte principali

| Ambito | Scelta | Perché |
|---|---|---|
| Proxy TLS | **Caddy** | Un solo upstream e un certificato statico: Caddyfile minimo; WebSocket e `X-Forwarded-*` senza configurazione; in produzione ACME con una riga. |
| ORM | **Drizzle** | SQL-first, tipi TS precisi, migrazioni versionate; `customType` per Point/LineString/Polygon con parsing EWKB (`src/lib/geo/wkb.ts`). |
| Mappa | **MapLibre + PMTiles Protomaps** self-hosted | Nessun servizio di tile esterno, funziona offline (range request servite dal service worker), stile "pietra" coerente col brand. |
| i18n | **next-intl** con prefisso `/it`, `/en` | URL condivisibili per lingua, `hreflang`, messaggi ICU (plurali). Contenuti in `jsonb {it, en}` → nuova lingua senza migrazioni. |
| Animazioni | **motion** (ex Framer Motion) + IntersectionObserver | Scrollytelling leggero; `prefers-reduced-motion` → `jumpTo` e niente transizioni. |
| Home | Server Components + moduli DOM in `components/home/effects` | Gli effetti di vivi-cosenza sono portati 1:1 come script che seguono lo scroll (rAF, variabili CSS, `position: sticky`); il markup resta reso dal server e i testi della "macchina da scrivere" si spezzano dopo l'idratazione, per tenere leggero il payload. |
| PWA | **Serwist** (`@serwist/turbopack`) | Mantenuto, compatibile con Turbopack; SW compilato con esbuild e servito da `/serwist/sw.js`. |
| Audio | file audio → altrimenti **Web Speech API** | Lettura frase per frase: pausa/ripresa affidabili, nessun taglio dopo 15 s (bug Chrome). |

## Modello dati

- `places` — luogo: nome/testi `jsonb` IT/EN, `geom geometry(Point,4326)` (indice GIST), raggio geofence,
  orari, accessibilità, foto storica, config Street View (`pano`, heading, hotspot) e AR (timeline).
- `itineraries` — `route geometry(LineString,4326)` (percorso pedonale reale da OSRM, salvato nel seed),
  durata e lunghezza calcolate dal percorso, tema, difficoltà, colore, copertina.
- `chapters` — capitolo ordinato, legato a un luogo o a un punto libero (transizione), camera per il `flyTo`,
  `route_fraction` (0–1): separa il tratto "fatto" da quello "rimanente".
- `neighborhoods` — `geom geometry(Polygon,4326)`.
- `media`, `place_media` — immagini con credito, licenza, alt IT/EN.

Il seed (`src/server/db/seed.ts`) legge `content/seed/**`, valida i riferimenti, fa upsert per slug,
calcola lunghezze e frazioni e genera `TODO-coordinate.md` con le coordinate da verificare.

## Privacy by design

- La posizione è letta **solo** dopo un'azione esplicita ("Attiva la posizione"), vive in uno store in memoria
  (`src/lib/stores/position.ts`) e non viene mai inviata al server: geofencing, distanze, bussola e check-in
  sono calcolati nel browser. L'unica query di prossimità lato server (`ST_DWithin`) è tra luoghi.
- Passaporto e consenso stanno in `localStorage`; nessun login, nessun tracker.
- Street View e 3D Tiles (Google) si caricano solo dopo il consenso esplicito (banner + `ConsentGate`).

## Feature flag (fase 2)

| Variabile | Effetto | Requisiti |
|---|---|---|
| `NEXT_PUBLIC_FEATURE_STREETVIEW` | Street View con hotspot sui luoghi che hanno `streetview` | chiave Google (Maps JavaScript API) + consenso |
| `NEXT_PUBLIC_FEATURE_3D` | "Volo 3D" stile Earth Voyager nel racconto | motore scelto da `NEXT_PUBLIC_FLY3D_PROVIDER` |
| `NEXT_PUBLIC_FLY3D_PROVIDER` | `maplibre` (predefinito): rilievo da Terrain Tiles locali (`public/map/terrain`, `scripts/map/terrain.sh`), edifici OSM estrusi, camera a drone · `google`: Photorealistic 3D Tiles con CesiumJS da CDN | `maplibre`: nessuno · `google`: chiave (Map Tiles API), consenso, account di fatturazione non SEE |
| `NEXT_PUBLIC_FEATURE_AR` | AR geolocalizzata (fotocamera + bussola + GPS) sui luoghi con `ar` | HTTPS; su iOS permesso sensori su gesto |
| `NEXT_PUBLIC_FEATURE_ASSISTANT` | "Chiedi a Cosenza": `POST /api/ask` | stub full-text Postgres; interfaccia `AnswerProvider` pronta per LLM + RAG |
| `NEXT_PUBLIC_DEMO_TOOLS` | Simulatore di posizione nella passeggiata e nell'AR | — |

I moduli pesanti sono in `src/features/*` e caricati con `next/dynamic` solo all'apertura.

**AR**: approccio location-based (stile LocAR.js) con `getUserMedia` + `DeviceOrientation` + GPS, che funziona
su iOS e Android. WebXR `immersive-ar` non è usato nell'MVP: su Safari iOS non è disponibile e per etichette
geolocalizzate non aggiunge precisione rispetto alla bussola. Resta l'evoluzione naturale per ricostruzioni 3D ancorate.

## Struttura

```
src/
├── app/[locale]/          pagine (home, itinerari/[slug]/{,racconto,passeggiata}, luoghi/[slug], passaporto, chiedi, crediti)
├── app/api/               health, places, itineraries/[slug]/bundle, ask
├── app/sw.ts              service worker
├── components/            ui, layout, home, itinerary, story, walk, place, passport, audio, map
│   └── home/effects/      effetti allo scroll della home (porting di vivi-cosenza: silhouette, pannelli, foglio, typewriter)
├── content/               eventi della home (dati dimostrativi)
├── fonts/                 Plus Jakarta Sans e Manrope (OFL, self-hosted)
├── features/              streetview, fly3d, ar, ImmersiveLauncher (lazy)
├── lib/                   geo (+ geofence, wkb), stores, orientation, offline, env, text
├── server/                db (schema, client, seed, migrate, content), queries, assistant
└── messages/              it.json, en.json
content/seed/              luoghi, itinerari, media, quartieri, percorsi OSRM
```
