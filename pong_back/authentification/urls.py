from django.urls import path

from . import views as authViews
from users.decorators import logged_required, not_logged_required

urlpatterns = [
	path('login', not_logged_required(authViews.login)),
	path('register', not_logged_required(authViews.register)),
	path('callback', not_logged_required(authViews.callback)),
	path('reset-password', not_logged_required(authViews.reset_password)),
	path('logout', logged_required(authViews.logout)),
]
