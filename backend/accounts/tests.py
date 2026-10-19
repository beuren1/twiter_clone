from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import Follow



class AccountsTests(APITestCase):

    def test_register_user(self):
        data = {
            "username": "teste",
            "email": "teste@email.com",
            "password": "12345678",
        }

        response = self.client.post(
            "/api/accounts/register/",
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertTrue(
            User.objects.filter(username="teste").exists()
        )


    def test_login_user(self):
        User.objects.create_user(
            username="teste",
            password="12345678",
        )

        data = {
            "username": "teste",
            "password": "12345678",
        }

        response = self.client.post(
            "/api/token/",
            data,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn(
            "access",
            response.data,
        )

        self.assertIn(
            "refresh",
            response.data,
        )


class FollowTests(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(
            username="josue",
            password="12345678",
        )

        self.user2 = User.objects.create_user(
            username="maria",
            password="12345678",
        )

        token = RefreshToken.for_user(self.user1)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.access_token}"
        )

    def test_follow_user(self):
        response = self.client.post(
            f"/api/accounts/users/{self.user2.id}/follow/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertTrue(
            Follow.objects.filter(
                follower=self.user1,
                following=self.user2,
            ).exists()
        )