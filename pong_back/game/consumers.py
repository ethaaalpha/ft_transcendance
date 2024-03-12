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
from game.core import Game, GameMap

class GameConsumer(AsyncJsonWebsocketConsumer):
	@database_sync_to_async
	def getUsername(self):
		return (self.user.username)
	

	async def connect(self):
		self.user = self.scope['user']
		#self.matchId = getMatch(await self.getUsername())
		print(await self.getUsername(), sys.stderr)
		await self.accept()
		await self.channel_layer.group_add(await self.getUsername(), self.channel_name)

	async def disconnect(self, code):
		await self.channel_layer.group_discard(await self.getUsername(), self.channel_name)
		return await super().disconnect(code)
	
	async def makeChanges(self, data: dict):
		tmp = [data['player2'][0], data['player2'][1] *  -1, data['player2'][2]]
		data['player2'][0] = data['player1'][0]
		data['player2'][1] = data['player1'][1]
		data['player2'][2] = data['player1'][2]
		data['player2'][1] *= -1
		data['player1'] = tmp
		if data['ballVec'][1] == 0:
			if await self.getUsername() == 'nmilan2':
				data['ballVec'][1] = -1
			else :
				data['ballVec'][1] = 1
	
	async def receive_json(self, content: dict, **kwargs):
		data = content['data']
		GameMap._gameStack[self.matchId].updateBall
			
	async def send_message(self, event):
		content={
			'event': event['event'],
			'data': event['data']}
		await self.send_json(content)
  	
	@staticmethod
	def sendMessageToConsumer(matchId: str, content: str, event: str):
		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(matchId, {
				"type" : "send.message",
				"data" : content,
				"event" : event
			}
		)


