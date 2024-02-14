import uuid
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

name = ['host', 'guest']
nb = 0
nbtmp = 1
nbtmp2 = 0



class GameConsumer(AsyncJsonWebsocketConsumer):
	@database_sync_to_async
	def getUsername(self):
		return (self.user.username)
	
	async def makeChanges(self, data: dict):
		tmp = [data['player2'][0], data['player2'][1] * -1, data['player2'][2]]
		data['player2'] = data['player1']
		data['player2'][1] * -1
		data['player1'] = tmp

	async def connect(self):
		global nb, nbtmp, nbtmp2, name
		self.user = self.scope['user']
		await self.accept()
		await self.channel_layer.group_add(name[nb], self.channel_name)
		nbtmp2 = nb
		nb = nbtmp
		nbtmp = nbtmp2


	async def disconnect(self, code):
		await self.channel_layer.group_discard(name[0], self.channel_name)
		await self.channel_layer.group_discard(name[1], self.channel_name)
		return await super().disconnect(code)
	
	async def receive_json(self, content: dict, **kwargs):
		await self.send_json(content)
		if 'event' in content and 'data' in content:
			match content['event']:
				case 'guest':
					channel_layer = get_channel_layer()
					data: dict = content.get('data')
					await channel_layer.group_send(name[1], {'type': 'send.message', 'event': 'host', 'data':data})
					await self.makeChanges(data)
					content['event'] = 'host'
					await channel_layer.group_send(name[0], {'type': 'send.message', 'event': 'host', 'data':data})
				case 'host':
					channel_layer = get_channel_layer()
					data: dict = content.get('data')
					await channel_layer.group_send(name[0], {'type': 'send.message', 'event': 'host', 'data':data})
					await self.makeChanges(data)
					content['event'] = 'guest'
					await channel_layer.group_send(name[1], {'type': 'send.message', 'event': 'guest', 'data':data})
	async def send_message(self, event):
		await self.send_json(content={
			'event': event['event'],
			'data': event['data'] 
		})
