from django.shortcuts import render
from rest_framework import generics, status, response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

from django.middleware.csrf import get_token

from .serializers import UserSerializer, CreateUserSerializer, LoginSerializer
from .models import User

class UserView(generics.ListAPIView):
    request_serializer_class = LoginSerializer
    response_serializer_class = UserSerializer
    def post(self, request):
        if self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer = self.request_serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')

            queryset = User.objects.filter(username=username, password=password)
            if queryset.exists():
                return response.Response(self.response_serializer_class(queryset[0]).data, status=status.HTTP_200_OK)
            else:
                return response.Response('Register')
        else:
            return response.Response('invalid request format')

class CreateUserView(APIView):
    request_serializer_class = CreateUserSerializer
    response_serializer_class = UserSerializer
    def post(self, request):
        if self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.request_serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            mobile = serializer.data.get('mobile')
            email = serializer.data.get('email')

            queryset = User.objects.filter(username=username, password=password)
            if not queryset.exists():
                newUser = User(username=username, 
                                password=password,
                                email= email,
                                mobile=mobile,
                                )
                newUser.save()

                return response.Response(self.response_serializer_class(newUser).data, status=status.HTTP_200_OK)
            else:
                return response.Response('user already exists')
        else:
            return response.Response('invalid request format')

@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def csrf(request):
    return response.Response({'csrfToken': get_token(request)})

