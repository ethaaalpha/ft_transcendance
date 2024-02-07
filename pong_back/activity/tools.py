
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
channel_layer = get_channel_layer()

class ActivityNotifier():
	def notify(channel: str, type: str, content: str):
		async_to_sync(channel_layer.group_send)(channel, {
			"type" : type,
			"content" : content
		})