from django.shortcuts import render
from django.http import HttpResponse, HttpRequest

# Create your views here.
def index(request: HttpRequest):
	if (request.user.is_authenticated):
		return(render(request, "index.html"))
	return (render(request, 'unlogged.html'))

def game(request: HttpRequest):
	return (render(request, 'game.html'))