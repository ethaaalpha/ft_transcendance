
# This function will return 1 if there is another key than keys present in listKey
# but there could be less keys presents than the listkey dict !
def isOtherKeysInList(listKey, tab) -> bool:
	for element in tab.keys():
		if element not in listKey:
			return True
	return False

# This function will return 1 if a key present in the list is not present in dict
def areKeysFromList(listKey, tab) -> bool:
	tabKeys = tab.keys()

	for element in listKey:
		if element not in tabKeys:
			return True
	return False

def is42(username: str):
	return True if username[:3] == "42_" else False