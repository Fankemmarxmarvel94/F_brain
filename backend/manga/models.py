# Create your models here.
from django.db import models

class Manga(models.Model):
    title = models.CharField(max_length=255)
    title_japanese = models.CharField(max_length=255, blank=True, null=True)
    author = models.CharField(max_length=255)
    artist = models.CharField(max_length=255, blank=True, null=True)
    genres = models.JSONField(default=list)
    status = models.CharField(max_length=50)
    volumes = models.PositiveIntegerField(default=0)
    chapters = models.PositiveIntegerField(default=0)
    year = models.PositiveIntegerField(blank=True, null=True)
    synopsis = models.TextField(blank=True, null=True)
    cover_image = models.URLField(blank=True, null=True)
    rating = models.FloatField(default=0.0)
    total_ratings = models.PositiveIntegerField(default=0)
    demographics = models.CharField(max_length=50, blank=True, null=True)
    publisher = models.CharField(max_length=255, blank=True, null=True)
    serialization = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title