from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import MangaViewSet, FavoriteViewSet

router = DefaultRouter()
router.register(r'mangas', MangaViewSet, basename='manga')
router.register(r'favorites', FavoriteViewSet, basename='favorite')


urlpatterns = [
    path('', include(router.urls)),
    
]
