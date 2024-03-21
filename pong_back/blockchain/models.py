from django.db import models
from web3 import Web3
from .interactions import Web3Interactions
import solcx

class Contract(models.Model):
	abi = models.TextField(blank=False)
	bin = models.TextField(blank=False)
	address= models.TextField(default='null')

	def compile(self):
		"""
		Return (abi, bytecode)
		"""
		with open('blockchain/contract.sol', 'r') as file:
			data = file.read()

		compiled_solc = solcx.compile_source(data, ['abi', 'bin'])
		contract_id, contract_interface = compiled_solc.popitem()
		bytecode = contract_interface['bin']
		abi = contract_interface['abi']
	
		return (abi, bytecode)

	def upload(self, score):
		w3Int: Web3Interactions = Web3Interactions()
		w3Int.loads()
		w3: Web3 = w3Int.getW3()
		
		comp = self.compile()
		abi = comp[0]
		bytecode = comp[1]
		
		contract = w3.eth.contract(abi=abi, bytecode=bytecode)
		tx_hash = contract.constructor(score[0] & 0xFF, score[1] & 0xFF).transact()  # Parameters required by the Contract (constructor method)
		tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

		print(tx_receipt)