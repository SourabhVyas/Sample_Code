from rest_framework import serializers
from authenticate.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            #"createdAt",
            #"modifiedAt",
            "userId",
            "username",
            #"password",
            #"mobile",
            #"email",
        )
