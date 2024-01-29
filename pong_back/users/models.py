from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from django.http import HttpResponse, HttpRequest
from tools.responses import tResponses
from django.conf import settings
from uuid import uuid4
import os

# instance corresponding to the instanse of imagefield automaticcly passed
def generateUniqueImageID(instance, filename):
	if (filename == "pokemon.png"):
		return (filename)
	
	extension = filename.split('.')[-1]
	uniqueId = str(uuid4())
	finalPath = f'{uniqueId}.{extension}'

	if (os.path.exists(f'{settings.MEDIA_ROOT}{finalPath}')):
		return generateUniqueImageID(filename)
	print(finalPath)
	return finalPath


class Profile(models.Model):
	user: User = models.OneToOneField(User, on_delete=models.CASCADE, blank=False, primary_key=True)
	friends = models.ManyToManyField(User, related_name="friends", blank=True)
	pendingFriendsFrom = models.ManyToManyField(User, related_name="pendingFriendsFrom", symmetrical=False, blank=True)
	is_2fa = models.BooleanField(default=False)
	profilePicture = models.ImageField(upload_to=generateUniqueImageID, default="default_e04bed5e-0be0-441b-9616-41f09b84aaf7.png", blank=True) #have to be resize
	blockedUsers = models.ManyToManyField(User, related_name="blockedUsers", symmetrical=False, blank=True)

	# shortcut to user #
	def getUsername(self):
		return (self.user.username)
	
	def getEmail(self):
		return (self.user.email)
	
	def getManyToTab(self, many) -> []:
		tab = []
		for value in many.all():
			tab.append(value.username)
		return tab
	
	def toJson(self, restricted=True):
		public = {
			"username" : self.user.username,
			"profilePicture" : self.profilePicture.url,
			"userStats" : self.user.stats.toJson()
		}

		if (restricted):
			return (public)
		else:
			private = {
				"email": self.user.email,
				"is_2fa": self.is_2fa,
				"friends": self.getManyToTab(self.friends),
				"pendingFriendsFrom": self.getManyToTab(self.pendingFriendsFrom),
				"blockedUsers": self.getManyToTab(self.blockedUsers)
				}
			
			return (public | private)
	
	def changePassword(self, request: HttpRequest) -> HttpResponse:
		from .forms import PasswordForm
		form: PasswordForm = PasswordForm(request.POST)

		if (form.is_valid()):
			actualPassword = form.cleaned_data['actualPassword']
			password = form.cleaned_data['newPassword']

			# Security check to request the password changes !
			if not (self.user.check_password(actualPassword)):
				return (tResponses.FORBIDDEN.request(message="Password do not match !"))

			# OK - Now able to change the password !
			self.user.set_password(password)
			self.user.save()
			update_session_auth_hash(request, self.user)
			return (tResponses.OKAY.request("Password successfully changed !"))
		else:
			return (tResponses.BAD_REQUEST.request(message="Form isn't valid !"))
		
	def changeProfilePicture(self, request: HttpRequest) -> HttpResponse:
		from .forms import PictureForm
		
		oldPicture = self.profilePicture.path
		form: PictureForm = PictureForm(request.POST, request.FILES, instance=self)

		if (form.is_valid()):
			if (os.path.exists(oldPicture)):
				os.remove(oldPicture)

			form.save()
			return (tResponses.OKAY.request(message="Profile picture successfully changed !"))
		else:
			return (tResponses.BAD_REQUEST.request(message="Image is not valid !"))