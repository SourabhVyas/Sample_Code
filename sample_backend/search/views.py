from rest_framework import generics, status, response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer


from authenticate.models import User
from .serializers import UserSerializer

from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@api_view(("POST",))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def search(request):
    users = User.objects.filter(username__icontains = request.data.get('keywords'))
    return response.Response(UserSerializer(users, many=True).data)