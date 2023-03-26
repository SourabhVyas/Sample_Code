from django.db import models
import string
import random


def unique_id(idLen=30):
    while True:
        code = "".join(random.choices(string.ascii_letters, k=idLen))
        if Note.objects.filter(noteId=code).count() == 0:
            break
    return code


class Note(models.Model):
    createdAt = models.DateTimeField(auto_now_add=True)
    noteId = models.CharField(max_length=30, default=unique_id, editable=False)

    userId = models.CharField(max_length=10)
    note = models.TextField(max_length=120)
    noteType = models.IntegerField()
    replyTo = models.CharField(max_length=30, default="", blank=True)
    attachment = models.TextField(blank=True)
    attachmentType = models.TextField(blank=True)


class NoteTags(models.Model):
    tag = models.CharField(max_length=20)
    noteId = models.CharField(max_length=30)
    userId = models.CharField(max_length=10)


class ViewerToNote(models.Model):
    tag = models.CharField(max_length=20)
    noteId = models.CharField(max_length=30)
    userId = models.CharField(max_length=10)


class UserTags(models.Model):
    tag = models.CharField(max_length=20)
    userId = models.CharField(max_length=10)
