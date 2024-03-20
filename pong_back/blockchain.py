from web3 import Web3
from eth_account import Account
from web3.middleware import geth_poa_middleware


url = "http://geth:8545"
target = "0xFE40B386cb91Eb2bb18C8cb4c67E24D0BB386A7f"


w3 = Web3(Web3.HTTPProvider(url))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

account = w3.eth.accounts[4]
amount_in_wei = w3.to_wei(0.4, 'ether')

chain_id = w3.eth.chain_id
transaction = {
	'from': account,
    'to': target,
    'value': amount_in_wei,
}
w3.eth.send_transaction(transaction)
