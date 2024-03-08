all: 
	$(MAKE) run

daphne:
	docker exec -it daphne bash

reset:
	rm -rf database/
	mkdir database

pyreset:
	find pong_back -type d -name 'migrations' -exec rm -rf {} \;
	find pong_back -type d -name '__pycache__' -exec rm -rf {} \;

run:
	mkdir -p database
	mkdir -p libs
	docker compose up --build

down:
	docker compose down

clean:
	docker compose down -v

fclean: clean reset pyreset
	echo "Full reset !"

.PHONY: daphne reset pyreset run down clean fclean