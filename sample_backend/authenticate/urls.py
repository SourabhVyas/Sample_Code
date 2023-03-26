
from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('login/', UserView.as_view()),
    path('register/', CreateUserView.as_view()),
    path('csrf/', csrf),
]
