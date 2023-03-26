from rest_framework import generics, status, response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

from django.db.models import Subquery

from .serializers import NoteSerializer
from .models import Note
from authenticate.models import User

from django.views.decorators.csrf import csrf_exempt



@api_view(("POST",))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_note(request):
    if request.session.exists(request.session.session_key):
        request.session.create()

    noteId = request.data.get("noteId")
    noteQuery = Note.objects.filter(replyTo=noteId)
    return response.Response(NoteSerializer(noteQuery, many=True).data)



@api_view(("POST",))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def delete_note(request):
    if request.session.exists(request.session.session_key):
        request.session.create()

    noteId = request.data.get("noteId")
    noteQuery = Note.objects.filter(noteId=noteId)
    noteQuery.delete()
    return response.Response({"status": status.HTTP_200_OK})



@api_view(("POST",))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_notes(request):
    if request.session.exists(request.session.session_key):
        request.session.create()
    
    userId = request.data.get("userId")
    noteQuery = Note.objects.filter(userId=userId)
    return response.Response(NoteSerializer(noteQuery, many=True).data)



@api_view(("POST",))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def create_note(request):
    if request.session.exists(request.session.session_key):
        request.session.create()

    data = request.data
    userId = data.get("userId")
    note = data.get("note")["text"]
    attachment = data.get("note")["attachment"]
    attachmentType = data.get("note")["attachmentType"]
    noteType = data.get("noteType")
    replyTo = data.get("replyTo")

    queryset = User.objects.filter(userId=userId)
    if queryset.exists():
        newNote = Note(
            userId=userId,
            note=note,
            attachment=attachment,
            attachmentType=attachmentType,
            noteType=noteType,
            replyTo=replyTo,
        )
        newNote.save()
        return response.Response(
            NoteSerializer(newNote).data, status=status.HTTP_200_OK
        )
    else:
        return response.Response("Invalid user")
