from .models import Profile
from django.contrib import admin
from stats.models import Stats
from conversations.models import Conversation, Message
from game.models import Room, Match

admin.site.register(Profile)
admin.site.register(Stats)
admin.site.register(Conversation)
admin.site.register(Message)
admin.site.register(Room)
admin.site.register(Match)