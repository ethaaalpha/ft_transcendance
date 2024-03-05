from datetime import datetime, timedelta
from django.contrib.auth.models import User

# doit être dôté d'un marqueur temporel !
class Invitation:
	def __init__(self, initier: User, target: User):
		self.timestamp = datetime.now()
		self.initier = initier
		self.target = target
		return

	def notifyTarget(self, content: str):
		return
	
	def notifyInitier(self, content: str):
		return
	
	def expired(self, now) -> bool:
		delta: timedelta = now - self.timestamp
		return True if delta.seconds > 30 else False
 
#invitation stack that will contain all the current invitation
class InvitationStack:
	stack = []

	@staticmethod
	def invite(initier: User, target: User) -> str:
		InvitationStack.update()
		# check doublon
		for invitation in InvitationStack.stack:
			if (invitation.initier == initier):
				return ("You already invited somebody please wait at least 30 seconds between each invite !")
		# check if they are friend
		if not (initier.profile.is_friend(target)):
			return ("You must be friend with this person to do that !")
		
		newInvitation = Invitation(initier, target)
		InvitationStack.stack.append(newInvitation)
		newInvitation.notifyTarget(f"You are invited to play with {initier.username}")
		return (f"Match invitation succefully send to {target.username} !")
	
	@staticmethod
	def refuse(initier: User, target: User) -> str:
		InvitationStack.update()
		"""
		Target is the person who refuse the invitation !
		"""
		for invitation in InvitationStack.stack:
			if (invitation.initier == initier and invitation.target == target):
				Invitation.notifyInitier(f"{target.username} has refused your invitation to play !")
				InvitationStack.stack.remove(invitation)
				return ("You refused this invitation !")				

		return ("This invitation do not exist anymore !")
	
	@staticmethod
	def accept() -> str:
		return ("test")
	
	@staticmethod
	def update():
		current = datetime.now()
		for invitation in InvitationStack.stack:
			if invitation.expired(current):
				InvitationStack.stack.remove(invitation)
	
