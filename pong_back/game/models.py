from django.db import models
from asgiref.sync import async_to_sync
from django.contrib.postgres.fields import ArrayField
from activity.tools import getChannelName
from django.contrib.auth.models import User
from coordination.consumers import CoordinationConsumer
from datetime import timedelta
from uuid import uuid4
import shortuuid
import sys

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
	state = models.IntegerField(default=0) # 0 waiting, 1 started, 2 finish
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
		room = Room.objects.create(mode=mode.value)
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
	
	def sendMessageNext(self, user: User, opponent: User):
		if user in self.opponents.all():
			data = {"opponent" : opponent.username}
			CoordinationConsumer.sendMessageToConsumer(user.username, data, 'next')

	def _runRoom(self):
		if (self.opponents.count() != int(self.mode)): #mean that there isn't enought of players
			return
		print(f"le match doit commencer \nVoici les adversaires : {self.opponents.all()}", file=sys.stderr)
	
	def removePlayer(self, player: User):
		if (player in self.opponents.all()):
			self.opponents.remove(player)
			
			if (self.opponents.count() == 0):
				self.delete()
			else:
				self.save()

	def addPlayer(self, player: User) -> int:
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
		actual = self.opponents.count()
		
		if (actual >= int(self.mode)):
			return 1
		if (player in self.opponents.all()):
			return 2
		self.opponents.add(player)
		self.save()

		# function to check if roomReady !
		self._runRoom()
		return 0
	
	def joinRoom(self, player: User, code: str):
		targetRoom: Room = Room.getRoom(code)
		# if not targetRoom:
			
		# else:
			#join la room
	
	@staticmethod
	def disconnectAPlayer(player: User):
		"""
		This will the player from all the waiting room !
		"""
		playerRooms = Room.objects.filter(opponents=player, state=0).all()
		for room in playerRooms:
			room.removePlayer(player)