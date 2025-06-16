
#!/bin/bash

# Script de déploiement principal
set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
ENVIRONMENT=${1:-staging}
BRANCH=${2:-develop}

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
    exit 1
}

# Vérification des prérequis
check_prerequisites() {
    log "🔍 Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker n'est pas installé"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose n'est pas installé"
    fi
    
    if [ ! -f ".env.${ENVIRONMENT}" ]; then
        error "Fichier .env.${ENVIRONMENT} non trouvé"
    fi
    
    log "✅ Prérequis validés"
}

# Backup de la base de données
backup_database() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log "💾 Sauvegarde de la base de données..."
        docker-compose -f docker-compose.yml -f docker-compose.production.yml exec -T db \
            pg_dump -U manga_user manga_db > "backups/backup_$(date +%Y%m%d_%H%M%S).sql"
        log "✅ Sauvegarde terminée"
    fi
}

# Déploiement
deploy() {
    log "🚀 Déploiement sur $ENVIRONMENT..."
    
    # Charger les variables d'environnement
    export $(cat .env.${ENVIRONMENT} | xargs)
    
    # Configuration des fichiers docker-compose
    if [ "$ENVIRONMENT" = "production" ]; then
        COMPOSE_FILES="-f docker-compose.yml -f docker-compose.production.yml"
    elif [ "$ENVIRONMENT" = "staging" ]; then
        COMPOSE_FILES="-f docker-compose.yml -f docker-compose.staging.yml"
    else
        error "Environnement non supporté: $ENVIRONMENT"
    fi
    
    # Pull des dernières images
    log "📦 Récupération des dernières images..."
    docker-compose $COMPOSE_FILES pull
    
    # Arrêt des services
    log "🛑 Arrêt des services..."
    docker-compose $COMPOSE_FILES down
    
    # Démarrage des services
    log "🚀 Démarrage des services..."
    docker-compose $COMPOSE_FILES up -d
    
    # Attendre que les services soient prêts
    log "⏳ Attente du démarrage des services..."
    sleep 30
    
    # Migrations
    log "🔄 Application des migrations..."
    docker-compose $COMPOSE_FILES exec -T backend python manage.py migrate
    
    # Collecte des fichiers statiques
    log "📦 Collecte des fichiers statiques..."
    docker-compose $COMPOSE_FILES exec -T backend python manage.py collectstatic --noinput
    
    log "✅ Déploiement terminé!"
}

# Health check
health_check() {
    log "🔍 Vérification de la santé des services..."
    
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost/api/health/ &> /dev/null; then
            log "✅ Services en bonne santé!"
            return 0
        fi
        
        warn "Tentative $attempt/$max_attempts échouée, nouvelle tentative dans 10s..."
        sleep 10
        ((attempt++))
    done
    
    error "❌ Health check échoué après $max_attempts tentatives"
}

# Rollback
rollback() {
    log "🔄 Rollback en cours..."
    
    if [ ! -f "backups/last_working_backup.sql" ]; then
        error "Aucune sauvegarde de rollback trouvée"
    fi
    
    # Restaurer la base de données
    log "🗄️ Restauration de la base de données..."
    docker-compose $COMPOSE_FILES exec -T db \
        psql -U manga_user -d manga_db < backups/last_working_backup.sql
    
    # Redémarrer les services
    log "🔄 Redémarrage des services..."
    docker-compose $COMPOSE_FILES restart
    
    log "✅ Rollback terminé!"
}

# Menu principal
case "${3:-deploy}" in
    "deploy")
        check_prerequisites
        backup_database
        deploy
        health_check
        ;;
    "rollback")
        rollback
        ;;
    "health")
        health_check
        ;;
    *)
        echo "Usage: $0 <environment> <branch> <action>"
        echo "  environment: staging|production"
        echo "  branch: develop|main"
        echo "  action: deploy|rollback|health"
        exit 1
        ;;
esac

---

# scripts/backup.sh
#!/bin/bash

# Script de sauvegarde automatique
set -e

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Créer le répertoire de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde de la base de données
log "💾 Début de la sauvegarde..."
pg_dump -h db -U $POSTGRES_USER -d $POSTGRES_DB > "$BACKUP_DIR/manga_backup_$DATE.sql"

# Compression
log "🗜️ Compression de la sauvegarde..."
gzip "$BACKUP_DIR/manga_backup_$DATE.sql"

# Nettoyage des anciennes sauvegardes
log "🧹 Nettoyage des anciennes sauvegardes (>$RETENTION_DAYS jours)..."
find $BACKUP_DIR -name "manga_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

log "✅ Sauvegarde terminée: manga_backup_$DATE.sql.gz"

---

# scripts/monitoring.sh
#!/bin/bash

# Script de monitoring des services
set -e

check_service() {
    local service=$1
    local url=$2
    
    if curl -f -s $url > /dev/null; then
        echo "✅ $service: OK"
        return 0
    else
        echo "❌ $service: ÉCHEC"
        return 1
    fi
}

echo "🔍 Vérification des services..."

# Variables d'environnement
DOMAIN=${DOMAIN:-localhost}

# Check des services
ERRORS=0

check_service "Frontend" "http://$DOMAIN/" || ((ERRORS++))
check_service "Backend API" "http://$DOMAIN/api/health/" || ((ERRORS++))
check_service "Admin Django" "http://$DOMAIN/admin/" || ((ERRORS++))

# Check des conteneurs Docker
echo "🐳 État des conteneurs Docker:"
docker-compose ps

# Check de l'espace disque
echo "💾 Espace disque:"
df -h

# Check de la mémoire
echo "🧠 Utilisation mémoire:"
free -h

# Check des logs d'erreur récents
echo "📋 Erreurs récentes (dernières 10 lignes):"
docker-compose logs --tail=10 | grep -i error || echo "Aucune erreur récente"

if [ $ERRORS -eq 0 ]; then
    echo "✅ Tous les services fonctionnent correctement"
    exit 0
else
    echo "❌ $ERRORS service(s) en erreur"
    exit 1
fi

---

# scripts/ssl-renew.sh
#!/bin/bash

# Script de renouvellement SSL avec Let's Encrypt
set -e

DOMAIN=${1:-$PRODUCTION_DOMAIN}

if [ -z "$DOMAIN" ]; then
    echo "❌ Domaine requis"
    echo "Usage: $0 <domain>"
    exit 1
fi

echo "🔐 Renouvellement SSL pour $DOMAIN..."

# Renouvellement avec certbot
docker run --rm \
    -v /etc/letsencrypt:/etc/letsencrypt \
    -v /var/lib/letsencrypt:/var/lib/letsencrypt \
    -v /var/www/html:/var/www/html \
    certbot/certbot renew

# Redémarrage de nginx pour prendre en compte les nouveaux certificats
docker-compose restart nginx

echo "✅ Certificats SSL renouvelés et nginx redémarré"

---

# scripts/logs.sh
#!/bin/bash

# Script de gestion des logs
SERVICE=${1:-all}
LINES=${2:-100}

case $SERVICE in
    "all")
        docker-compose logs --tail=$LINES -f
        ;;
    "backend"|"frontend"|"nginx"|"db"|"redis")
        docker-compose logs --tail=$LINES -f $SERVICE
        ;;
    "errors")
        docker-compose logs --tail=$LINES | grep -i error
        ;;
    *)
        echo "Usage: $0 <service> [lines]"
        echo "Services: all|backend|frontend|nginx|db|redis|errors"
        exit 1
        ;;
esac