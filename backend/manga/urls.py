
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MangaViewSet

router = DefaultRouter()
router.register(r'mangas', MangaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]