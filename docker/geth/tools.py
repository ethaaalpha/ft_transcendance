import sys
from web3 import Web3

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

def main():
	args = sys.argv
	
	match args[1]:
		case 'address':
			return extract_address(getText(args[2]))
		case 'replace':
			return replace(args[2], args[3], args[4])
		case 'test':
			return blocktest()
		case _:
			return ("No match")

if __name__ == "__main__":
    print(main())

