import sys
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from activity.tools import getChannelName
from users.models import Profile
from django.contrib.auth.models import User
from .matchmaking import Matchmaking
from channels.layers import get_channel_layer

class CoordinationConsumer(AsyncJsonWebsocketConsumer):
		
	@database_sync_to_async
	def getUsername(self):
		return (self.user.username)

	async def connect(self):
		self.user = self.scope['user']
		await self.accept()
		await self.channel_layer.group_add(getChannelName(await self.getUsername(), 'coord'), self.channel_name)

	async def disconnect(self, code):
		from game.models import Room

		# need to leave the matchmaking queue
		await sync_to_async(Matchmaking.removePlayerToQueue)(self.user)

		# need to leave all the rooms not launched
		await database_sync_to_async(Room.disconnectAPlayer)(self.user)

		await self.channel_layer.group_discard(getChannelName(await self.getUsername(), 'coord'), self.channel_name)
		return await super().disconnect(code)
	
	async def receive_json(self, content: dict, **kwargs):
		if 'event' in content and 'data' in content:
			data = content['data']
			match content['event']:
				case 'matchmaking':
					if 'action' not in data:
						return
					match data['action']:
						case 'join':
							result = await sync_to_async(Matchmaking.addPlayerToQueue)(self.user)
							await self.send_json({'event': 'matchmaking', 'data': {'message' : result}})
						case 'quit':
							result = await sync_to_async(Matchmaking.removePlayerToQueue)(self.user)
							await self.send_json({'event': 'matchmaking', 'data': {'message' : result}})
						case _:
							return
				case 'join':
					return 
					sync_to_async()

	async def send_message(self, event):
		await self.send_json(content={
			'event': event['event'],
			'data': event['data'] 
		})

	@staticmethod
	def sendMessageToConsumer(username: str, content: str, event: str):
		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(getChannelName(username, 'coord'),
			{
				"type" : "send.message",
				"data" : content,
				"event" : event
			}
		)

