import sys
from web3 import Web3
from web3.middleware import geth_poa_middleware

def	extract_address(content):
	"""
	Should be in this format
	'Public address of the key:   0x90387a327E52C02C315445c2e19FD6B06Ba91915'
	"""
	l = len(content) - 1
	while (content[l] != ' '):
		l -= 1
	return content[l + 1:len(content)].strip()

def replace(file, a, b):
	f = open(file, "r")
	data = f.read()
	data = data.replace(a, b)

	with open(file, "w") as mf:
		mf.write(data)
	mf.close()
	f.close()
	return ("Success")

def getText(file):
	f = open(file, "r")
	data = f.read()
	f.close()
	return (data)

def blocktest():
	w = Web3(Web3.HTTPProvider('http://localhost:8545'))
	if w.is_connected():
		exit(0)
	exit(1)

def transact(address_to: str):
	# Must be use from GETH Container (inside console)
	url = "http://localhost:8545"

	w3 = Web3(Web3.HTTPProvider(url))
	w3.middleware_onion.inject(geth_poa_middleware, layer=0) # This because POA -> geth 14 Pos

	account = w3.eth.accounts[4]
	amount_in_wei = w3.to_wei(0.4, 'ether')

	transaction = {
		'from': account,
	    'to': address_to,
	    'value': amount_in_wei,
	}
	w3.eth.send_transaction(transaction)
	return (f'Transaction sended to {address_to} | (0.4)')


def main():
	args = sys.argv
	
	match args[1]:
		case 'address':
			return extract_address(getText(args[2]))
		case 'replace':
			return replace(args[2], args[3], args[4])
		case 'test':
			return blocktest()
		case 'transact':
			return transact(args[2])
		case _:
			return ("No match !")

if __name__ == "__main__":
    print(main())

