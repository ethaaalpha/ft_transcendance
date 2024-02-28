from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async, async_to_sync
from users.models import Profile
from .tools import getChannelName


class ActivityNotifier():
	"""
	Use to notify client using WebSocket
	-----
	sendFriendRequest(sender: str, target: str):
	sendMessage(sender str, target: str)
	"""

	@staticmethod
	@database_sync_to_async
	def _getProfileFromUsername(username: str) -> Profile:
		user = Profile.getUserFromUsername(username)
		if user:
			return (user.profile)
		return user
	
	@staticmethod
	def sendFriendRequest(senderName: str, targetName: str):
		content = {
			'from' : senderName
		}
		async_to_sync (ActivityNotifier._notify)(getChannelName(targetName, 'activity'), content, 'friends', senderName, targetName)

	@staticmethod
	async def sendPrivateMessage(_from=None, _to=None, _content=None):
		"""
		if any of parameters contains None, nothing happend !
		"""
		if all(item is None for item in [_from, _to, _content]):
			return
		await ActivityNotifier._notify(getChannelName(_to, 'activity'), {'from': _from, 'to': _to, 'content': _content}, 'chat', _from, _to, friendMandatory=True)

	@staticmethod
	async def _notify(channel: str, content: str, event: str, _from: str, _to: str, type='send.message', friendMandatory=False):
		"""
		This don't notify if user block, and check for user existence
		"""
		fromUser: Profile = await ActivityNotifier._getProfileFromUsername(_from)
		target: Profile = await ActivityNotifier._getProfileFromUsername(_to)


		if not fromUser or not target:
			return
		
		if await database_sync_to_async(target.is_block)(fromUser):
			return

		if friendMandatory and not await database_sync_to_async(target.is_friend)(fromUser):
			return 
		import sys
		print('je cuic arrive2 ici', file=sys.stderr)
		
		channel_layer = get_channel_layer()
		await channel_layer.group_send(channel, {
			"type" : type,
			"event" : event,
			"data" : content,
			'from': _from,
			'to': _to
		})