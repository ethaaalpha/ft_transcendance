from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from users.models import Profile
from .tools import getChannelName
channel_layer = get_channel_layer()

class ActivityNotifier():
	"""
	Use to notify client using WebSocket
	-----
	sendPrivateMessage(args: dict) ['from', 'to', 'content'] \n
	sendFriendRequest(sender: str, target: str):
	"""

	@staticmethod
	def sendPrivateMessage(args: dict):
		required = ['from', 'to', 'content']

		# security checks of values inside of Websocket send
		if any(need not in args.keys() for need in required):
			return
		if any(key not in required for key in args.keys()):
			return
		ActivityNotifier._notifyBuilder(args['from'], args['to'], args, 'chat')

	@staticmethod
	def sendFriendRequest(senderName: str, targetName: str):
		content = {
			'from' : senderName
		}
		ActivityNotifier._notifyBuilder(senderName, targetName, content, 'friend')

	@staticmethod
	def _notifyBuilder(sender: str, target: str, content: str, event: str):
		"""
		Method that will check user existences and prevent from blocked user !
		"""
		sender = Profile.getUserFromUsername(sender)
		target = Profile.getUserFromUsername(target)

		# Prevent from inexisting user
		if not sender or not target:
			return
		
		# Blocklist of user
		if target.profile.is_block(sender) or sender.profile.is_block(target):
			return
		
		ActivityNotifier._notify(getChannelName(target), content, event)

	@staticmethod
	def _notify(channel: str, content: str, event: str, type='send.message'):
		"""
		Do not use without _notifyBuilder
		"""
		async_to_sync(channel_layer.group_send)(channel, {
			"type" : type,
			"event" : event,
			"data" : content
		})