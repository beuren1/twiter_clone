from django.urls import path

from .views import (
    CommentListCreateView,
    LikePostView,
)

urlpatterns = [
    path(
        "posts/<int:post_id>/like/",
        LikePostView.as_view(),
        name="like-post",
    ),
    path(
        "posts/<int:post_id>/comments/",
        CommentListCreateView.as_view(),
        name="post-comments",
    ),
]