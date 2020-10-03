from django.conf.urls import url
from django.urls import path, include
from .views import Search

urlpatterns = [
    path("search/<str:query>/", Search.as_view())
]
