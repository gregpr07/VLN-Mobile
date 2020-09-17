from django.urls import path, include
from rest_framework import routers

from .views import *

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'user', UserModelViewSet)
router.register(r'lecture', LectureViewSet)
router.register(r'slide', SlideViewSet)
router.register(r'notes', NotesViewSet)
router.register(r'note', NoteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
