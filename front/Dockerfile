# 1. Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y lockfile
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build de Vite
RUN pnpm build

# 2. Production stage
FROM nginx:alpine

# Copiar build generado a la carpeta de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada si tenés (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
