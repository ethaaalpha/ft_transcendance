from django.contrib.auth.models import User
from .matchmaking import Matchmaking
from game.models import Room

def isAvailableToPlay(player: User):
	if (player.profile.isPlaying):
		return ('Already in game !', False)
	if (Matchmaking.isIn(player) == True):
		return ('Already in matchmaking queue !', False)
	id = Room.isInWaitingRoom(player)
	if (id != False):
		return (f'Already waiting to playing in a room (id {id}!', False)
	return ('Available', True)