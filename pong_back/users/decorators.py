from django.contrib.auth.models import User
from tools.responses import HttpResponseUnauthorized, HttpResponseForbidden

def logged_required(function):
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponseUnauthorized()
        return function(request, *args, **kwargs)
    return wrapped

def owner_required(function):
    def wrapped(request, ownerUsername, *args, **kwargs):
        if not (request.user.username == ownerUsername):
            return HttpResponseForbidden()
        return function(request, ownerUsername, *args, **kwargs)
    return wrapped