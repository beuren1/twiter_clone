from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Follow
from .serializers import UserSerializer

from .serializers import (
    ProfileSerializer,
    RegisterSerializer,
)

class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)


class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        user_to_follow = get_object_or_404(
            User,
            id=user_id,
        )

        if user_to_follow == request.user:
            return Response(
                {"detail": "Você não pode seguir a si mesmo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            following=user_to_follow,
        )

        if not created:
            return Response(
                {"detail": "Você já segue este usuário."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"detail": "Usuário seguido com sucesso."},
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, user_id):
        follow = Follow.objects.filter(
            follower=request.user,
            following_id=user_id,
        ).first()

        if not follow:
            return Response(
                {"detail": "Você não segue este usuário."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        follow.delete()

        return Response(
            {"detail": "Você deixou de seguir este usuário."}
        )


class FollowingListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        following_ids = Follow.objects.filter(
            follower=self.request.user
        ).values_list(
            "following_id",
            flat=True,
        )

        return User.objects.filter(id__in=following_ids)


class FollowersListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        follower_ids = Follow.objects.filter(
            following=self.request.user
        ).values_list(
            "follower_id",
            flat=True,
        )

        return User.objects.filter(id__in=follower_ids)
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user: User = request.user

        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {
                    "detail": "Informe a senha atual e a nova senha."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(current_password):
            return Response(
                {
                    "detail": "Senha atual incorreta."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 8:
            return Response(
                {
                    "detail": "A nova senha deve ter pelo menos 8 caracteres."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {
                "detail": "Senha alterada com sucesso."
            }
        )