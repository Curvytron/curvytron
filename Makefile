.DEFAULT_GOAL := help
.PHONY: help install build build-client build-server build-vendor build-css dev start lint lint-fix clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

build: ## Build everything for production (minified)
	npm run build

build-client: ## Build only the client bundle (web/js/curvytron.js)
	npm run build:client

build-server: ## Build only the server bundle (bin/curvytron.cjs)
	npm run build:server

build-vendor: ## Build only the vendor bundle (web/js/dependencies.js)
	npm run build:vendor

build-css: ## Build only the CSS (web/css/style.css)
	npm run build:css

dev: ## Watch sources and run the server (Ctrl-C stops everything)
	@trap 'kill 0' EXIT; \
		npm run watch:css & \
		npm run watch:client & \
		npm run watch:server & \
		npm start

start: ## Run the server
	npm start

lint: ## Lint the codebase
	npm run lint

lint-fix: ## Lint and auto-fix where possible
	npm run lint:fix

clean: ## Remove build artifacts
	rm -rf web/js web/css/style.css web/index.html bin/curvytron.cjs
