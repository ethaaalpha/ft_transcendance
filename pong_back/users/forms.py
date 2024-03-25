from django import forms
from django.conf import settings

class EmailForm(forms.Form):
	actualEmail = forms.EmailField(min_length=settings.CONFIG_EMAIL_LENGTH_MIN, max_length=settings.CONFIG_EMAIL_LENGTH_MAX, required=True)
	newEmail = forms.EmailField(min_length=settings.CONFIG_EMAIL_LENGTH_MIN, max_length=settings.CONFIG_EMAIL_LENGTH_MAX, required=True)

class PasswordForm(forms.Form):
	actualPassword = forms.CharField(widget=forms.PasswordInput(), max_length=settings.CONFIG_PASS_LENGTH_MAX, min_length=settings.CONFIG_PASS_LENGTH_MIN, required=True)
	newPassword = forms.CharField(widget=forms.PasswordInput(), max_length=settings.CONFIG_PASS_LENGTH_MAX, min_length=settings.CONFIG_PASS_LENGTH_MIN, required=True)

class PictureForm(forms.Form):
	profilePicture =forms.ImageField(required=True)