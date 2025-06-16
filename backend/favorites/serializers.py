from rest_framework import serializers
from .models import Favorite
from mangas.serializers import MangaSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    manga = MangaSerializer(read_only=True)
    manga_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'manga', 'manga_id', 'created_at']
        read_only_fields = ['id', 'created_at']
