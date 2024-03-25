from django.http import HttpResponse, JsonResponse
from enum import Enum

class tResponses(Enum):
	BAD_REQUEST = 400
	UNAUTHORIZED = 401
	FORBIDDEN = 403
	NOT_FOUND = 404
	OKAY = 200

	def request(self, message="") -> HttpResponse:
		if message != "":
			return (JsonResponse({"message": message}, status=self.value))
		return (HttpResponse(message, status=self.value))