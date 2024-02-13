import json
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from activity.notifier import ActivityNotifier
from activity.tools import getChannelName
from users.models import Profile
from conversations.models import Conversation
from django.contrib.auth.models import User
from channels.layers import get_channel_layer

class GameConsumer(AsyncJsonWebsocketConsumer):
		
	@database_sync_to_async
	def getUsername(self):
		return (self.user.username)

	async def connect(self):
		self.user = self.scope['user']
		await self.accept()
		await self.channel_layer.group_add(getChannelName(await self.getUsername()), self.channel_name)

	async def disconnect(self, code):
		await self.channel_layer.group_discard(getChannelName(await self.getUsername()), self.channel_name)
		return await super().disconnect(code)
	
	async def receive_json(self, content: dict, **kwargs):
		if 'event' in content and 'data' in content:
			match content['event']:
				case 'game':
					data: dict = content.get('data')
					#await self.send_json(data)
					channel_layer = get_channel_layer()
					await channel_layer.group_send(getChannelName(await self.getUsername()), {'type': 'send.message', 'event': 'game', 'data':data})
				case _:
					self.send_json(content)
	async def send_message(self, event):
		print(f"j'envoie a {await self.getUsername()}")
		await self.send_json(content={
			'event': event['event'],
			'data': event['data'] 
		})
