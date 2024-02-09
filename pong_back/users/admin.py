from .models import Profile
from django.contrib import admin
from stats.models import Stats
from conversations.models import Conversation

admin.site.register(Profile)
admin.site.register(Stats)
admin.site.register(Conversation)
