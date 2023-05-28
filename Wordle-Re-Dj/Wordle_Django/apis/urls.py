from django.urls import path

from . import views

urlpatterns = [
    path("fetch-word-by-length/<int:length>", views.fetchWordByLength),
    path("is-word-valid/<str:word>", views.isWordValid)
]