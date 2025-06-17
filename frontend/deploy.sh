#!/bin/bash

#Script de déploiement pour React + Vite

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
IMAGE_NAME="manga-frontend"
CONTAINER_NAME="manga-joker"
PORT="80"

# Fonctions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction d'aide
show_help() {
    echo "Usage: $0 [OPTION]"
    echo "Options:"
    echo "  build      Construire l'image Docker"
    echo "  dev        Lancer en mode développement"
    echo "  prod       Lancer en mode production"
    echo "  stop       Arrêter le conteneur"
    echo "  clean      Nettoyer les images et conteneurs"
    echo "  logs       Voir les logs du conteneur"
    echo "  help       Afficher cette aide"
}

# Construire l'image
build_image() {
    log_info "Construction de l'image Docker..."
    docker build -t $IMAGE_NAME .
    log_success "Image construite avec succès!"
}

# Mode développement
run_dev() {
    log_info "Lancement en mode développement..."
    docker-compose --profile dev up --build
}

# Mode production
run_prod() {
    log_info "Arrêt du conteneur existant..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    
    log_info "Construction et lancement en mode production..."
    docker build -t $IMAGE_NAME .
    docker run -d \
        --name $CONTAINER_NAME \
        -p $PORT:80 \
        --restart unless-stopped \
        $IMAGE_NAME
    
    log_success "Application lancée sur http://localhost:$PORT"
}

# Arrêter le conteneur
stop_container() {
    log_info "Arrêt du conteneur..."
    docker stop $CONTAINER_NAME 2>/dev/null || log_warning "Aucun conteneur à arrêter"
    docker rm $CONTAINER_NAME 2>/dev/null || log_warning "Aucun conteneur à supprimer"
    log_success "Conteneur arrêté"
}

# Nettoyer
clean_docker() {
    log_info "Nettoyage des images et conteneurs..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    docker rmi $IMAGE_NAME 2>/dev/null || true
    docker system prune -f
    log_success "Nettoyage terminé"
}

# Voir les logs
show_logs() {
    log_info "Affichage des logs..."
    docker logs -f $CONTAINER_NAME
}

# Vérifier si Docker est installé
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé!"
        exit 1
    fi
}

# Script principal
main() {
    check_docker
    
    case "${1:-help}" in
        build)
            build_image
            ;;
        dev)
            run_dev
            ;;
        prod)
            run_prod
            ;;
        stop)
            stop_container
            ;;
        clean)
            clean_docker
            ;;
        logs)
            show_logs
            ;;
        help|*)
            show_help
            ;;
    esac
}

# Exécuter le script
main "$@"