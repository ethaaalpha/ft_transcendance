from django import forms

class FriendsFrom(forms.Form):
	action = forms.CharField(required=True, max_length=32)
	username = forms.CharField(required=True, max_length=32)
