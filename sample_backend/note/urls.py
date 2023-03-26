from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path("", get_notes),
    path("note/", get_note),
    path("createnote/", create_note),
    path("deletenote/", delete_note),
]
