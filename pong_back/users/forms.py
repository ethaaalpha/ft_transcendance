from django import forms
from django.forms import ModelForm
from .models import Profile, generateUniqueImageID
from django.conf import settings


class PasswordForm(forms.Form):
	actualPassword = forms.CharField(widget=forms.PasswordInput(), max_length=settings.CONFIG_PASS_LENGTH_MAX, min_length=settings.CONFIG_PASS_LENGTH_MIN, required=True)
	newPassword = forms.CharField(widget=forms.PasswordInput(), max_length=settings.CONFIG_PASS_LENGTH_MAX, min_length=settings.CONFIG_PASS_LENGTH_MIN, required=True)

class PictureForm(forms.Form):
	profilePicture =forms.ImageField(required=True)

