from django.urls import re_path, path

from . import consumers

websocket_urlpatterns = [
	path("activity/", consumers.ActivityConsumer.as_asgi()),
]