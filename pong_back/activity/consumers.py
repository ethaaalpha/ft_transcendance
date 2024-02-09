import json
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer
from .notifier import ActivityNotifier
from .tools import getChannelName
from users.models import Profile
from conversations.models import Conversation

class ActivityConsumer(WebsocketConsumer):
	def connect(self):
		self.user = self.scope['user']
		self.accept()
		async_to_sync(self.channel_layer.group_add)(getChannelName(self.user.username), self.channel_name)

	def disconnect(self, code):
		async_to_sync(self.channel_layer.group_discard)(getChannelName(self.user.username), self.channel_name)
		return super().disconnect(code)

	def send_message(self, event):
		self.send(text_data=json.dumps({
			"event": event['event'],
			"data": event['data']
		}))

	def send_chat_message(self, args: dict):
		required = ['from', 'to', 'content']

		# security checks of values inside of Websocket send
		if any(need not in args.keys() for need in required):
			return
		if any(key not in required for key in args.keys()):
			return

		sender = Profile.getUserFromUsername(args['from'])
		target = Profile.getUserFromUsername(args['to'])
		content = args['content']
		print(f'voici le sender {sender}, {target}, {content}')
		if not sender or not target or not content or sender != self.user:
			return
		if target.profile.is_block(sender) or sender.profile.is_block(target):
			return

		async_to_sync(self.channel_layer.group_send)(getChannelName(target.username), {
			"type" : 'send.message',
			"event" : 'chat',
			"data" : content
		})
		print("le messsage a completement ete envoyé")

	def receive(self, text_data=None):
		contentJson = json.loads(text_data)

		match contentJson['event']:
			case 'chat':
				print(f"voici le contenu de du message {contentJson['data']}")
				self.send_chat_message(contentJson['data'])
				# sync_to_async(Conversation.consumer_appendToConversation)(contentJson['data'])
			case _:
				return