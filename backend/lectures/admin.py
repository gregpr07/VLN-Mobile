from django.contrib import admin
from .models import Lecture, Note, Notes

# Register your models here.
admin.site.register(Lecture)
admin.site.register(Note)
admin.site.register(Notes)
