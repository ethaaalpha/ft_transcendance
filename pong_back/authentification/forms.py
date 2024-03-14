from django import forms
from django.forms import ModelForm
from django.conf import settings
from users.models import Profile
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from tools.functions import is42

def validate_username(value):
	if is42(value):
		raise ValidationError(
            _("%(value)s can't start with 42_"),
            params={"value": value},
        )
	if ' ' in value:
		raise ValidationError(
            _("%(value)s can't contain spaces !"),
            params={"value": value},
        )

class ResetPassForm(forms.Form):
	username = forms.CharField(min_length=settings.CONFIG_USER_LENGTH_MIN, max_length=settings.CONFIG_USER_LENGTH_MAX, required=True)

class RegisterForm(forms.Form):
	username = forms.CharField(min_length=settings.CONFIG_USER_LENGTH_MIN, max_length=settings.CONFIG_USER_LENGTH_MAX, required=True, validators=[validate_username])
	email = forms.EmailField(min_length=settings.CONFIG_EMAIL_LENGTH_MIN, max_length=settings.CONFIG_EMAIL_LENGTH_MAX, required=True)
	password = forms.CharField(min_length=settings.CONFIG_PASS_LENGTH_MIN, max_length=settings.CONFIG_PASS_LENGTH_MAX, required=True)

class LoginForm(forms.Form):
	username = forms.CharField(min_length=settings.CONFIG_USER_LENGTH_MIN, max_length=settings.CONFIG_USER_LENGTH_MAX, required=True, validators=[validate_username])
	password = forms.CharField(min_length=settings.CONFIG_PASS_LENGTH_MIN, max_length=settings.CONFIG_PASS_LENGTH_MAX, required=True)