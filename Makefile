build:
	docker compose build

build-force:
	docker compose build --no-cache

down:
	docker compose down

pull:
	docker compose pull

up-dev:
	docker compose -f docker-compose.dev.yml up -d --force-recreate

up:
	docker compose -f docker-compose.yml up -d --force-recreate