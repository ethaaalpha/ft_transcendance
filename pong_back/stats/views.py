from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.models import User
from tools.responses import tResponses
from tools.functions import isOtherKeysInList, areKeysFromList
from datetime import datetime
from game.models import Match
	
def isDateValid(date):
	return 

def strToDate(date: str):
	format = "%Y-%m-%dT%H:%M:%S.%fZ"

	try:
		return (datetime.strptime(date, format))
	except:
		return None

# Entrypoint to interact with the historic match | stats part !
def entryPoint(request: HttpRequest) -> HttpResponse:
	if (request.method == 'GET'):
		"""
		/dashboard/match?
			since=date
		"""
		actualUser: User = request.user
		keysList: list = ['since']
		if (areKeysFromList(keysList, request.GET) or isOtherKeysInList(keysList, request.GET)):
			return tResponses.BAD_REQUEST.request("Invalid or missing parameter found !")

		dateSince = request.GET['since']
		if not dateSince:
			return tResponses.BAD_REQUEST.request("Error in date format !")
		return JsonResponse({'matchs': Match.historic(actualUser, dateSince)})
	else:
		tResponses.BAD_REQUEST.request("POST requests are not supported here !")