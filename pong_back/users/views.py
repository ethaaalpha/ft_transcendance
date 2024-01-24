from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse
from .decorators import logged_required, owner_required
from django.contrib.auth.models import User
import tools.responses as tResponses

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
				return (tResponses.HttpResponseNotFound())
		else:
			return (JsonResponse(userProfile))
	else:
		return (tResponses.HttpResponseNotFound())
	
# Entrypoint to request some data
def getData(request: HttpRequest):
	if (request.method == "GET"):
		username = request.GET.get('id')
		filter = request.GET.get('filter')

		if username:
			return (profile(request, username, filter))
		else:
			return (profile(request, request.user.username, filter))
		
	else:
		username = request.POST.get('id')
		filter = request.POST.get('filter')

		if not filter:
			return (tResponses.HttpResponseBadRequest)
		if not username:
			username = request.user.username
		return (postData(request, username))
	
@owner_required
def postData(request: HttpRequest, userOwner: str) -> HttpResponse:
	return (HttpResponse("test"))