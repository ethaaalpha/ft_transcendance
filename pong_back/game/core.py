import game.consumers as C


class Game:
    def __init__(self, matchId, p1, p2):
        self.matchId = matchId
        self.p1 = p1
        self.p2 = p2
        self.score = [0, 0]
        self.p1Pos = [0, -13, 0]
        self.p2Pos = [0, 13, 0]
        self.ballPos = [0, 0, 0]
        self.ballVec = [0, -1, 0]
    def updateBall(self, data: dict):
        self.score = data['score']
        if (data['p1Pos']):
            self.p1Pos = data['p1Pos']
        if (data['p2Pos']):
            self.p2Pos = data['p2Pos']
        self.ballPos = data['ballPos']
        self.ballVec = data['ballVec']
        C.GameConsumer.sendMessageToConsumer(self.matchId, self.toJson())
        
    def toJson(self):
        return {
			'score': self.score,
			'p1Pos': self.p1Pos,
			'p2Pos': self.p2Pos,
            'ballPos': self.ballPos,
            'ballVec': self.ballVec,
		}
        
class GameMap:
    _gameMap : dict = {}
    
    @staticmethod
    def createGame(matchId, p1, p2):
        GameMap._gameMap[matchId] = Game(matchId, p1, p2)
        
    @staticmethod
    def removeGame(matchId):
        GameMap._gameMap.pop(matchId)
        
    @staticmethod
    def getGame(matchId):
        return GameMap._gameMap[matchId]
    
    @staticmethod
    def getMatchID(username):
        for val in GameMap._gameMap.values:
            if val.p1 == username or val.p2 == username:
                return (val.matchId)
        return None
        
    
        
        

        