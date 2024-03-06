FOLDER = three

all: 
	$(MAKE) run

checkFolder:
	if [ ! -d $(FOLDER) ]; then \
		mkdir -p libs/three && \
		wget https://github.com/mrdoob/three.js/archive/refs/tags/r162.tar.gz && \
		tar -zxvf r162.tar.gz -C libs/three; \
	fi
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
	$(MAKE) checkFolder
	docker compose up --build

down:
	docker compose down

clean:
	docker compose down -v

fclean: clean reset pyreset
	echo "Full reset !"

.PHONY: checkFolder