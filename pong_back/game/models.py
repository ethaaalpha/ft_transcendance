from django.db import models
from asgiref.sync import async_to_sync
from django.contrib.postgres.fields import ArrayField
from activity.tools import getChannelName
from django.contrib.auth.models import User
from datetime import timedelta
from uuid import uuid4
from coordination.matchmaking import Matchmaking
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
	score = ArrayField(models.IntegerField(default=0), size=2, default=[0, 0])
	link = models.URLField(blank=True)
	state = models.IntegerField(default=0) # 0 waiting, 1 started, 2 finish

	@staticmethod
	def getMatch(id: str):
		return Match.objects.filter(id=id).first()

	@staticmethod
	def create(host: User, invited: User) -> str:
		match = Match.objects.create(host=host, invited=invited)
		return match.id
	
	def addPoint(self, user: User):	
		person = -1
		if (user == self.host):
			person = 0
		elif (user == self.invited):
			person = 1
		else:
			return
		self.score[person] += 1
		self.save()

	def finish(self):
		#need to define duration
		#and generate link to blockchain HERE
		self.state = 2
		self.save()

	def start(self):
		self.state = 1
		self.save()


class Mode(models.TextChoices):
	CLASSIC = '2'
	TOURNAMENT4 = '4'
	TOURNAMENT8 = '8'
	TOURNAMENT10 = '10'
	TOURNAMENT12 = '12'
	TOURNAMENT14 = '14'
	TOURNAMENT16 = '16'

	@staticmethod
	def fromText(modestr: str):
		modestr = modestr.upper()
		for mode in Mode.labels:
			if mode.upper() == modestr:
				return getattr(Mode, modestr)
		return None

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
	createRoom() | OK
	joinRoom(user) -> checker si la rooom et pas full 
	addPlayer(suer) - > OK
	runRoom(user) -> permet de lancer la room
	getNextMatch(user) -> permet de générer le prochain match !
	"""
	
	def sendMessageNext(self, user: User, opponent: User):
		from coordination.consumers import CoordinationConsumer
		if user in self.opponents.all():
			data = {"opponent" : opponent.username}
			CoordinationConsumer.sendMessageToConsumer(user.username, data, 'next')

	def _runRoom(self):
		print(f"la room doit commencer \nVoici les adversaires : {self.opponents.all()}", file=sys.stderr)
		if (self.opponents.count() != int(self.mode)): #mean that there isn't enought of players
			return
		if (int(self.mode) != 2):
			
			return 
		else:
			matchid = Match.create(self.opponents.all()[0], self.opponents.all()[1])
			match = Match.getMatch(matchid)
			match.addPoint(self.opponents.all()[0])
			print("le match est terminé \n", file=sys.stderr)
			return
			# it is a matchmaking
			# lancer la partie voir avec nico !!!!
	
	def removePlayer(self, player: User):
		"""
		Return 0 in case of success then 1
		"""
		if (self.state != 0):
			return 1
		if (player in self.opponents.all()):
			self.opponents.remove(player)
			
			if (self.opponents.count() == 0):
				self.delete()
			else:
				self.save()
			return 0

	def addPlayer(self, player: User) -> int:
		actual = self.opponents.count()
		
		if (actual >= int(self.mode)):
			return ("There is too much player in the room !", False)
		if (player in self.opponents.all()):
			return ("You already joined this room !", False)
		if (Matchmaking.isPlayerInQueue(player)):
			return ("You are already in matchmaking queue !", False)
		self.opponents.add(player)
		self.save()

		# function to check if roomReady !
		self._runRoom()
		return ("You successfully join the room !", True)
	
	@staticmethod
	def createRoom(owner: User, mode = Mode.CLASSIC):
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
	def createRoomConsumer(owner: User, mode = Mode.CLASSIC):
		"""
		This fonction return the room code or an error !
		"""
		if Matchmaking.isPlayerInQueue(owner):
			return ("You are already in matchmaking queue !", False)
		room = Room.createRoom(owner, mode)
		return (room.id, True)
	
	@staticmethod
	def getRoom(roomId: str):
		"""
		If roomID doesn't exist the value returned is None
		"""
		room = Room.objects.filter(id=roomId).first()
		return (room)

	@staticmethod
	def joinRoom(player: User, code: str) -> str:
		targetRoom: Room = Room.getRoom(code)
		if not targetRoom:
			return ("Room is inexisting !", False)
		else:
			return targetRoom.addPlayer(player)

	
	@staticmethod
	def leaveRoom(player: User, code: str) -> str:
		targetRoom: Room = Room.getRoom(code)
		if not targetRoom:
			return ("Room is inexisting !", False)
		else:
			match targetRoom.removePlayer():
				case 1:
					return (f"Room is already launched can't leave !", False)
				case 0: #success !
					return (f"Succefully left the room {code}", True)
	

	@staticmethod
	def disconnectAPlayer(player: User):
		"""
		This will the player from all the waiting room !
		"""
		playerRooms = Room.objects.filter(opponents=player, state=0).all()
		for room in playerRooms:
			room.removePlayer(player)