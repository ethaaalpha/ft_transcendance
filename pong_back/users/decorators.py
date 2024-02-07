from django.contrib.auth.models import User
from tools.responses import tResponses

def logged_required(function):
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return tResponses.UNAUTHORIZED.request("Logging is required here !")
        return function(request, *args, **kwargs)
    return wrapped

def not_logged_required(function):
    def wrapped(request, *args, **kwargs):
        if request.user.is_authenticated:
            return tResponses.UNAUTHORIZED.request("You are already logged !")
        return function(request, *args, **kwargs)
    return wrapped


# def owner_required(function):
#     """
#     Warningw
#     -------
#     To use this @decorator you must use this syntax :
# 	 * wrapped (request, ownerUsername, *args, **kwargs)
#     """
#     def wrapped(request, ownerUsername, *args, **kwargs):
#         if not (request.user.username == ownerUsername):
#             return tResponses.FORBIDDEN.request()
#         return function(request, ownerUsername, *args, **kwargs)
#     return wrapped