from django.contrib.auth.models import User
from game.models import Room, Mode
import sys

class Matchmaking:
	_stack = []

	@staticmethod
	def addPlayerToQueue(user: User):
		if user not in Matchmaking._stack:
			Matchmaking._stack.append(user)

		if len(Matchmaking._stack) >= 2: # Run when match 2 players
			playerA: User = Matchmaking._stack[-1]
			playerB: User = Matchmaking._stack[-2]

			Matchmaking._stack.pop()
			Matchmaking._stack.pop()

			room: Room = Room.createRoom(playerA, Mode.CLASSIC)
			# this is supposed to start to start the room
			if (room.addPlayer(playerB)) == 0:
				room.sendMessageNext(playerA, playerB)
				room.sendMessageNext(playerB, playerA)