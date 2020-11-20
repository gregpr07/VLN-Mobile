from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

from .api import RegistrationAPI, LoginAPI, UserAPI
from .views import *

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'author', AuthorViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'lecture', LectureViewSet)
router.register(r'slide', SlideViewSet)
router.register(r'event', EventViewSet)
router.register(r'playlist', PlaylistViewSet)
router.register(r'note', NoteViewSet, 'note')

urlpatterns = [
    path('', include(router.urls)),

    path('noted/', NotedLecturesView.as_view()),

    path('starred/', StarredLecturesView.as_view()),
    path('star/<int:lecture_id>/', StarLectureView.as_view()),
    path('unstar/<int:lecture_id>/', UnstarLectureView.as_view()),
    path('history/', HistoryLectureView.as_view()),
    path('history_add/', HistoryLectureAddView.as_view()),
    path('history_clear/', HistoryLectureClearView.as_view()),
    path('left_off/<int:lecture_id>/', LeftOffLectureView.as_view()),

    url("^auth/user/$", UserAPI.as_view()),
    url("^auth/login/$", LoginAPI.as_view()),
    url("^auth/register/$", RegistrationAPI.as_view()),
]
