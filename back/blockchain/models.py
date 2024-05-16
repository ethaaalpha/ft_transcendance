from django.db import models
from web3 import Web3
from .interactions import Web3Interactions
from threading import Thread
import solcx, sys

class ContractBuilder():
	@staticmethod
	def compile():
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
	
	@staticmethod
	def create(score, match_instance):
		"""
		Return Contract solc-x compiler or None in case of blockchain fail !
		fail: reverted transaction or timeout block
		"""
		w3Int: Web3Interactions = Web3Interactions()
		w3Int.loads()
		w3: Web3 = w3Int.getW3()

		comp = ContractBuilder.compile()
		abi = comp[0]
		bytecode = comp[1]

		contract = w3.eth.contract(abi=abi, bytecode=bytecode)

		try:
			tx_hash = contract.constructor(score[0] & 0xFF, score[1] & 0xFF).transact() 
			tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=240)
		except:
			return match_instance.setScore(None)

		if (tx_receipt.status == 0): 
			return match_instance.setScore(None)
		
		contract_m = Contract(abi=abi, address=tx_receipt['contractAddress'])
		contract_m.save()
		match_instance.setScore(contract_m)
	
	@staticmethod
	def threaded(score, match_instance):
		"""
		Create thread because it could be long to valid the transaction so avoid to block system !
		"""
		thread = Thread(target=ContractBuilder.create, args=(score, match_instance))
		thread.start()


class Contract(models.Model):
	abi = models.JSONField(blank=False)
	address= models.TextField(blank=False, primary_key=True)

	def getScore(self):
		try:
			w3Int: Web3Interactions = Web3Interactions()
			w3: Web3 = w3Int.getW3()
			contract = w3.eth.contract(abi=self.abi, address=self.address)
			result = contract.functions.getScores().call()
			return (result)
		except:
			return (0,0)
		