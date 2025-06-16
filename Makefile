# Makefile pour le projet Manga

.PHONY: help build up down restart logs shell-backend shell-frontend clean test migrate collectstatic

# Variables
COMPOSE_FILE = docker-compose.yml
COMPOSE_DEV_FILE = docker-compose.dev.yml

# Couleurs pour l'affichage
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

help: ## Affiche cette aide
	@echo "$(GREEN)🚀 Commandes disponibles pour le projet Manga:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# Commandes Docker
build: ## Construit tous les conteneurs
	@echo "$(GREEN)🏗️  Construction des conteneurs...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build

build-no-cache: ## Construit tous les conteneurs sans cache
	@echo "$(GREEN)🏗️  Construction des conteneurs (sans cache)...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build --no-cache

up: ## Démarre tous les services
	@echo "$(GREEN)🚀 Démarrage des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up -d

up-build: ## Démarre tous les services en reconstruisant
	@echo "$(GREEN)🚀 Démarrage des services avec reconstruction...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up -d --build

down: ## Arrête tous les services
	@echo "$(RED)🛑 Arrêt des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down

restart: ## Redémarre tous les services
	@echo "$(YELLOW)🔄 Redémarrage des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) restart

# Environnement de développement
dev: ## Démarre en mode développement
	@echo "$(GREEN)🛠️  Démarrage en mode développement...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) up -d

dev-build: ## Démarre en mode développement avec reconstruction
	@echo "$(GREEN)🛠️  Démarrage en mode développement avec reconstruction...$(NC)"
	docker-compose -f $(COMPOSE_FILE) -f $(COMPOSE_DEV_FILE) up -d --build

# Logs et monitoring
logs: ## Affiche les logs de tous les services
	docker-compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Affiche les logs du backend Django
	docker-compose -f $(COMPOSE_FILE) logs -f backend

logs-frontend: ## Affiche les logs du frontend React
	docker-compose -f $(COMPOSE_FILE) logs -f frontend

logs-nginx: ## Affiche les logs de nginx
	docker-compose -f $(COMPOSE_FILE) logs -f nginx

logs-db: ## Affiche les logs de la base de données
	docker-compose -f $(COMPOSE_FILE) logs -f db

# Accès aux conteneurs
shell-backend: ## Ouvre un shell dans le conteneur backend
	@echo "$(GREEN)🐚 Ouverture du shell backend...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend bash

shell-frontend: ## Ouvre un shell dans le conteneur frontend
	@echo "$(GREEN)🐚 Ouverture du shell frontend...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec frontend sh

shell-db: ## Ouvre un shell PostgreSQL
	@echo "$(GREEN)🐚 Ouverture du shell PostgreSQL...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec db psql -U manga_user -d manga_db

shell-redis: ## Ouvre un shell Redis
	@echo "$(GREEN)🐚 Ouverture du shell Redis...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec redis redis-cli

# Gestion Django
migrate: ## Applique les migrations Django
	@echo "$(GREEN)🔄 Application des migrations...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend python manage.py migrate

makemigrations: ## Crée de nouvelles migrations Django
	@echo "$(GREEN)📝 Création des migrations...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend python manage.py makemigrations

collectstatic: ## Collecte les fichiers statiques Django
	@echo "$(GREEN)📦 Collecte des fichiers statiques...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend python manage.py collectstatic --noinput

createsuperuser: ## Crée un superuser Django
	@echo "$(GREEN)👤 Création d'un superuser...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend python manage.py createsuperuser

loaddata: ## Charge les données de test
	@echo "$(GREEN)📚 Chargement des données de test...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend python manage.py loaddata fixtures/sample_mangas.json

# Tests
test: ## Lance les tests du backend
	@echo "$(GREEN)🧪 Lancement des tests...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend python manage.py test

test-frontend: ## Lance les tests du frontend
	@echo "$(GREEN)🧪 Lancement des tests frontend...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec frontend npm test

test-coverage: ## Lance les tests avec coverage
	@echo "$(GREEN)🧪 Lancement des tests avec coverage...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend coverage run --source='.' manage.py test
	docker-compose -f $(COMPOSE_FILE) exec backend coverage report

# Nettoyage
clean: ## Nettoie les conteneurs et volumes
	@echo "$(RED)🧹 Nettoyage des conteneurs et volumes...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down -v
	docker system prune -f

clean-all: ## Nettoie tout (conteneurs, volumes, images)
	@echo "$(RED)🧹 Nettoyage complet...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all
	docker system prune -a -f

# Statut et monitoring
status: ## Affiche le statut des services
	@echo "$(GREEN)📊 Statut des services:$(NC)"
	docker-compose -f $(COMPOSE_FILE) ps

health: ## Vérifie la santé des services
	@echo "$(GREEN)🏥 Vérification de la santé des services:$(NC)"
	@echo "Backend: $$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health/ || echo "❌ Inaccessible")"
	@echo "Frontend: $$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "❌ Inaccessible")"
	@echo "Database: $$(docker-compose -f $(COMPOSE_FILE) exec -T db pg_isready -U manga_user || echo "❌ Inaccessible")"

# Sauvegarde et restauration
backup-db: ## Sauvegarde la base de données
	@echo "$(GREEN)💾 Sauvegarde de la base de données...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec db pg_dump -U manga_user manga_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore-db: ## Restaure la base de données (usage: make restore-db FILE=backup.sql)
	@echo "$(GREEN)📥 Restauration de la base de données...$(NC)"
	@if [ -z "$(FILE)" ]; then echo "$(RED)❌ Veuillez spécifier FILE=nom_du_fichier.sql$(NC)"; exit 1; fi
	docker-compose -f $(COMPOSE_FILE) exec -T db psql -U manga_user -d manga_db < $(FILE)

# Installation initiale
setup: ## Installation complète du projet
	@echo "$(GREEN)🎉 Installation complète du projet Manga...$(NC)"
	@echo "$(YELLOW)📋 Vérification des prérequis...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)⚠️  Création du fichier .env...$(NC)"; \
		cp .env.example .env; \
	fi
	@echo "$(YELLOW)📋 Étapes:$(NC)"
	@echo "  1. Construction des conteneurs"
	@echo "  2. Démarrage des services"
	@echo "  3. Application des migrations"
	@echo "  4. Collecte des fichiers statiques"
	@echo ""
	$(MAKE) build
	$(MAKE) up
	@echo "$(YELLOW)⏳ Attente du démarrage des services...$(NC)"
	sleep 15
	-$(MAKE) migrate
	-$(MAKE) collectstatic
	@echo ""
	@echo "$(GREEN)✅ Installation terminée !$(NC)"
	@echo "$(GREEN)🌐 Application disponible sur: http://localhost$(NC)"
	@echo "$(GREEN)🔧 Admin Django: http://localhost/admin/$(NC)"

# Commandes par défaut
.DEFAULT_GOAL := help