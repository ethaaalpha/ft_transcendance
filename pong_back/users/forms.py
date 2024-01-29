from django import forms
from django.forms import ModelForm
from .models import Profile

class PasswordForm(forms.Form):
	actualPassword = forms.CharField(widget=forms.PasswordInput(), required=True)
	newPassword = forms.CharField(widget=forms.PasswordInput(), max_length=32, required=True)

class PictureForm(ModelForm):
	class Meta:
		model = Profile
		fields = [ "profilePicture" ]
