from django.http import HttpRequest, JsonResponse
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from tools.responses import tResponses
from tools.functions import isOtherKeysInList, areKeysFromList
from django.core.mail import send_mail
from users.models import Profile, generatePassword
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import logout as djangoLogout
from uuid import uuid4
from requests.models import PreparedRequest
from tools.functions import is42
from .forms import RegisterForm, LoginForm, ResetPassForm
import requests

"""
	/auth/login
	/auth/logout
	/auth/reset-password
	/auth/register
	/auth/callback
"""

def login(request: HttpRequest):
	if (areKeysFromList(['mode'], request.GET)):
		return tResponses.BAD_REQUEST.request("Missing parameters !")
	if isOtherKeysInList(['mode'], request.GET):
		return tResponses.BAD_REQUEST.request("Extra parameters found !")
	mode = request.GET['mode']
	if (request.method == "POST"):
		"""
		/auth/login?mode=intern

		mode must be present to perfom the request !
		"""
		match mode:
			case "intern":
				return login_internal(request)
			case _:
				return tResponses.BAD_REQUEST.request("Unrecognized authentification mode !")
	else:
		"""
		/auth/login?mode=42

		This will return the link to connect to 42 
		"""
		match mode:
			case "42":
				# possiblement à modifier !
				params = {
					"client_id" : settings.API_UUID,
					"redirect_uri" : settings.API_CALLBACK,
					"response_type" : "code",
					"state" : str(uuid4())
				}
				request: PreparedRequest = PreparedRequest()
				request.prepare_url(settings.API_URL, params)
				return JsonResponse({'url': request.url})
			case _:
				return tResponses.BAD_REQUEST.request("Unrecognized authentification mode !")
	

# This for internal auth user not 42 users
def login_internal(request: HttpRequest):
	form = LoginForm(request.POST)
	if (form.is_valid()):
		username = form.cleaned_data['username']
		password = form.cleaned_data['password']

		value = Profile.login(request, username, password)
		if value == 2:
			return tResponses.FORBIDDEN.request("Credentials invalid !")
		elif value == 1:
			return tResponses.NOT_FOUND.request("User not found !")
		else:
			return tResponses.OKAY.request(f"You successfully log as {username} !")
	return tResponses.BAD_REQUEST.request("Form isn't valid !")

# Callback handle redirected request form 42 API
def callback(request: HttpRequest):
	if (request.method == "GET"):
		params = ["code", "state"]

		if (areKeysFromList(params, request.GET) or request.GET.get('error')):
			return redirect("/authentification-error")
		
		code = request.GET['code']
		state = request.GET['state']

		paramsApi = {
			"grant_type" : "authorization_code",
			"client_id" : settings.API_UUID,
			"client_secret" : settings.API_SECRET,
			"code" : code,
			"redirect_uri" : settings.API_CALLBACK,
			"state" : state,
		}
		response = requests.post(settings.API_TOKEN, params=paramsApi).json()
		if "access_token" in response:
			header = {"Authorization" : f'Bearer {response['access_token']}'}
			userInfo = requests.get(settings.API_INFO, headers=header).json()

			if (Profile.login42(request, userInfo['login'], userInfo['email'], userInfo['image']['link'])):
				return tResponses.FORBIDDEN.request("You can't log with this account !")
			return redirect("/callback-42")
		else:
			return redirect("/authentification-error")
	else:
		return tResponses.BAD_REQUEST.request("Post request not supported here !")

def logout(request: HttpRequest):
	if (request.method == "POST"):
		djangoLogout(request)
		return tResponses.OKAY.request("You were successfully disconnected !")
	else:
		return tResponses.BAD_REQUEST.request("Get request not supported here !")
	
def reset_password(request: HttpRequest):
	if (request.method == "POST"):
		form = ResetPassForm(request.POST)

		if form.is_valid():
			username = form.cleaned_data['username']
			user = Profile.getUserFromUsername(username)

			if user:
				if (is42(user.username)):
					return tResponses.FORBIDDEN.request("User from 42 must use 42 portal to connect !")
				newPass = generatePassword()
				response = user.Profile.changePassword(newPass)
	
				# send the mail if it's okay !
				if response.status_code == 200:
					email_body_unstriped = render_to_string('reset-password.html', {'username': user.username, 'password': newPass})
					email_subject = 'PokePong -- Password Reset'
					email_body = strip_tags(email_body_unstriped)
					try:
						send_mail(email_subject, email_body, from_email=None, recipient_list=[user.email], html_message=email_body_unstriped)
					except:
						return (tResponses.BAD_REQUEST.request("Mail server is actually down!"))
				return response
			else:
				return tResponses.BAD_REQUEST.request("Form failed !")
		return tResponses.BAD_REQUEST.request("Form isn't valid !")
	else:
		return tResponses.BAD_REQUEST.request("Get request not supported here !")

# This will register the user and authentificate him !
def register(request: HttpRequest):
	if (request.method == "POST"):
		form = RegisterForm(request.POST)

		if form.is_valid():
			username = form.cleaned_data['username']
			email = form.cleaned_data['email']
			password = form.cleaned_data['password']

			if (Profile.getUserFromUsername(username)): #prohibit duplicate user
				return tResponses.FORBIDDEN.request("This username is already used !")
			
			user = Profile.registerUser(username, email, password)
			if not user:
				return tResponses.FORBIDDEN.request("You can't register now, retry later !")
			
			Profile.login(request, username)
			return tResponses.OKAY.request(f'User successfully registered and logged as {username} !')
		return tResponses.BAD_REQUEST.request("Form isn't valid !")
	else:
		return tResponses.BAD_REQUEST.request("Get request not supported here !")