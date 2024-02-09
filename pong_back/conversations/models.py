from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils.timezone import now
from users.models import Profile

class Conversation(models.Model):
	participants = models.ManyToManyField(User, related_name='participants', blank=False)
	createdAt = models.DateTimeField(auto_now_add=True)
	
	def getMessages(self, n = 10):
		"""
			Return the last max N messages sended ordered by sendAt time
		"""
		return (Message.objects.filter(conversation=self).order_by('sendAt')[:n])

	def addMessage(self, sender: User, content: str):

		message = Message(conversation=self, sender=Profile.getUserFromUsername(sender), content=content)
		message.save()

	@staticmethod
	def getConversation(peopleName: list):
		"""
		This will check if there is a conversation between the person passed,
		if there isn't then it created it and return it.
		"""
		peopleUser = [Profile.getUserFromUsername[name] for name in peopleName]
		if None in peopleName:
			return None

		existingConversation = Conversation.objects.filter(participants=peopleUser).first()
		
		if not existingConversation:
			existingConversation = Conversation(participants=peopleUser)
			existingConversation.save()
		return (existingConversation)
	
	@staticmethod
	def consumer_appendToConversation(data: str):
		required = ['from', 'to', 'content']

		# security checks of values inside of Websocket send
		if any(need not in data.keys() for need in required):
			return
		if any(key not in required for key in data.keys()):
			return

		sender = Profile.getUserFromUsername(data['from'])
		target = Profile.getUserFromUsername(data['to'])
		content = data['content']

		# Prevent from empty values
		if not sender or not target or not content :
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