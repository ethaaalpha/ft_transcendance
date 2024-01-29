from django.contrib.auth.models import User
from tools.responses import tResponses

def logged_required(function):
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return tResponses.UNAUTHORIZED.request("Logging is requied here !")
        return function(request, *args, **kwargs)
    return wrapped


def owner_required(function):
    """
    Warning
    -------
    To use this @decorator you must use this syntax :
	 * wrapped (request, ownerUsername, *args, **kwargs)
    """
    def wrapped(request, ownerUsername, *args, **kwargs):
        if not (request.user.username == ownerUsername):
            return tResponses.FORBIDDEN.request()
        return function(request, ownerUsername, *args, **kwargs)
    return wrapped