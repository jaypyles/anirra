build:
	docker compose build

down:
	docker compose down

up-dev:
	docker compose -f docker-compose.dev.yml up -d --force-recreate

up:
	docker compose -f docker-compose.yml up -d --force-recreate

