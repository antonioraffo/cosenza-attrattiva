SHELL := /bin/bash
COMPOSE := docker compose
DOMAIN := cosenzaattrattiva.test

.DEFAULT_GOAL := help
.PHONY: help setup up down restart logs ps sh psql migrate seed reset-db typecheck lint test e2e prod-local dns

help: ## Elenca i comandi disponibili
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

setup: ## Prima installazione: certificati, /etc/hosts, stack, migrazioni, seed
	@./scripts/setup-local.sh

up: ## Avvia lo stack (db, app, proxy) e attende che sia in salute
	$(COMPOSE) up -d --build --wait
	@echo "→ https://$(DOMAIN)"

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

e2e: ## Test end-to-end (Playwright) contro https://$(DOMAIN)
	$(COMPOSE) --profile tests run --rm e2e

prod-local: ## Build di produzione servita da Caddy su https://$(DOMAIN)
	$(COMPOSE) --profile prod up -d --build --wait app-prod
	UPSTREAM=app-prod:3000 $(COMPOSE) up -d --force-recreate proxy
	@echo "→ https://$(DOMAIN) (produzione). Per tornare al dev: make up"

dns: ## DNS locale per smartphone in LAN (usa l'IP Wi-Fi del Mac)
	@LAN_IP=$${LAN_IP:-$$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $$1}')}; \
	echo "DNS su $$LAN_IP: imposta questo IP come DNS del Wi-Fi sul telefono"; \
	LAN_IP=$$LAN_IP $(COMPOSE) --profile dns up -d dns
