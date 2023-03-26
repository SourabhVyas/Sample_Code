
from django.contrib import admin
from django.urls import path, include

from authenticate.models import User
from note.models import Note

admin.site.register(User)
admin.site.register(Note)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('authentication/', include('authenticate.urls')),
    path('notes/', include('note.urls')),
    path('search/',include('search.urls')),
]
