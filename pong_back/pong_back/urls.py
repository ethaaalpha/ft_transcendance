"""
URL configuration for pong_back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from home.views import index, game
from users.decorators import logged_required
from activity.consumers import ActivityConsumer
from game.consumers import GameConsumer
from coordination.consumers import CoordinationConsumer

import users.views
import friends.views
import conversations.views


urlpatterns = [
	path('admin/', admin.site.urls),
	path('dashboard', logged_required(users.views.entryPoint)),
	path('dashboard/friends', logged_required(friends.views.entryPoint)),
	path('dashboard/conversations', logged_required(conversations.views.entryPoint)),
	path('auth/', include('authentification.urls')),
	# path('', index, name="index"),
	path('game/', game, name='game')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

websocket_urlpatterns = [
	path("activity/", ActivityConsumer.as_asgi()),
	path("game/", GameConsumer.as_asgi()),
	path("coordination/", CoordinationConsumer.as_asgi()),
]

