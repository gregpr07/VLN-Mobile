from django.conf.urls import url
from django.urls import path, include
from .views import *

urlpatterns = [
    path("author/<str:query>/<int:page>/", SearchAuthors.as_view()),
    path("lecture/<str:query>/<int:page>/", SearchLectures.as_view()),
    path("category/<str:query>/<int:page>/", SearchCategories.as_view()),
    path("event/<str:query>/<int:page>/", SearchEvents.as_view())
]
