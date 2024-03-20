from web3 import Web3
import socket
from solcx import compile_source
import sys

def getIp(domain):
	ip_address = socket.gethostbyname(domain)
	return ip_address

class Web3Interactions:

	def __init__(self) -> None:
		self.link = Web3(Web3.HTTPProvider(f'http://{getIp('geth')}:8545'))

	def create_contract(self, solc_file: str):
		with open(solc_file, 'r') as file:
			data = file.read()

		compiled_solc = compile_source(data, ['abi', 'bin'])
		contract_interface = compiled_solc.popitem()
		bytecode = contract_interface['bin']
		abi = contract_interface['abi']
		self.link.eth.default_account = self.link.eth.accounts[0]

		contract = self.link.eth.contract(abi=abi, bytecode=bytecode)
		tx_hash = contract.constructor().transact()
		tx_receipt = self.link.eth.wait_for_transaction_receipt(tx_hash)
		print(tx_receipt, file=sys.stderr)

		return ()
	