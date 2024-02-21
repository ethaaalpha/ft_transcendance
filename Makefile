all: 
	$(MAKE) daphne

daphne:
	docker exec -it daphne bash

reset:
	rm -rf database/
	mkdir database

pyreset:
	find pong_back -type d -name '__pycache__' -exec rm -rf {} \;
	find pong_back -type d -name 'migrations' -exec rm -rf {} \;

run:
	mkdir -p database
	docker compose up --build

down:
	docker compose down -v
