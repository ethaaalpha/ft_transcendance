from django.contrib.auth.models import User
import sys

class Matchmaking:
	_stack = []

	@staticmethod
	def isIn(user: User) -> bool:
		if user in Matchmaking._stack:
			return True
		return False

	@staticmethod
	def addPlayerToQueue(user: User) -> tuple:
		from game.models import Room, Mode
		from coordination.tools import isAvailableToPlay

		check = isAvailableToPlay(user)
		if not (check[1]):
			return check
		Matchmaking._stack.append(user)

		if len(Matchmaking._stack) >= 2:
			playerA: User = Matchmaking._stack[-1]
			playerB: User = Matchmaking._stack[-2]

			Matchmaking._stack.pop()
			Matchmaking._stack.pop()

			room: Room = Room.createRoom(playerA, Mode.CLASSIC)
			
			room.addPlayer(playerB)
		return ("Successfully added to the matchmaking queue !", True)
	
	@staticmethod
	def removePlayerToQueue(user: User) -> tuple:
		if user in Matchmaking._stack:
			Matchmaking._stack.remove(user)
			return ("Successfully added to the matchmaking queue !", True)
		return ("User weren't in matchmaking !", False)
	
	@staticmethod
	def isPlayerInQueue(user: User) -> bool:
		return True if user in Matchmaking._stack else False