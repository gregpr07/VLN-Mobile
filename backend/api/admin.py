from django.contrib import admin
from .models import UserModel, Lecture, Slide, Note, Notes

for model in [UserModel, Lecture, Slide, Note, Notes]:
    admin.site.register(model)
