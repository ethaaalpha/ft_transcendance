from django.http import HttpResponse

class HttpResponseBadRequest(HttpResponse):
	status_code = 400

class HttpResponseUnauthorized(HttpResponse):
	status_code = 401

class HttpResponseForbidden(HttpResponse):
	status_code = 403

class HttpResponseNotFound(HttpResponse):
	status_code = 404
