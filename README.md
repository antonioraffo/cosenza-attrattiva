# Cosenza Attrattiva – Itinerari narrativi

Web app mobile-first per vivere gli itinerari di Cosenza come un racconto a capitoli:
mappa e narrazione si muovono insieme, la passeggiata si attiva quando arrivi nei luoghi.
Demo per il Comune di Cosenza / brand *Vivi Cosenza*.

> Stato: **Fase 2** – ambiente locale dockerizzato con HTTPS. Le sezioni successive
> del README (architettura, contenuti, demo script) si completano nelle fasi seguenti.

## Requisiti

- Docker Desktop (Compose v2)
- [mkcert](https://github.com/FiloSottile/mkcert) – `brew install mkcert nss`
- Porte libere sull'host per il proxy (vedi [Porte del proxy](#porte-del-proxy))

## Avvio rapido

```bash
make setup   # certificati mkcert, /etc/hosts (con conferma), stack, migrazioni, seed
make up      # avvio quotidiano
```

Apri **https://cosenzaattrattiva.test**: il lucchetto deve essere valido, senza avvisi.

| Comando | Cosa fa |
|---|---|
| `make setup` | Prima installazione completa (idempotente) |
| `make up` / `make down` | Avvia / ferma lo stack (i dati restano nei volumi) |
| `make logs` | Log in tempo reale (`make logs s=app` per un solo servizio) |
| `make seed` | Popola il DB con i contenuti di Cosenza (idempotente) |
| `make reset-db` | Cancella e ricrea il DB (migrazioni + seed) |
| `make migrate` | Applica le migrazioni Drizzle |
| `make sh` / `make psql` | Shell nel container app / console Postgres |
| `make typecheck` / `make lint` | Controlli statici |
| `make prod-local` | Build di produzione servita dallo stesso proxy (per Lighthouse) |
| `make dns` | DNS locale per testare da smartphone in LAN |
| `make help` | Elenco completo |

## Architettura locale

```
browser ──HTTPS──▶ proxy (Caddy, :80→:443, cert mkcert)
                     │  WebSocket HMR, X-Forwarded-*
                     ▼
                   app (Next.js dev, Turbopack, hot reload)
                     │
                     ▼
                   db (PostgreSQL 17 + PostGIS 3.5, volume persistente)
```

- **Caddy** (scelto al posto di Traefik): con un solo upstream e un certificato statico
  basta un Caddyfile di poche righe; redirect HTTP→HTTPS, WebSocket e header
  `X-Forwarded-*` sono gestiti di default. In produzione la stessa configurazione ottiene
  certificati ACME reali cambiando una riga.
- **app**: codice in bind mount, `node_modules` e `.next` in volumi Docker (dipendenze Linux
  native, I/O veloce su macOS). Le dipendenze si reinstallano da sole quando cambia il lockfile.
- **db**: immagine `imresamu/postgis` (build multi-arch di `postgis/postgis`, funziona anche su
  Apple Silicon). Esposto solo su `127.0.0.1:5433` per strumenti dall'host.
- `docker/app/Dockerfile` è il **Dockerfile multi-stage di produzione** (output standalone),
  separato da `Dockerfile.dev`.

### Variabili d'ambiente

Copia `.env.example` in `.env` (lo fa `make setup`). Le variabili non impostate usano i default
di `docker-compose.yml`. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` è opzionale: senza chiave l'app usa
solo la mappa open source. Nella console Google limita la chiave al referrer
`https://cosenzaattrattiva.test/*`.

### Porte del proxy

Le porte sono definite in cima al `Makefile` (`HTTP_PORT` / `HTTPS_PORT`). Attualmente sono
**8080/8443** perché 80/443 sono occupate da un altro stack locale, quindi l'app risponde su
**https://cosenzaattrattiva.test:8443**. Quando le porte standard si liberano:

```bash
make up HTTP_PORT=80 HTTPS_PORT=443     # una tantum, oppure cambia i default nel Makefile
```

`NEXT_PUBLIC_SITE_URL`, redirect HTTP→HTTPS e test e2e si adeguano automaticamente.

## Test da smartphone (LAN)

Geolocalizzazione, bussola e fotocamera funzionano solo in HTTPS, quindi il telefono deve
fidarsi della CA mkcert e risolvere il dominio.

1. **Risolvi il dominio** – `make dns` avvia un DNS (dnsmasq) che punta
   `cosenzaattrattiva.test` all'IP Wi-Fi del Mac; sul telefono imposta quell'IP come DNS
   manuale della rete Wi-Fi. In alternativa aggiungi la voce nel DNS del router.
2. **Installa la CA** – dal telefono apri `http://cosenzaattrattiva.test/dev/rootCA.pem`
   (servito in HTTP apposta) oppure invia `docker/certs/rootCA.pem` via AirDrop/email.
   - iOS: Impostazioni → Profilo scaricato → Installa; poi Generali → Info →
     Impostazioni attendibilità certificati → abilita *mkcert*.
   - Android: Impostazioni → Sicurezza → Crittografia e credenziali → Installa certificato →
     Certificato CA (Chrome accetta le CA utente).
3. Apri **https://cosenzaattrattiva.test** sul telefono.

### Demo da remoto (tunnel)

```bash
cloudflared tunnel --url https://cosenzaattrattiva.test --http-host-header cosenzaattrattiva.test \
  --origin-ca-pool docker/certs/rootCA.pem          # oppure: tailscale funnel
```

Il tunnel fornisce un dominio pubblico con certificato reale: imposta `NEXT_PUBLIC_SITE_URL` su
quell'URL, riavvia (`make up`) e aggiungi il referrer alla chiave Google.
