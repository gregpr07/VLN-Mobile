from django.conf.urls import url
from django.urls import path, include
from .views import SearchAuthors, SearchLectures

urlpatterns = [
    path("author/<str:query>/<int:page>/", SearchAuthors.as_view()),
    path("lecture/<str:query>/<int:page>/", SearchLectures.as_view())
]
