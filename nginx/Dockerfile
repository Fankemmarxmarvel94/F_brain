FROM nginx:alpine

# Installation de curl pour les health checks
RUN apk add --no-cache curl

# Suppression de la configuration par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copie de la configuration personnalisée
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/

# Création des répertoires pour les logs et SSL
RUN mkdir -p /var/log/nginx /etc/nginx/ssl

# Permissions
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx && \
    chmod -R 755 /var/cache/nginx && \
    chmod -R 644 /var/log/nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]