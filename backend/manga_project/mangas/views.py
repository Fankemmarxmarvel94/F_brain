from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Manga, Favorite
from .serializers import MangaSerializer, FavoriteSerializer

class MangaViewSet(viewsets.ModelViewSet):
    queryset = Manga.objects.all()
    serializer_class = MangaSerializer

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)





