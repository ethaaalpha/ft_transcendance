all: 
	$(MAKE) daphne

daphne:
	docker exec -it daphne bash

reset:
	rm -rf database/
	mkdir database

migrationsreset:
	find . -name migrations/ -type f -delete
	find . -name __pycache__/ -type f -delete
