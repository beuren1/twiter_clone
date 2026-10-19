from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        source="profile.name",
        read_only=True,
    )

    avatar = serializers.ImageField(
        source="profile.avatar",
        read_only=True,
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "name",
            "avatar",
        ]