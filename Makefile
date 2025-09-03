prod:
	docker compose up

install:
	npm install

build:
	npm run build

start:
	npm run dev

start-prod:
	npm run build && npx serve -s dist -l 4173

docker-up:
	docker-compose up

docker-down:
	docker-compose down