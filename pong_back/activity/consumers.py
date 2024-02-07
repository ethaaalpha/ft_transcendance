import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .notifier import ActivityNotifier
from .tools import getChannelName

class ActivityConsumer(WebsocketConsumer):
	def connect(self):
		self.user = self.scope['user']
		self.accept()
		async_to_sync(self.channel_layer.group_add)(getChannelName(self.user.username), self.channel_name)

	def disconnect(self, code):
		async_to_sync(self.channel_layer.group_discard)(getChannelName(self.user.username), self.channel_name)
		return super().disconnect(code)

	def send_message(self, event):
		self.send(text_data=json.dumps({
			"event": event['event'],
			"data": event['data']
		}))

	def receive(self, text_data=None):
		contentJson = json.loads(text_data)

		match contentJson['event']:
			case 'chat':
				ActivityNotifier.sendPrivateMessage(contentJson['data'])
			case _:
				return