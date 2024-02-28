"""
Django settings for pong_back project.

Generated by 'django-admin startproject' using Django 5.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-r2=)ru12*q)l-&becymd(@z1^iqkde#4)8%5(96s4m%gx!0l^j'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
	'daphne',
	'channels',
    'django.contrib.staticfiles',
	'authentification',
	'users',
	'stats',
	'friends',
	'activity',
	'conversations',
	'game',
	'coordination'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pong_back.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ["../pong_front/templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'pong_back.wsgi.application'

ASGI_APPLICATION = 'pong_back.asgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        # 'ENGINE': 'django.db.backends.sqlite3',
        # 'NAME': BASE_DIR / 'db.sqlite3',
		'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'ethaniellegrand',
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': '5432',
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'fr-fr'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Settings #
MEDIA_ROOT = "../media/"
MEDIA_URL = "media/"
STATIC_URL = "game/static/"
# STATIC_ROOT = "../pong_front/"
STATICFILES_DIRS = [
	BASE_DIR / "../pong_front",
]


# Auth #
API_CALLBACK = "https://localhost:8000/api/auth/callback"
API_URL = "https://api.intra.42.fr/oauth/authorize"
API_UUID = "u-s4t2ud-45ce7bc515b8b21e8a60214ec587495181e86923fa57aa7017a3a437781f8162"
API_SECRET = "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"
API_TOKEN = "https://api.intra.42.fr/oauth/token"
API_INFO = "https://api.intra.42.fr/v2/me"

CONFIG_PASS_LENGTH_MAX = 32
CONFIG_PASS_LENGTH_MIN = 5

CONFIG_USER_LENGTH_MAX = 32
CONFIG_USER_LENGTH_MIN = 3

CONFIG_EMAIL_LENGTH_MAX = 254
CONFIG_EMAIL_LENGTH_MIN = 5


# Nginx conf
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
ALLOWED_HOSTS = [ 'localhost' ]


# Channel layer
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}

# Users
DEFAULT_PROFILE_PICTURE_NAME = 'pokemon.png'

# Messages
MESSAGE_LENGTH_MAX = 1024



LOGGING = {
	"version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": False,
        },
		'daphne': {
   		'handlers': [
       	 	'console',
    	],
    	'level': 'DEBUG'
		},
    },
}
