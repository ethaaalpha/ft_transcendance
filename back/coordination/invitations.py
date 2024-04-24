import coordination.consumers as CC
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from game.models import Room
from .tools import isAvailableToPlay

class Invitation:
	def __init__(self, initier: User, target: User):
		self.timestamp = datetime.now()
		self.initier = initier
		self.target = target
		return

	def notify(self, who: str, event: str, content: str):
		match who:
			case 'initier':
				CC.CoordinationConsumer.sendMessageToConsumer(self.initier.username, event, content)
			case 'target':
				CC.CoordinationConsumer.sendMessageToConsumer(self.target.username, event, content)
			case 'all':
				CC.CoordinationConsumer.sendMessageToConsumer(self.initier.username, event, content)
				CC.CoordinationConsumer.sendMessageToConsumer(self.target.username, event, content)
			
	def expired(self, now) -> bool:
		delta: timedelta = now - self.timestamp
		return True if delta.seconds > 30 else False
 
#invitation stack that will contain all the current invitation
class InvitationStack:
	stack = []

	@staticmethod
	def find(initier: User, target: User) -> Invitation | None:
		for invitation in InvitationStack.stack:
			if (invitation.initier == initier and invitation.target == target):
				return (invitation)
		return (None)

	@staticmethod
	def invite(initier: User, target: User) -> str:
		InvitationStack.update()
		# check doublon
		for invitation in InvitationStack.stack:
			if (invitation.initier == initier):
				return ("You already invited somebody please wait at least 30 seconds between each invite !", False)
		# check if they are friend
		if not (initier.Profile.is_friend(target)):
			return ("You must be friend with this person to do that !", False)
		
		newInvitation = Invitation(initier, target)
		InvitationStack.stack.append(newInvitation)
		newInvitation.notify('target', 'invite', f"You are invited to play with {initier.username}")
		return (f"Match invitation succefully send to {target.username} !", True)
	
	@staticmethod
	def refuse(initier: User, target: User) -> str:
		InvitationStack.update()
		"""
		Target is the person who refuse the invitation !
		"""
		inv: Invitation = InvitationStack.find(initier, target)
		if inv:
			inv.notify('initier', 'refuse', f"{target.username} has refused your invitation to play !")
			InvitationStack.stack.remove(inv)
			return ("You refused this invitation !", True)				
		return ("This invitation do not exist anymore !", False)
	
	@staticmethod
	def accept(initier: User, target: User) -> str:
		InvitationStack.update()
		"""
		Target is the person who accept the invitation !
		"""
		inv: Invitation = InvitationStack.find(initier, target)
		if inv:
			inv.notify('initier', 'accept', f"{target.username} has accepted your invitation !")
			inv.notify('target', 'accept', f"{initier.username} has accepted your invitation !")
			InvitationStack.stack.remove(inv)

			initierCheck = isAvailableToPlay(initier)
			targetCheck = isAvailableToPlay(target)

			if initierCheck[1] or targetCheck[1]:
				inv.notify('all', 'refuse', "Something bad happend you can't play together !")
			
			# create match here !!
			room: Room = Room.createRoom(initier)
			room.addPlayer(target)
			return ("You successfully accepted an invitation !", True)
		return ("This invitation do not exist !", False)
	
	@staticmethod
	def update():
		current = datetime.now()
		for invitation in InvitationStack.stack:
			if invitation.expired(current):
				InvitationStack.stack.remove(invitation)