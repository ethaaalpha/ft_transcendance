from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .notifier import ActivityNotifier
from .tools import getChannelName
from users.models import Profile
from .status import Status
from conversations.models import Conversation
import json

class ActivityConsumer(AsyncJsonWebsocketConsumer):
		
	@database_sync_to_async
	def getUsername(self):
		return (self.user.username)
	
	@database_sync_to_async
	def getUser(self, username=None):
		tUser = self.user.username if not username else username
		return (Profile.getUserFromUsername(tUser))

	@classmethod
	async def decode_json(cls, text_data):
		try:
			return json.loads(text_data)
		except:
			return {}
		
	async def connect(self):
		self.user = self.scope['user']
		if self.user.is_authenticated:
			await self.accept()
			await self.channel_layer.group_add(getChannelName(await self.getUsername(), 'activity'), self.channel_name)
			await database_sync_to_async(Status.connect)(await self.getUser())

	async def disconnect(self, code):
		if self.user.is_authenticated:
			await database_sync_to_async(Status.disconnect)(await self.getUser())
			await self.channel_layer.group_discard(getChannelName(await self.getUsername(), 'activity'), self.channel_name)
		return await super().disconnect(code)
	
	async def receive_json(self, content: dict, **kwargs):
		if 'event' in content and 'data' in content:
			data: dict = content.get('data')
			match content['event']:
				case 'chat':
					await ActivityNotifier.sendPrivateMessage(await self.getUsername(), data.get('to'), data.get('content'))
					await sync_to_async(Conversation.consumer_appendToConversation)(await self.getUsername(), data.get('to'), data.get('content'))
			
	async def send_message(self, event):
		await self.send_json(content={
			'event': event['event'],
			'data': event['data'] 
		})

	@staticmethod
	def sendMessageToConsumer(username: str, content: str, event: str):
		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(getChannelName(username, 'activity'),
			{
				"type" : "send.message",
				"data" : content,
				"event" : event
			}
		)

	