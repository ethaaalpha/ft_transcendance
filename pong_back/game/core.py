import game.consumers as C
from .models import Match
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
import sys

class Game:
    def __init__(self, matchId, p1, p2):
        self.matchId = matchId
        self.speedBall = 0.2
        self.p1 = p1
        self.p2 = p2
        self.score = [0, 0]
        self.p1Pos = [0, -13, 0]
        self.p2Pos = [0, 13, 0]
        self.ballPos = [0, 0, 0]
        self.ballVec = [0, -1, 0]
        self.goalP = False
        self.ready = [False, False]
        self.sent = False

    async def addVec(self, vec1, vec2):
        for i in range(len(vec1)):
            vec1[i] += (vec2[i])
        if self.speedBall < 0.6:
            self.speedBall += 0.0002
    async def makeReady(self, name):
        if (name == self.p1):
            self.ready[0] = True
        elif (name == self.p2):
            self.ready[1] = True
        if(self.ready[0] == True and self.ready[1] == True):
            self.goalP = False

    async def disconnect(self, username):
        print(username, file=sys.stderr)
        print(self.p1, file=sys.stderr)
        if username == self.p1:
            self.score[0] = 0
            self.score[1] = 10
            await self.sendResult()
        elif username == self.p2:
            self.score[0] = 10
            self.score[1] = 0
            await self.sendResult()

    async def updateBall(self, data: dict):
        if self.ready[0] == True and self.ready[1] == True:
            if (data['p1Pos']):
                self.p1Pos = data['p1Pos']
            if (data['p2Pos']):
                self.p2Pos = data['p2Pos']
            if data['p1Pos']:
                self.ballVec = data['ballVec']
            if (data['p1Pos']):
                await self.addVec(self.ballPos, self.ballVec)
            if (self.ballPos[1] > 13.5):
                await self.goal(0)
            if (self.ballPos[1] < -13.5):
                await self.goal(1)
            await C.GameConsumer.sendMessageToConsumer(self.matchId, self.toJson(), 'move')
        if self.score[0] >= 5 or self.score[1] >= 5:
            await self.sendResult()

    @database_sync_to_async
    def sendResult(self):
        if self.sent == False:
            match = Match.getMatch(id = self.matchId)
            match.finish((self.score[0], self.score[1]))   
            async_to_sync(C.GameConsumer.sendMessageToConsumer)(self.matchId, {}, "end")
            self.sent = True
            
        
    async def goal(self, i):
        self.score[i] += 1
        self.ballPos = [0, 0, 0]
        self.ready = [False, False]
        self.speedBall = 0.2
        self.goalP = True

    def toJson(self):
        return {
			'score': self.score,
			'p1Pos': self.p1Pos,
			'p2Pos': self.p2Pos,
            'ballPos': self.ballPos,
            'ballVec': self.ballVec,
            'speedBall': self.speedBall,
            'goalP': self.goalP
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
        return GameMap._gameMap.get(matchId)
    
    @staticmethod
    def getMatchID(username):
        for val in GameMap._gameMap.values():
            if val.p1 == username or val.p2 == username:
                return (val.matchId)
        return None
        
    
        
        

        