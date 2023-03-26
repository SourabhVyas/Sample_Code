from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','createdAt','modifiedAt','userId','username','password','mobile','email')


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','password')



class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username','password','mobile','email')