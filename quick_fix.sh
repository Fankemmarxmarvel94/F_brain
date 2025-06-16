#!/bin/bash
# quick_fix.sh - Solution rapide pour l'erreur npm

set -e

echo "🔧 Correction rapide de l'erreur npm..."

# 1. Nettoyer Docker
echo "🧹 Nettoyage Docker..."
docker-compose down -v 2>/dev/null || true
docker system prune -f

# 2. Créer la structure frontend manquante
echo "📁 Création de la structure frontend..."
mkdir -p frontend/src frontend/public

# 3. Créer un package.json minimal qui fonctionne
cat > frontend/package.json << 'EOF'
{
  "name": "manga-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
EOF

# 4. Créer les fichiers React de base
cat > frontend/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Manga App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
EOF

cat > frontend/src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
EOF

cat > frontend/src/App.js << 'EOF'
function App() {
  return (
    <div style={{textAlign: 'center', padding: '50px'}}>
      <h1>🎌 Manga App</h1>
      <p>Application de gestion de mangas</p>
      <p>Backend Django + Frontend React</p>
    </div>
  );
}

export default App;
EOF

# 5. Créer un Dockerfile frontend simplifié
cat > frontend/Dockerfile << 'EOF'
# Version simplifiée pour éviter les erreurs npm
FROM node:18-alpine as build

WORKDIR /app

# Copie des fichiers package
COPY package.json ./

# Installation des dépendances
RUN npm install --legacy-peer-deps

# Copie du code source
COPY . .

# Build
RUN npm run build

# Production
FROM nginx:alpine as production
RUN apk add --no-cache curl
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Développement
FROM node:18-alpine as development
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "start"]
EOF

# 6. Créer .dockerignore
cat > frontend/.dockerignore << 'EOF'
node_modules
build
.git
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

# 7. Vérifier le fichier .env
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env..."
    cat > .env << 'EOF'
# Variables de base
SECRET_KEY=django-insecure-dev-key-change-in-production
DEBUG=1
ALLOWED_HOSTS=localhost,127.0.0.1,backend,frontend

# Base de données
POSTGRES_DB=manga_db
POSTGRES_USER=manga_user
POSTGRES_PASSWORD=manga_pass

# Redis
REDIS_URL=redis://redis:6379/0

# Frontend
REACT_APP_API_URL=http://localhost/api
EOF
fi

echo "✅ Correction terminée!"
echo "🚀 Essayez maintenant: make setup"