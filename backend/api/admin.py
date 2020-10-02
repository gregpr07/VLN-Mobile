from django.contrib import admin
from .models import UserModel, Lecture, Slide, Note, Author, Event, Playlist, Category

for model in [UserModel, Author, Lecture, Category, Slide, Event, Playlist, Note]:
    admin.site.register(model)
