from django.contrib import admin
from .models import Lecture, Slide, Note, Author, Event, Playlist, Category

for model in [Author, Lecture, Category, Slide, Event, Playlist, Note]:
    admin.site.register(model)
