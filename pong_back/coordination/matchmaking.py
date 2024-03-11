from django.contrib.auth.models import User

class Matchmaking:
	_stack = []

	@staticmethod
	def addPlayerToQueue(user: User) -> str:
		from game.models import Room, Mode
 
		# check is the user is already playing somewhere else !
		if user.profile.isPlaying == True:
			return ("Already inside a game !", False)

		if user not in Matchmaking._stack:
			Matchmaking._stack.append(user)
		else:
			return ("Already inside the queue !", False)

		if len(Matchmaking._stack) >= 2: # Run when match 2 players
			playerA: User = Matchmaking._stack[-1]
			playerB: User = Matchmaking._stack[-2]

			Matchmaking._stack.pop()
			Matchmaking._stack.pop()

			room: Room = Room.createRoom(playerA, Mode.CLASSIC)
			
			# this is supposed to start to start the room
			room.addPlayer(playerB)
		return ("Successfully added to the matchmaking queue !", True)
	
	@staticmethod
	def removePlayerToQueue(user: User) -> str:
		if user in Matchmaking._stack:
			Matchmaking._stack.remove(user)
			return ("Successfully added to the matchmaking queue !", True)
		return ("User weren't in matchmaking !", False)
	
	@staticmethod
	def isPlayerInQueue(user: User) -> bool:
		return True if user in Matchmaking._stack else False