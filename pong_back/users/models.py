from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from django.http import HttpResponse, HttpRequest
from django.utils.timezone import now
from tools.responses import tResponses
from django.conf import settings
from uuid import uuid4
from datetime import timedelta
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
	friends = models.ManyToManyField(User, blank=True, symmetrical=True, related_name="friends")
	pendingFriendsFrom = models.ManyToManyField(User, related_name="pendingFriendsFrom", symmetrical=False, blank=True)
	is_2fa = models.BooleanField(default=False)
	profilePicture = models.ImageField(upload_to=generateUniqueImageID, default="default_e04bed5e-0be0-441b-9616-41f09b84aaf7.png", blank=True) #have to be resize
	blockedUsers = models.ManyToManyField(User, related_name="blockedUsers", symmetrical=False, blank=True)
	lastPasswordChange = models.DateTimeField(default=now, blank=True)
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
	
	def changePassword(self, newPassword):
		delay: timedelta = now() - self.lastPasswordChange

		if (delay < timedelta(minutes=5)):
			return tResponses.FORBIDDEN.request("You must wait at least 5 minutes between each password changes !")
		if (self.user.check_password(newPassword)):
			return tResponses.FORBIDDEN.request("You can't reuse this password !")
		
		self.user.set_password(newPassword)
		self.user.save()
		self.lastPasswordChange = now()
		self.save()
		return (tResponses.OKAY.request("You successfully change your password !"))

	def form_changePassword(self, request: HttpRequest) -> HttpResponse:
		from .forms import PasswordForm
		form: PasswordForm = PasswordForm(request.POST)

		if (form.is_valid()):
			actualPassword = form.cleaned_data['actualPassword']
			password = form.cleaned_data['newPassword']

			# Security check to request the password changes !
			if not (self.user.check_password(actualPassword)):
				return (tResponses.FORBIDDEN.request(message="Password do not match !"))

			# OK - Now able to change the password !
			value: HttpResponse = self.changePassword(password)
			if value.status_code == 200:
				update_session_auth_hash(request, self.user)
			return (value)
		else:
			return (tResponses.BAD_REQUEST.request(message="Form isn't valid !"))
		
	def form_changeProfilePicture(self, request: HttpRequest) -> HttpResponse:
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
	
	# Will check if the passed user is blocked
	def is_block(self, target: User):
		if target in self.blockedUsers.all():
			return True
		return False
	
	def is_friend(self, target: User):
		if target in self.friends.all():
			return True
		return False
	
	def is_pendingFriend(self, target: User):
		if target in self.pendingFriendsFrom.all():
			return True
		return False
	
	# Forbidden to have 42_ at the beggining
	# def form_registerUser()
	def registerUser(username: str, email: str, password=None):
		
