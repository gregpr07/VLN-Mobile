from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('esearch/', include('esearch.urls')),
    url(r'^api/auth/', include('knox.urls')),
]
