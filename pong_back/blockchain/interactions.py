from web3 import Web3
from web3.middleware import geth_poa_middleware
import socket
import solcx

def getIp(domain):
	ip_address = socket.gethostbyname(domain)
	return ip_address

class Web3Interactions:
	def __init__(self) -> None:
		self.link = Web3(Web3.HTTPProvider(f'http://{getIp('geth')}:8545'))
		self.link.middleware_onion.inject(geth_poa_middleware, layer=0)
		self.link.eth.default_account = self.link.eth.accounts[0] # Select account to provide liquidity to upload

	def loads(self):
		if len(solcx.get_installed_solc_versions()) == 0:
			solcx.install_solc(version='0.8.19')
		solcx.set_solc_version(version='0.8.19')
		solcx.import_installed_solc()

	def getW3(self) -> Web3:
		return self.link