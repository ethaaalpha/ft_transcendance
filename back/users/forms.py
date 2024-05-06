from django import forms
from django.forms import ModelForm
from django.contrib.auth.models import User
from .models import Profile
from tools.functions import is42
from tools.responses import tResponses
from django.http import HttpRequest, HttpResponse
from django.conf import settings
from django.contrib.auth import update_session_auth_hash
import os

class EmailForm(forms.Form):
	actualEmail = forms.EmailField(min_length=settings.CONFIG_EMAIL_LENGTH_MIN, max_length=settings.CONFIG_EMAIL_LENGTH_MAX, required=True)
	newEmail = forms.EmailField(min_length=settings.CONFIG_EMAIL_LENGTH_MIN, max_length=settings.CONFIG_EMAIL_LENGTH_MAX, required=True)

class PasswordForm(forms.Form):
	actualPassword = forms.CharField(widget=forms.PasswordInput(), max_length=settings.CONFIG_PASS_LENGTH_MAX, min_length=settings.CONFIG_PASS_LENGTH_MIN, required=True)
	newPassword = forms.CharField(widget=forms.PasswordInput(), max_length=settings.CONFIG_PASS_LENGTH_MAX, min_length=settings.CONFIG_PASS_LENGTH_MIN, required=True)

class ProfilePictureForm(forms.ModelForm):
	class Meta:
		model = Profile
		fields = ['profilePicture']

class GameThemeForm(ModelForm):
	class Meta:
		model = Profile
		fields = ["gameTheme"]

def form_changeGameTheme(profile: Profile, request: HttpRequest):
	form: GameThemeForm = GameThemeForm(request.POST, instance=profile)

	if (form.is_valid()):
		form.save()
		return (tResponses.OKAY.request("Game theme successfully changed !"))
	else:
		return (tResponses.BAD_REQUEST.request("Game theme is not valid !"))


def form_changePassword(profile: Profile, request: HttpRequest) -> HttpResponse:
	form: PasswordForm = PasswordForm(request.POST)

	if (is42(profile.getUsername())):
		return (tResponses.FORBIDDEN.request("User from 42 might always use 42 portal to connect themselves !"))
	
	if (form.is_valid()):
		actualPassword = form.cleaned_data['actualPassword']
		password = form.cleaned_data['newPassword']

		# Security check to request the password changes !
		if not (profile.user.check_password(actualPassword)):
			return (tResponses.FORBIDDEN.request("Password do not match !"))
		
		# OK - Now able to change the password !
		value: HttpResponse = profile.changePassword(password)
		if value.status_code == 200:
			update_session_auth_hash(request, profile.user)
		return (value)
	else:
		return (tResponses.BAD_REQUEST.request("Form isn't valid !"))
		
def form_changeProfilePicture(profile: Profile, request: HttpRequest) -> HttpResponse:
	oldPicture = profile.profilePicture.path
	form: ProfilePictureForm = ProfilePictureForm(request.POST, request.FILES, instance=profile)

	if (form.is_valid()):
		import sys
		if (os.path.exists(oldPicture) and os.path.basename(oldPicture) != settings.DEFAULT_PROFILE_PICTURE_NAME):
			os.remove(oldPicture)		
		form.save()
		return (tResponses.OKAY.request("Profile picture successfully changed !"))
	else:
		return (tResponses.BAD_REQUEST.request("Image is not valid !"))

def form_changeEmail(profile: Profile, request: HttpRequest) -> HttpResponse:
	user: User = request.user
	form: EmailForm = EmailForm(request.POST)

	if (form.is_valid()):
		activeEmail = form.cleaned_data['actualEmail']
		newEmail = form.cleaned_data['newEmail']

		if is42(profile.getUsername()):
			return (tResponses.FORBIDDEN.request("User from 42 can't change their email !"))
		if (activeEmail != user.email):
			return (tResponses.BAD_REQUEST.request("Email do not match with active one !"))
		if (activeEmail == newEmail):
			return (tResponses.BAD_REQUEST.request("Email musn't be the same !"))
		
		user.email = newEmail
		user.save()
		return (tResponses.OKAY.request("You successfully change your mail !"))
	else:
		return (tResponses.BAD_REQUEST.request("Email are not valid !"))