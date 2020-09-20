from django.contrib import admin
from .models import UserModel, Lecture, Slide, Note, Author, Event, Playlist

for model in [UserModel, Author, Lecture, Slide, Event, Playlist, Note]:
    admin.site.register(model)
