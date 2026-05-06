# Multi-stage build para frontend estático

# Stage 1: Builder (validação)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências (apenas para validação)
RUN npm ci || true

# Copiar código fonte
COPY . .

# Validar arquivos (opcional)
RUN npm run validate || true

# Stage 2: Production com Nginx
FROM nginx:alpine

# Criar usuário não-root
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 -G nginx-user

# Copiar arquivos estáticos para o Nginx
COPY --chown=nginx-user:nginx-user *.html /usr/share/nginx/html/
COPY --chown=nginx-user:nginx-user css/ /usr/share/nginx/html/css/
COPY --chown=nginx-user:nginx-user js/ /usr/share/nginx/html/js/
COPY --chown=nginx-user:nginx-user README.md /usr/share/nginx/html/

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
