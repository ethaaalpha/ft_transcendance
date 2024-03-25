from django.contrib.auth.models import User
from .matchmaking import Matchmaking
from activity.status import Status

def isAvailableToPlay(player: User):
	from game.models import Room
	if (player.profile.isPlaying):
		return ('Already in game !', False)
	if (Matchmaking.isIn(player) == True):
		return ('Already in matchmaking queue !', False)
	id = Room.isInWaitingRoom(player)
	if (id != False):
		return (f'Already waiting to playing in a room ({id})!', False)
	return ('Available', True)

def setInMatch(player: User):
	player.profile.setPlaying(True)
	Status.inGame(player)

def setOutMatch(player: User):
	player.profile.setPlaying(False)
	Status.leaveGame(player)