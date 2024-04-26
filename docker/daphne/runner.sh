# Django
## Admin pannel
python manage.py collectstatic --noinput

## Database
python manage.py makemigrations conversations game stats users blockchain admin auth contenttypes sessions
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser --noinput

## Runner
python manage.py runserver 0.0.0.0:8000