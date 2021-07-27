from django.contrib import admin
from .models import Lecture, Slide, Note, Author, Event, Playlist, Category, LectureView, SignedForm

for model in [Author, Lecture, LectureView, Category, Slide, Event, Playlist, Note, SignedForm]:
    admin.site.register(model)
