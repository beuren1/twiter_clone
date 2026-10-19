from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from interactions.models import Comment, Like
from interactions.serializers import CommentSerializer
from posts.models import Post


class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(
            Post,
            id=post_id,
        )

        like, created = Like.objects.get_or_create(
            user=request.user,
            post=post,
        )

        if not created:
            return Response(
                {
                    "detail": "Você já curtiu este post."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "detail": "Post curtido com sucesso."
            },
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, post_id):
        like = Like.objects.filter(
            user=request.user,
            post_id=post_id,
        ).first()

        if not like:
            return Response(
                {
                    "detail": "Você ainda não curtiu este post."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        like.delete()

        return Response(
            {
                "detail": "Curtida removida com sucesso."
            }
        )


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(
            post_id=self.kwargs["post_id"]
        )

    def perform_create(self, serializer):
        post = get_object_or_404(
            Post,
            id=self.kwargs["post_id"],
        )

        serializer.save(
            user=self.request.user,
            post=post,
        )

# Create your views here.
