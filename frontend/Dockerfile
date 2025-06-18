# Dockerfile multi-stage pour React + Vite

# Stage 1: Build de l'application
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json pour optimiser le cache Docker
COPY package*.json ./

# Installer les dépendances (gestion avec/sans package-lock.json)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copier tout le code source
COPY . .

# Build de l'application pour la production
RUN npm run build

# Stage 2: Production avec nginx
FROM nginx:alpine AS production

# Copier les fichiers buildés depuis le stage précédent
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]