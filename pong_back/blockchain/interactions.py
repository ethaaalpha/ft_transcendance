from web3 import Web3
import socket
import sys

def getIp(domain):
	ip_address = socket.gethostbyname(domain)
	return ip_address

class Web3Interactions:

	def __init__(self) -> None:
		self.link = Web3(Web3.HTTPProvider(f'http://{getIp('geth')}:8545'))
		print(f'vici la connection {self.link.eth.get_balance("0xFE40B386cb91Eb2bb18C8cb4c67E24D0BB386A7f")} \n', file=sys.stderr)

	def create_contract(self, solc_file: str):
		return ()
	