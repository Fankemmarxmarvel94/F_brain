# Utilise une image Python officielle comme base
FROM python:3.11-slim

# Définit le répertoire de travail
WORKDIR /app

# Installe les dépendances système nécessaires pour PostgreSQL
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        libpq-dev \
        gcc \
        && rm -rf /var/lib/apt/lists/*

# Copie le fichier requirements.txt
COPY requirements.txt .

# Installe les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie le code source
COPY . .

# Crée un utilisateur non-root pour la sécurité
RUN adduser --disabled-password --gecos '' appuser \
    && chown -R appuser:appuser /app
USER appuser

# Expose le port 8000
EXPOSE 8000

# Variables d'environnement par défaut
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=manga_project.settings

# Commande par défaut pour lancer l'application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]