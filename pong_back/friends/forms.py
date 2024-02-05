from django import forms
from django.conf import settings

class FriendsFrom(forms.Form):
	action = forms.CharField(required=True, max_length=32)
	username = forms.CharField(required=True, min_length=settings.CONFIG_USER_LENGTH_MIN, max_length=settings.CONFIG_USER_LENGTH_MAX)
