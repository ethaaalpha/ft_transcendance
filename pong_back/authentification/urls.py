from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie

from . import views as authViews
from users.decorators import logged_required, not_logged_required

urlpatterns = [
	path('login', ensure_csrf_cookie(not_logged_required(authViews.login))),
	path('register', ensure_csrf_cookie(not_logged_required(authViews.register))),
	path('callback', ensure_csrf_cookie(not_logged_required(authViews.callback))),
	path('reset-password', ensure_csrf_cookie(logged_required(authViews.reset_password))),
	path('logout', ensure_csrf_cookie(logged_required(authViews.logout))),
]
