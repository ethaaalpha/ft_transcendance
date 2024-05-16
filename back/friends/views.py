from django.http import HttpRequest
from django.contrib.auth.models import User
from tools.responses import tResponses
from .forms import FriendsFrom
from users.models import Profile
from activity.notifier import ActivityNotifier
from activity.status import Status
from conversations.models import Conversation

def entryPoint(request: HttpRequest):
	if (request.method == "POST"):
		"""
		/dashboard/friends

		action must be in the content body !
		username must be in the content body !
		"""
		keysList = ['add', 'remove', 'block', 'unblock', 'accept', 'refuse']
		viewsFunctions = [add, remove, block, unblock, accept, refuse]

		form = FriendsFrom(request.POST)
		if (form.is_valid()):
			action = form.cleaned_data['action']
			target = Profile.getUserFromUsername(form.cleaned_data['username'])

			if target == request.user:
				return (tResponses.BAD_REQUEST.request("You're stupid !"))
			if not target:
				return (tResponses.NOT_FOUND.request("Target user not found !"))
			for i in keysList:
				if i == action:
					return ((viewsFunctions[keysList.index(i)])(request.user, target, target.Profile))
			return (tResponses.BAD_REQUEST.request("Unrecognized action !")) 
		else:
			return (tResponses.BAD_REQUEST.request("Form isn't valid !"))
	else:
		return (tResponses.BAD_REQUEST.request("Get request not supported here !"))
	
def add(user: User, target: User, targetProfile: Profile):
	if user.Profile.is_block(target):
		return (tResponses.BAD_REQUEST.request("You blocked this user !"))
	if targetProfile.is_block(user):
		return (tResponses.FORBIDDEN.request("You can't add this user !"))
	if targetProfile.is_friend(user):
		return (tResponses.FORBIDDEN.request("This is already your friend !"))
	if targetProfile.is_pendingFriend(user):
		return (tResponses.FORBIDDEN.request("You already send an friend request to this user !"))
	if user.Profile.is_pendingFriend(target):
		return (accept(user, target, targetProfile))

	targetProfile.pendingFriendsFrom.add(user)
	target.save()
	ActivityNotifier.sendFriendRequest(user.username, target.username, 'received')

	conv = Conversation.getConversation([user, target])
	if conv:
		conv.setState(True)
	return tResponses.OKAY.request(f'You successfully send an friend request to {target.username} !')

def remove(user: User, target: User, targetProfile: Profile):
	if not targetProfile.is_friend(user):
		return (tResponses.FORBIDDEN.request("You are not friend with this person !"))

	targetProfile.friends.remove(user)
	target.save()

	conv = Conversation.getConversation([user, target])
	if conv:
		conv.setState(False)
	ActivityNotifier.sendFriendRequest(user.username, target.username, 'ended')
	return tResponses.OKAY.request(f'You are not longger friend with {target.username} !')

def block(user: User, target: User, targetProfile: Profile):
	if user.Profile.is_block(target):
		return (tResponses.FORBIDDEN.request("You already block this user !"))
	
	remove(user, target, targetProfile)
	user.Profile.blockedUsers.add(target)
	user.save()
	return tResponses.OKAY.request(f'You successfully block {target.username}')

def unblock(user: User, target: User, targetProfile: Profile):
	if not user.Profile.is_block(target):
		return tResponses.FORBIDDEN.request("You didn't block this user !")
	
	user.Profile.blockedUsers.remove(target)
	user.save()
	return tResponses.OKAY.request(f'You successfuly unblock {target.username}')

def accept(user: User, target: User, targetProfile: Profile):
	if not user.Profile.is_pendingFriend(target):
		return tResponses.FORBIDDEN.request("This person didn't send you a friend request !")
	if targetProfile.is_block(user):
		return tResponses.FORBIDDEN.request("You can't become friend with this person !")
	
	user.Profile.friends.add(target)
	user.Profile.pendingFriendsFrom.remove(target)
	user.save()
	ActivityNotifier.sendFriendRequest(user.username, target.username, 'accepted')
	Status.warnFriend(user, target, 'Online')
	Status.warnFriend(target, user, 'Online')

	return tResponses.OKAY.request(f'You are now friend with {target.username}')

def refuse(user: User, target: User, targetProfile: Profile):
	if not user.Profile.is_pendingFriend(target):
		return tResponses.FORBIDDEN.request("This person didn't send you a friend request !")
	
	user.Profile.pendingFriendsFrom.remove(target)
	user.save()
	ActivityNotifier.sendFriendRequest(user.username, target.username, 'refused')

	conv = Conversation.getConversation([user, target])
	if conv:
		conv.setState(False)
	return tResponses.OKAY.request(f'You refused a friend request from {target.username} !')