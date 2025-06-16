#!/bin/bash

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Démarrage du backend Django...${NC}"

# Attendre que la base de données soit prête
echo -e "${YELLOW}⏳ Attente de la base de données...${NC}"
until PGPASSWORD=$POSTGRES_PASSWORD psql -h db -U $POSTGRES_USER -d $POSTGRES_DB -c '\q'; do
  echo -e "${YELLOW}⏳ Base de données non disponible - attente...${NC}"
  sleep 1
done

echo -e "${GREEN}✅ Base de données connectée !${NC}"

# Collecte des fichiers statiques
echo -e "${YELLOW}📦 Collecte des fichiers statiques...${NC}"
python manage.py collectstatic --noinput

# Application des migrations
echo -e "${YELLOW}🔄 Application des migrations...${NC}"
python manage.py migrate

# Création du superuser si il n'existe pas
echo -e "${YELLOW}👤 Création du superuser...${NC}"
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@manga.com', 'admin123')
    print('✅ Superuser créé: admin/admin123')
else:
    print('ℹ️  Superuser existe déjà')
EOF

# Chargement des données initiales (optionnel)
echo -e "${YELLOW}📚 Chargement des données initiales...${NC}"
if [ -f "fixtures/initial_data.json" ]; then
    python manage.py loaddata fixtures/initial_data.json
    echo -e "${GREEN}✅ Données initiales chargées${NC}"
fi

echo -e "${GREEN}🎉 Backend Django prêt !${NC}"

# Démarrage du serveur
if [ "$1" = "development" ]; then
    echo -e "${GREEN}🔧 Mode développement - Django dev server${NC}"
    python manage.py runserver 0.0.0.0:8000
else
    echo -e "${GREEN}🚀 Mode production - Gunicorn${NC}"
    gunicorn manga_project.wsgi:application \
        --bind 0.0.0.0:8000 \
        --workers 3 \
        --worker-class gevent \
        --worker-connections 1000 \
        --max-requests 1000 \
        --max-requests-jitter 50 \
        --timeout 30 \
        --keep-alive 2 \
        --access-logfile - \
        --error-logfile - \
        --log-level info
fi