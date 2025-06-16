from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Genre'
        verbose_name_plural = 'Genres'

    def __str__(self):
        return self.name

class Manga(models.Model):
    STATUS_CHOICES = [
        ('ongoing', 'En cours'),
        ('completed', 'Terminé'),
        ('hiatus', 'En pause'),
        ('cancelled', 'Annulé'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    author = models.CharField(max_length=100)
    artist = models.CharField(max_length=100, blank=True)
    genres = models.ManyToManyField(Genre, related_name='mangas')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ongoing')
    chapters_count = models.PositiveIntegerField(default=0)
    volumes_count = models.PositiveIntegerField(default=0)
    publication_year = models.PositiveIntegerField()
    rating = models.DecimalField(max_digits=3, decimal_places=1, 
                               validators=[MinValueValidator(0), MaxValueValidator(10)],
                               null=True, blank=True)
    cover_image = models.ImageField(upload_to='manga_covers/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Manga'
        verbose_name_plural = 'Mangas'

    def __str__(self):
        return self.title
