from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("api/search/", include("esearch.urls")),
    url(r"^api/auth/", include("knox.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
