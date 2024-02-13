from django.http import HttpRequest, HttpResponse, JsonResponse
from users.models import Profile
from django.contrib.auth.models import User
from conversations.models import Conversation
from tools.responses import tResponses
from tools.functions import isOtherKeysInList, areKeysFromList
	
# Entrypoint to interact with the conversations part !
def entryPoint(request: HttpRequest) -> HttpResponse:
	if (request.method == 'GET'):
		"""
		/dashboard/conversations?
			with=target
		"""
		actualUser: User = request.user
		keysList: list = ['with']
		if (areKeysFromList(keysList, request.GET) or isOtherKeysInList(keysList, request.GET)):
			return tResponses.BAD_REQUEST.request("Invalid or missing parameter found !")

		target = Profile.getUserFromUsername(request.GET['with'])
		if not target:
			return tResponses.NOT_FOUND.request("This user do not exist !")
		if not target.profile.is_friend(actualUser):
			return tResponses.FORBIDDEN.request("This user isn't your friend !")
		
		messages = Conversation.getConversation([actualUser, target]).getMessages(n = 50)
		return JsonResponse({'messages' : messages})
	else:
		tResponses.BAD_REQUEST.request("POST requests are not supported here !")