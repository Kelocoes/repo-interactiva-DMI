# Etapa 1: Build de la aplicación React + Vite
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Argumento de build para configurar la URL del Backend (puerto 8070 en el host)
ARG VITE_BACKEND_URL=http://localhost:8070
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Compilar la aplicación para producción
RUN npm run build

# Etapa 2: Servidor web ligero en Node sin requerir Nginx
FROM node:22-alpine AS runner

WORKDIR /app

# Instalar paquete 'serve' globalmente para servir la SPA
RUN npm install -g serve

# Copiar la carpeta compilada 'dist'
COPY --from=builder /app/dist ./dist

# Exponer el puerto configurado
EXPOSE 3060

# Servir dist en el puerto 3060 en modo Single Page Application (-s)
CMD ["serve", "-s", "dist", "-l", "3060"]
