from django.db import models
from web3 import Web3
from .interactions import Web3Interactions
from threading import Thread
import solcx
import sys

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
		Return Contract or None in case of blockchain fail !
		"""
		w3Int: Web3Interactions = Web3Interactions()
		w3Int.loads()
		w3: Web3 = w3Int.getW3()


		# Compile using py-solc-x integration !
		comp = ContractBuilder.compile()
		abi = comp[0] # Interface to interact with the contract
		bytecode = comp[1] # Bytecode of the contract

		# Require transaction for the contract and wait for the receipt (validation)
		contract = w3.eth.contract(abi=abi, bytecode=bytecode)
		tx_hash = contract.constructor(score[0] & 0xFF, score[1] & 0xFF).transact()  # Parameters required by the Contract (constructor method)
		tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

		if (tx_receipt.status == 0): # Check if transaction was reverted !
			return match_instance.setScore(None)
		
		# Create contract object in database and link it to the match !
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
		w3Int: Web3Interactions = Web3Interactions()
		w3: Web3 = w3Int.getW3()
		contract = w3.eth.contract(abi=self.abi, address=self.address)
		result = contract.functions.getScores().call()
		return (result)