from django.db import models
from django.contrib.auth.models import User

class Stats(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, blank=False, primary_key=True)
	numberOfVictory = models.PositiveBigIntegerField(default=0)
	numberOfLoses = models.PositiveBigIntegerField(default=0)
	numberOfTournament = models.PositiveBigIntegerField(default=0)
	# matchHistory to do and to design the data stats provide by this thing !

	def addResult(self, hasWin: bool):
		if hasWin:
			self.numberOfVictory += 1
		else:
			self.numberOfLoses += 1
		self.save()
	
	def addTournament(self):
		self.numberOfTournament += 1
		self.save()

	def toJson(self):
		json = {
			"numberOfVictory": self.numberOfVictory,
			"numberOfLoses": self.numberOfLoses,
			"numberOfTournament": self.numberOfTournament
		}
		return (json)