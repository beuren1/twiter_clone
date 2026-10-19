from django.urls import path

from .views import (
    ChangePasswordView,
    FollowersListView,
    FollowingListView,
    FollowUserView,
    ProfileView,
    RegisterView,
    UserListView,
)

urlpatterns = [
    path("users/", UserListView.as_view(), name="users"),
path("users/<int:user_id>/follow/", FollowUserView.as_view(), name="follow-user"),
path("following/", FollowingListView.as_view(), name="following"),
path("followers/", FollowersListView.as_view(), name="followers"),
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),
    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),
    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),
]