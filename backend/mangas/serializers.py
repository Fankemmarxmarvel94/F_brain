from rest_framework import serializers
from .models import Manga, Genre

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'description']

class MangaSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(), many=True, write_only=True, source='genres'
    )

    class Meta:
        model = Manga
        fields = [
            'id', 'title', 'slug', 'description', 'author', 'artist',
            'genres', 'genre_ids', 'status', 'chapters_count', 'volumes_count',
            'publication_year', 'rating', 'cover_image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']
