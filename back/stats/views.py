from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.models import User
from tools.responses import tResponses
from tools.functions import isOtherKeysInList, areKeysFromList
from datetime import datetime
from game.models import Match
from users.models import Profile
	
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
			user=username
		"""
		keysList: list = ['since', 'user']
		if (areKeysFromList(keysList, request.GET) or isOtherKeysInList(keysList, request.GET)):
			return tResponses.BAD_REQUEST.request("Invalid or missing parameter found !")

		dateSince = request.GET['since']
		targetUser = request.GET['user']

		targetUser = Profile.getUserFromUsername(targetUser)
		if not targetUser:
			return tResponses.BAD_REQUEST.request("This user do not exist !")
		if not dateSince:
			return tResponses.BAD_REQUEST.request("Error in date format !")
		
		return JsonResponse({'matchs': Match.historic(targetUser, dateSince)})
	else:
		tResponses.BAD_REQUEST.request("POST requests are not supported here !")