from django.contrib import admin
from .models import Manga, Genre

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Manga)
class MangaAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'rating', 'created_at']
    list_filter = ['status', 'genres', 'publication_year']
    search_fields = ['title', 'author']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['genres']
