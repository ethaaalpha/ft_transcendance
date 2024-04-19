from django.db import models
from django.contrib.auth.models import User
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.temp import NamedTemporaryFile
from django.utils.crypto import get_random_string
from django.contrib.auth import update_session_auth_hash, login, authenticate
from django.http import HttpRequest
from django.utils.timezone import now
from tools.responses import tResponses
from django.conf import settings
from uuid import uuid4
from datetime import timedelta
from stats.models import Stats
import os
import requests
import shortuuid

# instance corresponding to the instanse of imagefield automaticcly passed
def generateUniqueImageID(instance, filename, extension=None):
	if (filename == "pokemon.png"):
		return (filename)
	
	if not extension:
		extension = filename.split('.')[-1]
	uniqueId = str(uuid4())
	finalPath = f'{uniqueId}.{extension}'

	if (os.path.exists(f'{settings.MEDIA_ROOT}{finalPath}')):
		return generateUniqueImageID(filename)
	return finalPath

def generatePassword():
	return shortuuid.uuid()[:16]

class Profile(models.Model):
	user: User = models.OneToOneField(User, on_delete=models.CASCADE, blank=False, related_name='Profile', primary_key=True)
	friends = models.ManyToManyField(User, symmetrical=True, blank=True)
	pendingFriendsFrom = models.ManyToManyField(User, related_name="pendingFriendsFrom", symmetrical=False, blank=True)
	profilePicture = models.ImageField(upload_to=generateUniqueImageID, default=settings.DEFAULT_PROFILE_PICTURE_NAME, editable=True)
	blockedUsers = models.ManyToManyField(User, related_name="blockedUsers", symmetrical=False, blank=True)
	lastPasswordChange = models.DateTimeField(default=now, blank=True)
	gameTheme = models.CharField(max_length=64, default='default')
	isPlaying = models.BooleanField(default=False)
	state = models.IntegerField(default=0)
	
	# shortcut to user #
	def getUsername(self):
		return (self.user.username)
	
	def getEmail(self):
		return (self.user.email)
	
	def setPlaying(self, state: bool):
		self.isPlaying = state
		self.save()

	def setState(self, state: int):
		self.state = state
		self.save()

	def getManyToTab(self, many):
		tab = []
		for value in many.all():
			tab.append(value.username)
		return tab
	
	def getPendingFriendTo(self):
		request = Profile.objects.filter(pendingFriendsFrom=self.user).all()
		items = [i.getUsername() for i in request]
		return (items)
	
	def toJson(self, restricted=True):
		public = {
			"username" : self.user.username,
			"profilePicture" : self.profilePicture.name,
			"userStats" : self.user.stats.toJson()
		}

		if (restricted):
			return (public)
		else:
			private = {
				"email": self.user.email,
				"friends": self.getManyToTab(self.friends),
				"pendingFriendsFrom": self.getManyToTab(self.pendingFriendsFrom),
				"pendingFriendsTo": self.getPendingFriendTo(),
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

	# Will check if the passed user is blocked
	def is_block(self, target):
		if isinstance(target, Profile):
			target = target.user
		if target in self.blockedUsers.all():
			return True
		return False
	
	def is_friend(self, target: User):
		if isinstance(target, Profile):
			target = target.user
		if target in self.friends.all():
			return True
		return False
	
	def is_pendingFriend(self, target: User):
		if isinstance(target, Profile):
			target = target.user
		if target in self.pendingFriendsFrom.all():
			return True
		return False
	
	# return 1 in case of failure then 0
	@staticmethod
	def login(request: HttpRequest, username:str, password=None):
		user = Profile.getUserFromUsername(username)

		if not user:
			return 1
		if (password):
			user = authenticate(username=username, password=password)
			if not user:
				return 2
		Profile.createUserOnetoOne(user)
		login(request, user)
		return 0
	
	# return 0 if success then 1 
	@staticmethod
	def login42(request: HttpRequest, username: str, email: str, image: str):
		username = f'42_{username}'
		existing_account = Profile.getUserFromUsername(username)

		if not existing_account: #mean that we want to login
			existing_account = Profile.registerUser(username, email)
			if not existing_account :
				return 1
			# Now retrieving 42 Profile picture
			response = requests.get(image)
			if response.status_code == 200:
				img_temp = NamedTemporaryFile(delete=True)
				img_temp.write(response.content)
				img_temp.flush()
				img = InMemoryUploadedFile(img_temp, None, generateUniqueImageID(None, img_temp.name, image.split('.')[-1]), 'image/jpeg', len(response.content), None)

				existing_account.Profile.profilePicture = img
				existing_account.Profile.save()
				img_temp.close()

		Profile.createUserOnetoOne(existing_account)
		login(request, existing_account)
		return (0)
	
	# This will create all the related content of the user like Profile, Stats and others
	@staticmethod
	def createUserOnetoOne(user: User):
		if not hasattr(user, 'Profile'):
			profile = Profile(user=user)
			profile.save()
		if not hasattr(user, 'stats'):
			stats = Stats(user=user)
			stats.save()

	# Return an user on success or an None object
	@staticmethod
	def registerUser(username: str, email: str, password=None) -> User:
		target = Profile.getUserFromUsername(username)

		if target:
			return None
		if not password:
			password = get_random_string(length=32)

		newUser = User.objects.create_user(username, email, password)
		newUser.save()
		Profile.createUserOnetoOne(newUser)
		return newUser
	
	@staticmethod
	def getUserFromUsername(username: str) -> User | None:
		user = User.objects.filter(username=username).first()
		return user if user else None