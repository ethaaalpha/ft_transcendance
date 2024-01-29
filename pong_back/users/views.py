from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from .decorators import logged_required, owner_required
from .models import Profile
from .forms import PasswordForm
from django.contrib.auth.models import User
from tools.responses import tResponses

# Will transmit some data of an user applying the filter
def profile(request: HttpRequest, username: str, filter=None) -> HttpResponse:
	user: User = User.objects.filter(username=username).first()
	restricted = False if (user == request.user) else True

	if (user):
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
	
# Entrypoint to request some data
def getData(request: HttpRequest):
	if (request.method == "GET"):
		"""
		Username is not mandatory (if empty -> current session)
		Filter is not mandatory (if empty -> global data returned)
		"""
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

def postData(request: HttpRequest, filter: str) -> HttpResponse:
	userProfile: Profile = request.user.profile

	match filter:
		case "password":
			return (userProfile.changePassword(request))
		case "profilePicture":
			return (userProfile.changeProfilePicture(request))
		case _:
			return (tResponses.BAD_REQUEST.request())
