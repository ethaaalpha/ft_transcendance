from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import HttpResponse

class Profile(models.Model):
	user: User = models.OneToOneField(User, on_delete=models.CASCADE, blank=False, primary_key=True)
	friends = models.ManyToManyField(User, related_name="friends", blank=True)
	pending_friends_from = models.ManyToManyField(User, related_name="pending_friends_from", symmetrical=False, blank=True)
	is_2fa = models.BooleanField(default=False)
	profile_picture = models.ImageField(upload_to=f"users/", default="pokemon.png", blank=True) #have to be resize

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
			"profile_picture" : self.profile_picture.url
		}

		if (restricted):
			return (public)
		else:
			friends = self.getManyToTab(self.friends)
			pending_friends_from = self.getManyToTab(self.pending_friends_from)

			private = {
				"email": self.user.email,
				"is_2fa": self.is_2fa,
				"friends": friends,
				"pending_friends_from": pending_friends_from
				}
			return (public | private)