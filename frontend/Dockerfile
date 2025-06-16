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
