from rest_framework import serializers

from interactions.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    class Meta:
        model = Comment
        fields = [
            "id",
            "user",
            "post",
            "content",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "post",
            "created_at",
        ]