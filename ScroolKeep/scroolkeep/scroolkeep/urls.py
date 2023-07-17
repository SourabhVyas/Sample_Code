
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('scrool/', include('scrool.urls')),
    path('explore/', include('explore.urls')),
    path('author/', include('author.urls')),
]
