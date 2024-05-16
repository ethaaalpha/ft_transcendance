def isOtherKeysInList(listKey, tab) -> bool:
	""" 
	This function will return 1 if there is another key than keys present in listKey
	but there could be less keys presents than the listkey dict !
	"""
	for element in tab.keys():
		if element not in listKey:
			return True
	return False

def areKeysFromList(listKey, tab) -> bool:
	tabKeys = tab.keys()

	for element in listKey:
		if element not in tabKeys:
			return True
	return False

def is42(username: str):
	return True if username[:3] == "42_" else False