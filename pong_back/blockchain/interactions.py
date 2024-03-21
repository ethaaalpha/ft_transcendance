from web3 import Web3
from web3.middleware import geth_poa_middleware
import socket
import solcx
import sys

def getIp(domain):
	ip_address = socket.gethostbyname(domain)
	return ip_address

class Web3Interactions:

	def __init__(self) -> None:
		self.link = Web3(Web3.HTTPProvider(f'http://{getIp('geth')}:8545'))
		self.link.middleware_onion.inject(geth_poa_middleware, layer=0)

	def create_contract(self, solc_file: str):
		solcx.install_solc(version='0.8.19')
		solcx.set_solc_version(version='0.8.19')
		evm_version = self.link.client_version
		print(evm_version, file=sys.stderr)

		with open(solc_file, 'r') as file:
			data = file.read()
		solcx.import_installed_solc()
		compiled_solc = solcx.compile_source(data, ['abi', 'bin'])
		print(compiled_solc, file=sys.stderr)

		contract_id, contract_interface = compiled_solc.popitem()
		bytecode = contract_interface['bin']
		abi = contract_interface['abi']
		self.link.eth.default_account = self.link.eth.accounts[0]

		contract = self.link.eth.contract(abi=abi, bytecode=bytecode)
		tx_hash = contract.constructor(1 & 0xFF, 1 & 0xFF).transact()
		tx_receipt = self.link.eth.wait_for_transaction_receipt(tx_hash)
		print(tx_receipt, file=sys.stderr)

		return ()
	