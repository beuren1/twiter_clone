from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from interactions.models import Comment, Like
from posts.models import Post


class InteractionTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="josue",
            password="12345678",
        )

        self.post = Post.objects.create(
            author=self.user,
            content="Post para testes",
        )

        token = RefreshToken.for_user(self.user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

    def test_like_post(self):
        response = self.client.post(
            f"/api/interactions/posts/{self.post.id}/like/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertTrue(
            Like.objects.filter(
                user=self.user,
                post=self.post,
            ).exists()
        )

    def test_comment_post(self):
        response = self.client.post(
            f"/api/interactions/posts/{self.post.id}/comments/",
            {
                "content": "Comentário de teste"
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertTrue(
            Comment.objects.filter(
                user=self.user,
                post=self.post,
            ).exists()
        )

# Create your tests here.
