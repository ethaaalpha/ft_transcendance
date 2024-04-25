from django.db import models
from datetime import timedelta
from django.contrib.auth.models import User

class Stats(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, blank=False, primary_key=True)
	numberOfVictory = models.PositiveBigIntegerField(default=0)
	numberOfLoses = models.PositiveBigIntegerField(default=0)
	numberOfTournament = models.PositiveBigIntegerField(default=0)
	traveledDistance = models.PositiveBigIntegerField(default=0)
	averageDuration = models.PositiveIntegerField(default=0) # value in seconds
	averagePong = models.PositiveIntegerField(default=0)
	
	def addResult(self, hasWin: bool):
		if hasWin:
			self.numberOfVictory += 1
		else:
			self.numberOfLoses += 1
		self.save()
	
	def addTournament(self):
		self.numberOfTournament += 1
		self.save()

	def actualize(self):
		from game.models import Match
		"""
		Function use to refresh the actual data !
		"""
		matchHistoric = Match.historic(self.user, '2005-04-19T6:00:00.000Z', 50, True)
		accounted = 0
		data = {'distance': 0, 'duration': 0, 'pong' : 0}
		
		for match in matchHistoric:
			score = match.getScore()
			if score[0] < 0 or score[1] < 0:
				continue
			for key, value in match.data.items():
				data[key] += value
			accounted += 1

		accounted = 1 if accounted == 0 else accounted
		self.traveledDistance = round(data['distance'] / accounted)
		self.averageDuration = round(data['duration'] / accounted)
		self.averagePong = round(data['pong'] / accounted)
		self.save()
		return

	def toJson(self):
		self.actualize()
		json = {
			"numberOfVictory": self.numberOfVictory,
			"numberOfLoses": self.numberOfLoses,
			"numberOfTournament": self.numberOfTournament,
			'traveledDistance': self.traveledDistance,
			'averagePong': self.averagePong,
			'averageDuration': self.averageDuration
		}
		return (json)