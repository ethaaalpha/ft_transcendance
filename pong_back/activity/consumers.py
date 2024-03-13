from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .notifier import ActivityNotifier
from .tools import getChannelName
from .status import Status
from conversations.models import Conversation

class ActivityConsumer(AsyncJsonWebsocketConsumer):
		
	@database_sync_to_async
	def getUsername(self):
		return (self.user.username)

	async def connect(self):
		self.user = self.scope['user']
		await self.accept()
		await self.channel_layer.group_add(getChannelName(await self.getUsername(), 'activity'), self.channel_name)
		await sync_to_async(Status.connect)(self.user)

	async def disconnect(self, code):
		await sync_to_async(Status.disconnect)(self.user)
		await self.channel_layer.group_discard(getChannelName(await self.getUsername(), 'activity'), self.channel_name)
		return await super().disconnect(code)
	
	async def receive_json(self, content: dict, **kwargs):
		if 'event' in content and 'data' in content:
			data: dict = content.get('data')
			match content['event']:
				case 'chat':
					await ActivityNotifier.sendPrivateMessage(await self.getUsername(), data.get('to'), data.get('content'))
					await database_sync_to_async(Conversation.consumer_appendToConversation)(data.get('from'), data.get('to'), data.get('content'))
			
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

	