from django.http import HttpRequest, HttpResponse, JsonResponse
from tools.responses import tResponses
from tools.functions import isOtherKeysInList, areKeysFromList
from datetime import datetime
from game.models import Match
from django.core.exceptions import ValidationError
from django.utils.dateparse import parse_datetime
from users.models import Profile
import sys
	
def strToDate(date: str):
	try:
		if not parse_datetime(date):
			return False
	except ValidationError:
		return False
	return True

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

		if not (strToDate(dateSince)):
			return tResponses.BAD_REQUEST.request("Bad date format !")
		targetUser = Profile.getUserFromUsername(targetUser)
		if not targetUser:
			return tResponses.BAD_REQUEST.request("This user do not exist !")
		if not dateSince:
			return tResponses.BAD_REQUEST.request("Error in date format !")
		
		return JsonResponse({'matchs': Match.historic(targetUser, dateSince)})
	else:
		tResponses.BAD_REQUEST.request("POST requests are not supported here !")