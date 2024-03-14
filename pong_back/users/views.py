from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import Profile
from django.contrib.auth.models import User
from tools.responses import tResponses
from tools.functions import isOtherKeysInList
	
# Entrypoint to interact with the user part !
def entryPoint(request: HttpRequest) -> HttpResponse:
	if (request.method == "GET"):
		"""
		Username is not mandatory (if empty -> current session)
		Filter is not mandatory (if empty -> global data returned)
		"""
		if (isOtherKeysInList(['id', 'filter'], request.GET)):
			return (tResponses.BAD_REQUEST.request("Extra parameters found !"))

		username = request.GET.get('id')
		filter = request.GET.get('filter')

		if username:
			return (profile(request, username, filter))
		else:
			return (profile(request, request.user.username, filter))
		
	else:
		"""
		Filter is mandatory for POST !
		"""
		filter = request.GET.get('filter')
		
		if not filter:
			return (tResponses.BAD_REQUEST.request())
		return (postData(request, filter))

# Will transmit some data of an user applying the filter
def profile(request: HttpRequest, username: str, filter=None) -> HttpResponse:
	user: User = Profile.getUserFromUsername(username)
	restricted = False if (user == request.user) else True

	if (user):
		Profile.createUserOnetoOne(user)
		userProfile: dict = user.profile.toJson(restricted=restricted)

		# Build the filter dictionnary
		if filter:
			if userProfile.get(filter):
				return (JsonResponse({filter: userProfile[filter]}))
			else:
				return (tResponses.NOT_FOUND.request())
		else:
			return (JsonResponse(userProfile))
	else:
		return (tResponses.NOT_FOUND.request())

# Handle post methods
def postData(request: HttpRequest, filter: str) -> HttpResponse:
	userProfile: Profile = request.user.profile

	match filter:
		case "password":
			return (userProfile.form_changePassword(request))
		case "profilePicture":
			return (userProfile.form_changeProfilePicture(request))
		case "email":
			return (userProfile.form_changeEmail(request))
		case _:
			return (tResponses.BAD_REQUEST.request())
