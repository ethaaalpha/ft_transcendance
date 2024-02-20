from django.db import models
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.contrib.postgres.fields import ArrayField
from activity.tools import getChannelName
from django.contrib.auth.models import User
from datetime import timedelta
from uuid import uuid4
import shortuuid

def roomIdGenerator():
	uuid = shortuuid.uuid()[:8]
	if Room.objects.filter(id=uuid).exists():
		return roomIdGenerator()
	return uuid

class Match(models.Model):
	host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='host', blank=False)
	invited = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invited', blank=False)
	id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
	duration = models.DurationField(default=timedelta(minutes=0))
	score = ArrayField(models.IntegerField(default=0), size=2)
	link = models.URLField(blank=True)

class Mode(models.TextChoices):
		CLASSIC = '2'
		TOURNAMENT4 = '4'
		TOURNAMENT8 = '8'
		TOURNAMENT10 = '10'
		TOURNAMENT12 = '12'
		TOURNAMENT14 = '14'
		TOURNAMENT16 = '16'

class Room(models.Model):
	# Mode class for the type of the room
	
	"""
	A room is multiples players that choosen to player together
	that means that a room can contain multiples matchs (so it's called a tournament).
	"""
	opponents = models.ManyToManyField(User, related_name='opponents')
	state = models.BooleanField(default=False)
	id = models.CharField(primary_key=True, default=roomIdGenerator, blank=False, max_length=8)
	matchs = models.ManyToManyField(Match, related_name='matchs')
	mode = models.CharField(max_length=30, choices=Mode.choices, blank=False)

	"""
	function a coder
	createRoom()
	joinRoom(user) -> checker si la rooom et pas full
	runRoom(user) -> permet de lancer la room
	getNextMatch(user) -> permet de générer le prochain match !
	"""
	@staticmethod
	def createRoom(owner: User, mode: Mode):
		"""
		This function create a room and return the object !
		Owner will be the first player to join the room
		Mode must be a value from Room.Mode
		"""
		room = Room.objects.create()
		room.opponents.add(owner)
		room.save()
		return room
	
	@staticmethod
	def getRoom(roomId: str):
		"""
		If roomID doesn't exist the value returned is None
		"""
		room = Room.objects.filter(id=roomId).first()
		return (room)
	
	def sendMessageToUser(self, user: User):
		if user in self.opponents:
			channel_layer = get_channel_layer()
			async_to_sync(channel_layer.group_send)(getChannelName(user.username),
				{
					"type" : "send.message",
					"data" : "tu es bien connectê"
				}
			)

	def _runRoom(self, roomId: str):
		if (len(self.opponent) != int(self.mode.value)): #mean that there isn't enought of players
			return
	
	def addPlayer(self, user: User) -> int:
		"""
		Return values
		------
		0: on success
		1: if room already full
		2: on other failures

		Action
		------
		If the room is full then the room is starting !
		"""
		actual = len(self.opponents)
		
		if (actual >= int(self.mode.value)):
			return 1
		if (user in self.opponents):
			return 2
		self.opponents.add(User)
		self.save()

		# function to check if roomReady !
		self._runRoom()
		return 0