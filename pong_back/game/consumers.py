import uuid
import json
import sys
import re
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
		self.matchId = str(GameMap.getMatchID(await self.getUsername()))
		print(await self.getUsername(), sys.stderr)
		await self.accept()
		await self.channel_layer.group_add(self.matchId, self.channel_name)

	async def disconnect(self, code):
		await self.channel_layer.group_discard(self.matchId, self.channel_name)
		if GameMap.getGame(self.matchId):
			GameMap.removeGame(self.matchId)
		return await super().disconnect(code)
	
	async def receive_json(self, content: dict, **kwargs):
		if content['event'] == 'move':
			data = content['data']
			#print(data, file=sys.stderr)
			await GameMap.getGame(self.matchId).updateBall(data)
		elif content['event'] == 'ready':
			await GameMap.getGame(self.matchId).makeReady(await self.getUsername())

			
	async def send_message(self, event):
		content={
			'event': event['event'],
			'data': event['data']}
		await self.send_json(content)
  	
	@staticmethod
	async def sendMessageToConsumer(matchId: str, content: dict, event: str):
		channel_layer = get_channel_layer()
		await channel_layer.group_send(matchId, {
				"type" : "send.message",
				"data" : content,
				"event" : event
			}
		)


