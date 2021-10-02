.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'


.PHONY: find_todo
find_todo: ## Find all the todo's in the comments.
	@grep --color=always --include=\*.go -PnRe '(//|/*).*TODO' --exclude-dir=.history/ ./ || true


# prompt_example> make start OPTIONS="-- -d"
.PHONY: start
start: ## Start the application.
	@docker-compose pull
	@docker-compose up --build $(OPTIONS)


.PHONY: stop
stop:  ## Stop all the Docker containers.
	@docker-compose down


.PHONY: start-deps
start-deps: ## Start all the docker containers that this app needs as dependencies.
	@docker-compose pull
	@docker-compose up -d management-api redis database-seed database


.PHONY: dev
dev: ## Start the development server
	@npm run start


.PHONY: build
build: ## Builds the application for production.
	@npm run build


.PHONY: start-local
start-local: start-deps dev ## Start the application, running sveltekit locally.


.PHONY: lint
lint: ## Run linter on source code and tests.
	@npm run lint


.PHONY: lint-fix
lint-fix: ## Run linter and will try to fix all the issue it can automatically.
	@npm run lint:fix


.PHONY: format
format:  ## Checks if the code is complaint with the formatters.
	@npm run format


.PHONY: format-fix
format-fix:  ## Formats the code automatically.
	@npm run format:fix


.PHONY: test
test:  ## Runs all the tests.
	@npm run test
