from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.models import Follow
from posts.models import Post


class PostTests(APITestCase):

    def setUp(self):
        self.josue = User.objects.create_user(
            username="josue",
            password="12345678",
        )

        self.maria = User.objects.create_user(
            username="maria",
            password="12345678",
        )

        token = RefreshToken.for_user(self.josue)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

    def test_create_post(self):
        response = self.client.post(
            "/api/posts/",
            {
                "content": "Meu post de teste"
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            Post.objects.count(),
            1,
        )


    def test_feed_shows_followed_user_posts(self):
        Follow.objects.create(
            follower=self.josue,
            following=self.maria,
        )

        Post.objects.create(
            author=self.maria,
            content="Post da Maria",
        )

        Post.objects.create(
            author=self.josue,
            content="Post do Josué",
        )

        response = self.client.get(
            "/api/posts/feed/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            1,
        )

        self.assertEqual(
            response.data[0]["author"],
            "maria",
        )

# Create your tests here.
