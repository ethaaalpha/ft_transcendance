from django.db import models

class SmartContracts(models.Model):
	name = models.CharField(blank=False)
	address = models.TextField(blank=False, max_length=100, primary_key=True)
	creation_date = models.DateTimeField(auto_now_add=True)
	abi = models.TextField(blank=False)

	@staticmethod
	def getContrat(address: str):
		return (SmartContracts.objects.filter(address=address).first())

	@staticmethod
	def getAllContracts():
		return (SmartContracts.objects.all())