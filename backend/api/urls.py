from django.urls import path, include
from rest_framework import routers

from .views import *

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'user', UserModelViewSet)
router.register(r'lecture', LectureViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
