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
from django.views.decorators.csrf import ensure_csrf_cookie

from users.decorators import logged_required
from activity.consumers import ActivityConsumer
from game.consumers import GameConsumer
from coordination.consumers import CoordinationConsumer

import users.views as uV
import friends.views as fV
import conversations.views as cV
import stats.views as sV


urlpatterns = [
	path('api/admin/', admin.site.urls),
	path('api/dashboard', ensure_csrf_cookie(logged_required(uV.entryPoint))),
	path('api/dashboard/friends', ensure_csrf_cookie(logged_required(fV.entryPoint))),
	path('api/dashboard/conversations', ensure_csrf_cookie(logged_required(cV.entryPoint))),
	path('api/dashboard/match', ensure_csrf_cookie(logged_required(sV.entryPoint))),
	path('api/auth/', include('authentification.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

websocket_urlpatterns = [
	path("api/activity/", ActivityConsumer.as_asgi()),
	path("api/game/", GameConsumer.as_asgi()),
	path("api/coordination/", CoordinationConsumer.as_asgi()),
]

