#!/bin/bash

# setup_project.sh - Script d'initialisation du projet Manga

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Initialisation du projet Manga...${NC}"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Erreur: docker-compose.yml non trouvé. Êtes-vous dans le bon répertoire ?${NC}"
    exit 1
fi

echo -e "${YELLOW}📁 Création de la structure des répertoires...${NC}"

# Structure backend
mkdir -p backend/manga_project
mkdir -p backend/mangas
mkdir -p backend/accounts
mkdir -p backend/favorites
mkdir -p backend/fixtures
mkdir -p backend/staticfiles
mkdir -p backend/templates

# Structure frontend
mkdir -p frontend/src/components
mkdir -p frontend/src/pages
mkdir -p frontend/src/hooks
mkdir -p frontend/src/services
mkdir -p frontend/src/utils
mkdir -p frontend/public

# Structure nginx
mkdir -p nginx/conf.d
mkdir -p nginx/ssl

echo -e "${YELLOW}📝 Création des fichiers Django de base...${NC}"

# Fichiers __init__.py
touch backend/manga_project/__init__.py
touch backend/mangas/__init__.py
touch backend/accounts/__init__.py
touch backend/favorites/__init__.py

# Apps Django - mangas
cat > backend/mangas/apps.py << 'EOF'
from django.apps import AppConfig

class MangasConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mangas'
    verbose_name = 'Gestion des Mangas'
EOF

cat > backend/mangas/models.py << 'EOF'
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
EOF

cat > backend/mangas/urls.py << 'EOF'
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.MangaViewSet)
router.register(r'genres', views.GenreViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
EOF

cat > backend/mangas/views.py << 'EOF'
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import Manga, Genre
from .serializers import MangaSerializer, GenreSerializer

class MangaViewSet(viewsets.ModelViewSet):
    queryset = Manga.objects.all()
    serializer_class = MangaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'genres', 'publication_year']
    search_fields = ['title', 'author', 'description']
    ordering_fields = ['title', 'rating', 'created_at', 'publication_year']
    ordering = ['-created_at']

class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
EOF

cat > backend/mangas/serializers.py << 'EOF'
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
EOF

cat > backend/mangas/admin.py << 'EOF'
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
EOF

# Apps Django - accounts
cat > backend/accounts/apps.py << 'EOF'
from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'
    verbose_name = 'Gestion des Comptes'
EOF

cat > backend/accounts/models.py << 'EOF'
from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profil de {self.user.username}"
EOF

cat > backend/accounts/urls.py << 'EOF'
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
]
EOF

cat > backend/accounts/views.py << 'EOF'
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
EOF

cat > backend/accounts/serializers.py << 'EOF'
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']
EOF

cat > backend/accounts/admin.py << 'EOF'
from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']
    search_fields = ['user__username', 'user__email']
EOF

# Apps Django - favorites
cat > backend/favorites/apps.py << 'EOF'
from django.apps import AppConfig

class FavoritesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'favorites'
    verbose_name = 'Gestion des Favoris'
EOF

cat > backend/favorites/models.py << 'EOF'
from django.db import models
from django.contrib.auth.models import User
from mangas.models import Manga

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    manga = models.ForeignKey(Manga, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'manga']
        ordering = ['-created_at']
        verbose_name = 'Favori'
        verbose_name_plural = 'Favoris'

    def __str__(self):
        return f"{self.user.username} - {self.manga.title}"
EOF

cat > backend/favorites/urls.py << 'EOF'
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.FavoriteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
EOF

cat > backend/favorites/views.py << 'EOF'
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Favorite
from .serializers import FavoriteSerializer

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        manga_id = request.data.get('manga_id')
        if not manga_id:
            return Response({'error': 'manga_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        favorite, created = Favorite.objects.get_or_create(
            user=request.user, manga_id=manga_id
        )
        
        if not created:
            favorite.delete()
            return Response({'status': 'removed'})
        
        return Response({'status': 'added'})
EOF

cat > backend/favorites/serializers.py << 'EOF'
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
EOF

cat > backend/favorites/admin.py << 'EOF'
from django.contrib import admin
from .models import Favorite

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'manga', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'manga__title']
EOF

echo -e "${YELLOW}🌐 Création des fichiers frontend de base...${NC}"

# Frontend - fichiers de base
cat > frontend/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Application de gestion de mangas" />
    <title>Manga App</title>
</head>
<body>
    <noscript>Vous devez activer JavaScript pour utiliser cette application.</noscript>
    <div id="root"></div>
</body>
</html>
EOF

cat > frontend/src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

cat > frontend/src/App.js << 'EOF'
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎌 Manga App</h1>
        <p>Application de gestion de mangas</p>
        <p>Backend Django + Frontend React</p>
      </header>
    </div>
  );
}

export default App;
EOF

cat > frontend/src/App.css << 'EOF'
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}
EOF

cat > frontend/src/index.css << 'EOF'
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF

# Permissions
if [ -f "backend/entrypoint.sh" ]; then
    chmod +x backend/entrypoint.sh
    echo -e "${GREEN}✅ Permissions accordées à entrypoint.sh${NC}"
fi

# Fichier .env
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Fichier .env créé${NC}"
    else
        echo -e "${YELLOW}⚠️  .env.example non trouvé, créez votre fichier .env manuellement${NC}"
    fi
fi

echo -e "${GREEN}🎉 Structure du projet créée avec succès !${NC}"
echo -e "${YELLOW}📋 Prochaines étapes :${NC}"
echo -e "  1. Vérifiez le fichier .env"
echo -e "  2. Lancez: make setup"
echo -e "  3. Ou lancez: docker-compose up --build"