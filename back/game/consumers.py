import uuid
import json
import sys
import re
import asyncio
import time
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
	last_message_time = None
	inactivity_threshold = 5
	inactivity_check_task = None

	@database_sync_to_async
	def getUsername(self):
		return (self.user.username)

	@classmethod
	async def decode_json(cls, text_data):
		try:
			return json.loads(text_data)
		except:
			return {}

	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_authenticated:
			self.matchId = str(GameMap.getMatchID(await self.getUsername()))
			self.game = GameMap.getGame(self.matchId)
			await self.accept()
			await self.channel_layer.group_add(self.matchId, self.channel_name)
			self.last_message_time = time.time()
			self.inactivity_check_task = asyncio.create_task(self.check_inactivity_periodically())
	
	async def disconnect(self, code):
		if not self.user.is_authenticated:
			return
		if self.game:
			await self.game.disconnect(await self.getUsername())
			GameMap.removeGame(self.matchId)
		self.inactivity_check_task.cancel()
		await self.channel_layer.group_discard(self.matchId, self.channel_name)
		return await super().disconnect(code)
	
	async def receive_json(self, content: dict, **kwargs):
		self.last_message_time = time.time()
		if self.game :
			if content['event'] == 'move':
				data = content['data']
				await self.game.updateBall(data)
			elif content['event'] == 'ready':
				await self.game.makeReady(await self.getUsername())

	async def check_inactivity_periodically(self):
		while True:
			await asyncio.sleep(1)
			if time.time() - self.last_message_time >= self.inactivity_threshold:
				print(f"User {await self.getUsername()} is inactive.", file=sys.stderr)
				if self.game:
					await self.game.disconnect(await self.getUsername())
					GameMap.removeGame(self.matchId)
				break

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