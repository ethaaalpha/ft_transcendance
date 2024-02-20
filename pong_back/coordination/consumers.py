import sys
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from activity.tools import getChannelName
from users.models import Profile
from conversations.models import Conversation
from django.contrib.auth.models import User
from .matchmaking import Matchmaking

class CoordinationConsumer(AsyncJsonWebsocketConsumer):
		
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
				case 'matchmaking':
					await sync_to_async(Matchmaking.addPlayerToQueue)(self.user)
				case 'join':
					#join method with CODE
					sync_to_async()
					
				
	async def send_message(self, event):
		await self.send_json(content={
			'event': event['event'],
			'data': event['data'] 
		})

