import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class ActivityConsumer(WebsocketConsumer):
	def connect(self):
		self.user = self.scope['user']
		self.accept()
		self.send(text_data=json.dumps({"message": f"Bienvenue {self.user.username}"}))
		async_to_sync(self.channel_layer.group_add)(self.user.username, self.channel_name)

	def disconnect(self, code):
		async_to_sync(self.channel_layer.group_discard)(self.user.username, self.channel_name)
		return super().disconnect(code)

	def send_message(self, event):
		text_data = event['content']
		self.send(text_data=json.dumps({"message": text_data}))

	def receive(self, text_data=None):
		text_data_json = json.loads(text_data)
		message = text_data_json['message']
		self.send(text_data=json.dumps({"message": message}))