from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    name = models.CharField(
        max_length=100,
        blank=True,
    )

    bio = models.CharField(
        max_length=160,
        blank=True,
    )

    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.user.username


class Follow(models.Model):
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="following_relations",
    )

    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="follower_relations",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "following"],
                name="unique_follow",
            )
        ]

    def __str__(self):
        return f"{self.follower.username} -> {self.following.username}"