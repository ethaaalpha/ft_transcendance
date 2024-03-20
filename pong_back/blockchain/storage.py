import json as J
from typing import Final

class ContractStorage:
	fileloc: Final = "/ethereum/storage.json"
	
	@staticmethod
	def create(data):
		with open(ContractStorage.fileloc, 'w+') as file:
			file.write(J.dumps(data))

	@staticmethod
	def contract() -> dict | None:
		try:
			f = open(ContractStorage.fileloc)
		except:
			return None
		else:
			with open(ContractStorage.fileloc, 'r') as file:
				return J.loads(file.read())
