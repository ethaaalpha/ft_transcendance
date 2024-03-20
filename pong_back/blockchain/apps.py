from django.apps import AppConfig

registered_contract = [ 'matchscore' ]

class BlockchainConfig(AppConfig):
	default_auto_field = 'django.db.models.BigAutoField'
	name = 'blockchain'

	def ready(self) -> None:
		from .storage import ContractStorage
		from .interactions import Web3Interactions

		storage = ContractStorage.contract()
		if not storage:
			w = Web3Interactions()
		pass
