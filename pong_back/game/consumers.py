import uuid
import json
import sys
import asyncio
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from activity.notifier import ActivityNotifier
from activity.tools import getChannelName
from users.models import Profile
from conversations.models import Conversation
from django.contrib.auth.models import User
from channels.layers import get_channel_layer

data1 :dict = None
data2 :dict = None

class GameConsumer(AsyncJsonWebsocketConsumer):
	@database_sync_to_async
	def getUsername(self):
		return (self.user.username)
	
	async def makeChanges(self, data: dict):
		tmp = [data['player2'][0], data['player2'][1], data['player2'][2]]
		data['player2'] = data['player1']
		data['player2'][1] * -1
		data['player1'] = tmp

	async def connect(self):
		self.user = self.scope['user']
		await self.accept()
		await self.channel_layer.group_add(await self.getUsername(), self.channel_name)

	async def disconnect(self, code):
		global data1, data2
		await self.channel_layer.group_discard(await self.getUsername(), self.channel_name)
		data1 = None
		data2 = None
		return await super().disconnect(code)
	
	async def receive_json(self, content: dict, **kwargs):
		global data1, data2
		await self.send_json(content)
		print(await self.getUsername(), sys.stderr)
		if 'event' in content and 'data' in content:
				if await self.getUsername() == 'nmilan':
					data1 = content
				else :
					data2 = content
			
	async def send_message(self, event):
		print(event, sys.stderr)
		content={
			'event': event['event'],
			'data': event['data']}
		await self.send_json(content)

	async def send_periodic_data(self):
		global data1, data2
		while data1 != None and data2 != None:
			await asyncio.sleep(1)
			#await self.channel_layer.group_send('nmilan', {'type': 'send_message', 'data': data2})
			#await self.channel_layer.group_send('42_nmilan', {'type': 'send_message', 'data': data1})
