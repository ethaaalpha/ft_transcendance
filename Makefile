# Directories 
BACK_DIR			= 'back'
MEDIA_DIR			= 'media'
LIBS_DIR			= 'libs'

NEEDED_DIR			= ${LIBS_DIR}

# Files
DEFAULT_PICTURE		= "pokemon.png"

# Containers
CONTAINERS		 	= daphne nginx postgresql redis geth

all: 
	$(MAKE) up

up:
	@mkdir -p ${NEEDED_DIR}
	docker compose up --build

down:
	docker compose down

clean:
	docker compose down --rmi local -v

fclean: clean
	@echo "Deleting user media !"
	@find ${MEDIA_DIR} -type f ! -name ${DEFAULT_PICTURE} -exec rm {} +
	docker compose down --rmi all -v --remove-orphans

${CONTAINERS}:
	docker exec -it $@ sh

pyreset:
	@find ${BACK_DIR} -type d \( -name migrations -o -name __pycache__ \) -exec rm -rf {} +
	@echo 'Cleaned py cache and migrations !'

.PHONY: pyreset run down clean fclean ${CONTAINERS}