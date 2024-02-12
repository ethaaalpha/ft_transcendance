import json
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .notifier import ActivityNotifier
from .tools import getChannelName
from users.models import Profile
from conversations.models import Conversation
from django.contrib.auth.models import User

class ActivityConsumer(AsyncJsonWebsocketConsumer):
		
	@database_sync_to_async
	def getUsername(self):
		return (self.user.username)

	async def connect(self):
		self.user = self.scope['user']
		await self.accept()
		await self.channel_layer.group_add(getChannelName(await self.getUsername()), self.channel_name)
		# await self.send_json(content={"this is the test": "oui"})

	async def disconnect(self, code):
		await self.channel_layer.group_discard(getChannelName(await self.getUsername()), self.channel_name)
		return await super().disconnect(code)
	
	async def receive_json(self, content: dict, **kwargs):
		if 'event' in content and 'data' in content:
			match content['event']:
				case 'chat':
					data: dict = content.get('data')
					print(f'voici la data {data}')
					await ActivityNotifier.sendPrivateMessage(_from=data.get('from'), _to=data.get('to'), _content=data.get('content'))
					# await self.send_json(content={'message' : 'la cest le chat'})
				# case 'friends':
					# await self.send_json(content={'message' : 'la cest les avmis'})

	async def send_message(self, event):
		await self.send_json(content={
			'event': event['event'],
			'data': event['data'] 
		})

	