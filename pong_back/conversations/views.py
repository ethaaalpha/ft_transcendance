from django.http import HttpRequest, HttpResponse
from users.models import Profile
from django.contrib.auth.models import User
from tools.responses import tResponses
from tools.functions import isOtherKeysInList
	
# Entrypoint to interact with the conversations part !
def entryPoint(request: HttpRequest) -> HttpResponse:
	return (tResponses.OKAY.request("vous etes sur les conversations !"))