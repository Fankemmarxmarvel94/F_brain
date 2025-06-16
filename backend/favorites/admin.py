from django.contrib import admin
from .models import Favorite

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'manga', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'manga__title']
