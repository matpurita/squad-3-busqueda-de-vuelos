# ---------- Build stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Copiar package.json y lockfile
COPY package.json pnpm-lock.yaml* ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar TODAS las dependencias (prod + dev)
RUN pnpm install --frozen-lockfile

# Copiar el código
COPY . .

# Compilar TypeScript
RUN pnpm run build

# ---------- Production stage ----------
FROM node:22-alpine
WORKDIR /app

# Copiar solo lo necesario del builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env .env

EXPOSE 8080
CMD ["node", "dist/server.js"]
