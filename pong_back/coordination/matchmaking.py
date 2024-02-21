from django.contrib.auth.models import User
import sys

class Matchmaking:
	_stack = []

	@staticmethod
	def addPlayerToQueue(user: User):
		from game.models import Room, Mode

		if user not in Matchmaking._stack:
			Matchmaking._stack.append(user)
		else:
			return ("Already inside the queue !")
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
		return ("Successfully added to the matchmaking queue !")
	
	@staticmethod
	def removePlayerToQueue(user: User):
		if user in Matchmaking._stack:
			Matchmaking._stack.remove(user)
			return ("Successfully added to the matchmaking queue !")
		return ("User weren't in matchmaking !")