from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.models import User
from tools.responses import tResponses
from tools.functions import isOtherKeysInList, areKeysFromList
from users.models import Profile
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import logout as djangoLogout
from uuid import uuid4
from requests.models import PreparedRequest
import requests


"""
	/auth/login
	/auth/logout
	/auth/reset-password
	/auth/register
	/auth/callback
"""

def login(request: HttpRequest):
	if (request.method == "POST"):
		"""
		/auth/login?mode=intern
		/auth/login?mode=42

		mode must be present to perfom the request !
		"""
		if (areKeysFromList(['mode'], request.GET)):
			return tResponses.BAD_REQUEST.request("Missing parameters !")
		if isOtherKeysInList(['mode'], request.GET):
			return tResponses.BAD_REQUEST.request("Extra parameters found !")
		mode = request.GET['mode']


		match mode:
			case "42":
				# possiblement à modifier !
				params = {
					"client_id" : settings.API_UUID,
					"redirect_uri" : settings.API_CALLBACK,
					"response_type" : "code",
					"state" : str(uuid4())
				}
				request: PreparedRequest = PreparedRequest()
				request.prepare_url(settings.API_URL, params)
				return redirect(request.url) # Ici redirige vers la page de 42 pour l'authentification !
			case "intern":
				return ()
			case _:
				return tResponses.BAD_REQUEST.request("Unrecognize authentification mode !")
	else:
		return tResponses.BAD_REQUEST.request("Get request not supported here !")

def callback(request: HttpRequest):
	if (request.method == "GET"):
		params = ["code", "state"]

		if (areKeysFromList(params, request.GET) or request.GET.get('error')):
			return tResponses.BAD_REQUEST.request("Authentification error !")
		
		code = request.GET['code']
		state = request.GET['state']

		paramsApi = {
			"grant_type" : "authorization_code",
			"client_id" : settings.API_UUID,
			"client_secret" : settings.API_SECRET,
			"code" : code,
			"redirect_uri" : settings.API_CALLBACK,
			"state" : state,
		}
		response = requests.post(settings.API_TOKEN, params=paramsApi).json()
		if "access_token" in response:
			print (response["access_token"]) # CONTINUER ICI
		else:
			return tResponses.BAD_REQUEST.request("Authentification error !")
	else:
		return tResponses.BAD_REQUEST.request("Post request not supported here !")

def logout(request: HttpRequest):
	if (request.method == "POST"):
		djangoLogout(request)
		return tResponses.OKAY.request("You were successfully disconnected !")
	else:
		return tResponses.BAD_REQUEST.request("Get request not supported here !")
	
def reset_password(request: HttpRequest):
	if (request.method == "POST"):
		return tResponses.OKAY.request("TU AS FAIT UN RESET_PASSWORD POST")
	else:
		return tResponses.BAD_REQUEST.request("Get request not supported here !")

def register(request: HttpRequest):
	if (request.method == "POST"):
		return tResponses.OKAY.request("TU AS FAIT UN REGISTER POST")
	else:
		return tResponses.BAD_REQUEST.request("Get request not supported here !")
