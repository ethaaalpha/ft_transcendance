# Directories 
BACK_DIR			= 'pong_back'
MEDIA_DIR			= 'media'
DATABASE_DIR 		= 'database'
LIBS_DIR			= 'libs'

NEEDED_DIR			= ${DATABASE_DIR} ${LIBS_DIR}

# Files
DEFAULT_PICTURE		= "pokemon.png"

# Containers
CONTAINERS		 	= daphne nginx postgresql redis geth

all: 
	$(MAKE) run

${CONTAINERS}:
	docker exec -it $@ sh

run:
	@mkdir -p ${NEEDED_DIR}
	docker compose up --build

up:
	docker compose up

down:
	docker compose down

clean:
	docker compose down -v

reset:
	@rm -rf ${DATABASE_DIR}
	@find ${MEDIA_DIR} -type f ! -name ${DEFAULT_PICTURE} -exec rm {} +

pyreset:
	@find ${BACK_DIR} -type d \( -name migrations -o -name __pycache__ \) -exec rm -rf {} +

fclean: clean reset pyreset
	@echo "Full reset !"

.PHONY: reset pyreset run down clean fclean ${CONTAINERS_DEBUG}