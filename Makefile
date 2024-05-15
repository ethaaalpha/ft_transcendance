# Directories 
BACK_DIR			= 'back'

# Containers
CONTAINERS		 	= daphne nginx postgresql redis geth

all: 
	$(MAKE) env

up:
	docker compose up --build

down:
	docker compose down

clean:
	docker compose down --rmi local -v

fclean: clean
	@echo "Deleting user media !"
	docker compose down --rmi all -v --remove-orphans

${CONTAINERS}:
	docker exec -it $@ sh

pyreset:
	@find ${BACK_DIR} -type d \( -name migrations -o -name __pycache__ \) -exec rm -rf {} +
	@echo 'Cleaned py cache and migrations !'

env:
	@python3 env.py .env; \
	if [ $$? -eq 0 ]; then \
		${MAKE} up; \
	fi

.PHONY: pyreset run down clean fclean env ${CONTAINERS}