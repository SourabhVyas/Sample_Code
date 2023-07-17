from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('createScrool/', createScrool),
    path('deleteScrool/', deleteScrool),
    path('likeScrool/', opinionScrool),
    path('impressionStat/',impressionStat),
    path('home/', getUser),
    path('<str:user>/profile/',getScroolProfile),
    path('<str:userHandle>/scrools/<str:scroolId>/', getScrool),
]
