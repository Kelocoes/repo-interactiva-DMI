# Etapa 1: Build de la aplicación React + Vite
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Argumento de build para configurar la URL del Backend
ARG VITE_BACKEND_URL=https://pi2tools.icesi.edu.co/iaslab/dmiapi
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Compilar la aplicación para producción
RUN npm run build

# Etapa 2: Servidor web ligero en Node
FROM node:22-alpine AS runner

WORKDIR /app

# Copiar la carpeta compilada 'dist' y el script de servidor
COPY --from=builder /app/dist ./dist
COPY server.mjs ./

# Exponer el puerto configurado
EXPOSE 3060

# Iniciar el servidor
CMD ["node", "server.mjs"]
