from django.apps import AppConfig

registered_contract = [ 'matchscore' ]

class BlockchainConfig(AppConfig):
	default_auto_field = 'django.db.models.BigAutoField'
	name = 'blockchain'

	def ready(self) -> None:
		from .models import SmartContracts
		import sys
		contracts = SmartContracts.getAllContracts()
		# contracts_name = [c.name for c in contracts]
		# print(f'Les noms des contrats : {contracts}', file=sys.stderr)

		pass
