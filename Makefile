SHELL := /bin/bash
COMPOSE := docker compose
DOMAIN := cosenzaattrattiva.test

# ── Porte del proxy ──────────────────────────────────────────────────────
# 80/443 sono occupate da un altro stack locale: usiamo 8080/8443.
# Quando si liberano basta impostare qui 80 e 443 (oppure, una tantum:
# `make up HTTP_PORT=80 HTTPS_PORT=443`). L'URL del sito si adegua da solo.
# Una copia di lavoro può sovrascrivere porte e altre variabili in .make.local (non versionato).
-include .make.local
HTTP_PORT ?= 8080
HTTPS_PORT ?= 8443
SITE_URL := https://$(DOMAIN)$(if $(filter 443,$(HTTPS_PORT)),,:$(HTTPS_PORT))
export HTTP_PORT HTTPS_PORT
export NEXT_PUBLIC_SITE_URL := $(SITE_URL)

.DEFAULT_GOAL := help
.PHONY: help setup up down restart logs ps sh psql migrate seed routes reset-db typecheck lint test e2e e2e-prod screenshots reference compare lighthouse prod-local dns

help: ## Elenca i comandi disponibili
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

setup: ## Prima installazione: certificati, /etc/hosts, stack, migrazioni, seed
	@./scripts/setup-local.sh

up: ## Avvia lo stack (db, app, proxy) e attende che sia in salute
	$(COMPOSE) up -d --build --wait
	@echo "→ $(SITE_URL)"

down: ## Ferma lo stack (i dati restano nei volumi)
	$(COMPOSE) --profile prod --profile dns down

restart: ## Riavvia l'app Next.js
	$(COMPOSE) restart app

logs: ## Log in tempo reale (s=servizio, es. make logs s=app)
	$(COMPOSE) logs -f --tail=100 $(s)

ps: ## Stato dei container
	$(COMPOSE) ps

sh: ## Shell nel container app
	$(COMPOSE) exec app sh

psql: ## Console psql sul database
	$(COMPOSE) exec db sh -c 'psql -U $$POSTGRES_USER -d $$POSTGRES_DB'

migrate: ## Applica le migrazioni Drizzle
	$(COMPOSE) exec -T app pnpm run --if-present db:migrate

seed: ## Popola il database con i contenuti di Cosenza (idempotente)
	$(COMPOSE) exec -T app pnpm run --if-present db:seed

routes: ## Ricalcola i percorsi pedonali (OSRM) in content/seed/routes
	$(COMPOSE) exec -T app pnpm routes

reset-db: ## Cancella il database e lo ricrea da zero (migrazioni + seed)
	$(COMPOSE) rm -sf db
	docker volume rm -f cosenzaattrattiva_db-data
	$(COMPOSE) up -d --wait db
	$(MAKE) migrate seed

typecheck: ## Controllo dei tipi TypeScript
	$(COMPOSE) exec -T app pnpm typecheck

lint: ## ESLint
	$(COMPOSE) exec -T app pnpm lint

test: ## Test unitari (Vitest)
	$(COMPOSE) exec -T app pnpm run --if-present test

e2e: ## Test end-to-end (Playwright) contro $(SITE_URL)
	$(COMPOSE) --profile tests run --rm e2e

e2e-prod: ## Test e2e incluso l'offline (dopo make prod-local)
	$(COMPOSE) --profile tests run --rm -e E2E_PROD=1 e2e

screenshots: ## Screenshot delle pagine principali (mobile/desktop) in docs/screenshots
	$(COMPOSE) --profile tests run --rm e2e node scripts/screenshots.mjs $(p)

reference: ## Analisi del sito di riferimento vivi-cosenza (REF_PASSWORD in .env) → docs/reference/vivicosenza
	$(COMPOSE) --profile tests run --rm e2e node scripts/reference/vivicosenza.mjs

compare: ## Cattura la home per il confronto con vivicosenza → docs/reference/compare (w=375,768,1440)
	$(COMPOSE) --profile tests run --rm e2e node scripts/reference/compare.mjs $(w) $(a)

lighthouse: ## Lighthouse mobile (eseguire dopo make prod-local) → docs/lighthouse
	$(COMPOSE) --profile tests run --rm e2e bash scripts/lighthouse.sh

prod-local: ## Build di produzione servita da Caddy su $(SITE_URL)
	$(COMPOSE) --profile prod up -d --build --wait app-prod
	UPSTREAM=app-prod:3000 $(COMPOSE) up -d --force-recreate --no-deps proxy
	@echo "→ $(SITE_URL) (produzione). Per tornare al dev: make up"

dns: ## DNS locale per smartphone in LAN (usa l'IP Wi-Fi del Mac)
	@LAN_IP=$${LAN_IP:-$$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $$1}')}; \
	echo "DNS su $$LAN_IP: imposta questo IP come DNS del Wi-Fi sul telefono"; \
	LAN_IP=$$LAN_IP $(COMPOSE) --profile dns up -d dns
