from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
import shortuuid

def roomIdGenerator():
	uuid = shortuuid.uuid(len=8)
	if Room.objects.filter(id=uuid).exists():
		return roomIdGenerator()
	return uuid

class Match(models.Model):
	host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='host', blank=False)
	invited = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invited', blank=False)
	id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
	# duration = models.DurationField()
	# link = models.URLField()

class Room(models.Model):
	"""
	A room is multiples players that choosen to player together
	that means that a room can contain multiples matchs (so it's called a tournament).
	"""
	opponents = models.ManyToManyField(User, related_name='opponents')
	state = models.BooleanField(default=False)
	id = models.CharField(primary_key=True, default=roomIdGenerator, blank=False, max_length=8)
	matchs = models.ManyToManyField(Match, related_name='matchs')
	# score = models.ArrayField installer postgresql + configurer
	# type = models.CharField()

	@staticmethod
	def createRoom(owner: User):
		"""
		This function create a room and return the object !
		Owner will be the first player to join the room
		"""
		room = Room.objects.create()
		room.opponents.add(owner)
		room.save()
		return room
	
	class WebSocketConnection(models.Model):
		user = models.ForeignKey(User, on_delete=models.CASCADE)
		channel_name = models.CharField(max_length=255)
		consumer_name = models.CharField(max_length=255)
		def __str__(self):
			return f"{self.user.username}'s WebSocket Connection"
	# def addPlayer(roomId: str):
