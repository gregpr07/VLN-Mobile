from django.contrib import admin
from .models import UserModel, Lecture, Slide, Note, Notes, Author, Event, Playlist

for model in [UserModel, Author, Lecture, Slide, Event, Playlist, Note, Notes]:
    admin.site.register(model)
