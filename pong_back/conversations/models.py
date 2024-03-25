from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from users.models import Profile

class Conversation(models.Model):
	participants = models.ManyToManyField(User, related_name='participants')
	createdAt = models.DateTimeField(auto_now_add=True)
	
	def getMessages(self, n = 10):
		"""
		Return the last max N messages sended ordered by sendAt time
		"""
		messagesObj = Message.objects.filter(conversation=self).order_by('-sendAt')[:n]
		messagesJson = [msg.toJson() for msg in messagesObj]

		return messagesJson

	def addMessage(self, sender: User, content: str):
		message = Message(conversation=self, sender=Profile.getUserFromUsername(sender), content=content)
		message.save()

	@staticmethod
	def getConversation(peopleName: list):
		"""
		This will check if there is a conversation between the person passed,
		if there isn't then it created it and return it.
		"""
		peopleUser = [Profile.getUserFromUsername(name) for name in peopleName]
		if None in peopleName:
			return None

		existingConversation = Conversation.objects.filter(participants__in=peopleUser).first()
		
		if not existingConversation:
			existingConversation = Conversation.objects.create()
			existingConversation.participants.set(peopleUser)
			existingConversation.save()
		return (existingConversation)
	
	@staticmethod
	def consumer_appendToConversation(_from: str, _to: str, _content: str):
		required = ['from', 'to', 'content']

		sender = Profile.getUserFromUsername(_from)
		target = Profile.getUserFromUsername(_to)
		content = _content

		# Prevent from empty values
		if not sender or not target or not content :
			return
		if not target.profile.is_friend(sender):
			return
		
		conversation = Conversation.getConversation([sender, target])
		if not conversation:
			return
		conversation.addMessage(sender, content)

class Message(models.Model):
	conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='conversation', blank=True)
	sender = models.ForeignKey(User, blank=False, on_delete=models.CASCADE)
	content = models.TextField(max_length=settings.MESSAGE_LENGTH_MAX, blank=False)
	sendAt = models.DateTimeField(auto_now_add=True)

	def toJson(self):
		return {
			'sender': self.sender.username,
			'content': self.content,
			'sendAt': self.sendAt
		}