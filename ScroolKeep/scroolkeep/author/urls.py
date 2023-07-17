from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('addFollow', addFollow),
    path('updateAuthorInfo', setAuthorInfo),
    path('authorInfo', getAuthorInfo),
]
