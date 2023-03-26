from django.db import models
import string
import random


def unique_id(idLen=10):
    while True:
        code = ''.join(random.choices(string.ascii_letters, k=idLen))
        if User.objects.filter(userId=code).count() == 0:
            break
    return code


class User(models.Model):
    userId = models.CharField(max_length=10, default=unique_id)
    createdAt = models.DateTimeField(auto_now_add=True)
    modifiedAt = models.DateTimeField(auto_now=True)

    username = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    mobile = models.CharField(max_length=13, default="")
    email = models.EmailField(max_length=30, default='')