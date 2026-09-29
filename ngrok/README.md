# 🤖 Guía de Automatización con Ngrok para Subagentes de IA y Desarrolladores

Este documento sirve como manual operativo para que un **subagente de IA** (o un desarrollador) configure y levante automáticamente los túneles públicos de **Backend (NestJS)** y **Frontend (Vite + React)** utilizando `ngrok`.

---

## 📋 Flujo de Trabajo para el Subagente

Cuando un usuario solicite exponer la aplicación o crear túneles con ngrok, el subagente **debe seguir estrictamente este paso a paso**:

---

### Paso 1: Solicitar el Authtoken al Usuario

Ngrok requiere autenticación gratuita para túneles HTTP. El subagente debe pedirle el token al usuario mostrando el siguiente enlace:

> "Para crear los túneles con ngrok necesito tu Authtoken personal. Puedes obtenerlo gratis iniciando sesión en:  
> 👉 [https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)  
> Por favor compárteme tu token para continuar."

---

### Paso 2: Asegurar el binario de Ngrok

El subagente debe verificar si el ejecutable `ngrok.exe` (en Windows) o `ngrok` (en Linux/macOS) existe en la carpeta `ngrok/`.

Si no existe, ejecutar en bash:
```bash
cd ngrok
npm install ngrok
# En Windows, copiar el ejecutable a la raíz de la carpeta ngrok:
cp node_modules/ngrok/bin/ngrok.exe ngrok.exe
```

---

### Paso 3: Configurar `ngrok.yml` con el Token

El subagente debe crear el archivo local `ngrok/ngrok.yml` (el cual está protegido en `.gitignore` para no exponer credenciales) a partir de la plantilla:

```yaml
version: "2"
authtoken: <TOKEN_DEL_USUARIO>

tunnels:
  backend:
    proto: http
    addr: 127.0.0.1:3000
  frontend:
    proto: http
    addr: 127.0.0.1:5173
```

> [!IMPORTANT]
> Usa explícitamente `127.0.0.1` en lugar de `localhost` en las direcciones para evitar que Windows intente resolver por IPv6 (`[::1]`) y provoque el error `ERR_NGROK_8012 (Connection refused)`.

---

### Paso 4: Levantar los Servidores Locales

El subagente debe asegurarse de que ambos servidores estén ejecutándose en segundo plano:

1. **Backend (NestJS - puerto 3000):**
   ```bash
   cd back && npm run start:dev
   ```
   - *Verificación:* El servidor debe escuchar en `0.0.0.0` y usar SQLite (`database.sqlite`) si PostgreSQL no está disponible.
   - Probar que responde con: `curl -I http://127.0.0.1:3000/`

2. **Frontend (Vite - puerto 5173):**
   ```bash
   cd front && npm start
   ```
   - Probar que responde con: `curl -I http://127.0.0.1:5173/`

---

### Paso 5: Iniciar los Túneles Simultáneos

El subagente debe ejecutar el script `start-all.sh` o el comando directo en segundo plano:

```bash
cd ngrok
./ngrok.exe start --all --config ngrok.yml
```
*(O ejecutar `bash ngrok/start-all.sh` desde la raíz)*.

---

### Paso 6: Obtener las URLs Públicas Asignadas

Ngrok expone una API local para consultar los túneles activos. El subagente debe ejecutar:

```bash
curl -s http://127.0.0.1:4040/api/tunnels
```

Y extraer de la respuesta JSON las propiedades `public_url`:
- La URL correspondiente al túnel `backend` (apuntando a `3000`).
- La URL correspondiente al túnel `frontend` (apuntando a `5173`).

---

### Paso 7: Parametrizar el Frontend con la URL del Backend

El subagente debe actualizar el archivo `front/.env`:

```env
VITE_BACKEND_URL=<URL_PUBLICA_DEL_BACKEND>
```
*(Ejemplo: `VITE_BACKEND_URL=https://xxxx-xxx.ngrok-free.app`)*.

Si el frontend ya estaba corriendo, reiniciarlo para que tome las nuevas variables.

---

### Paso 8: Reglas Críticas sobre ORB y CORS (¡Importante!)

1. **Evitar `ERR_BLOCKED_BY_ORB` en imágenes:**
   - Chrome bloquea imágenes (`<img>`) que cruzan entre dos subdominios diferentes de ngrok porque ngrok free responde con una página HTML de advertencia al no haber cookies de terceros.
   - **Solución implementada:** Las imágenes subidas (`/uploads/...`) deben servirse siempre como **rutas relativas** (ej: `/uploads/stores/banner.jpg`) para que pasen a través del proxy de Vite en el mismo dominio (`Same-Origin`), evitando el bloqueo de Chrome.
2. **Cabecera contra la advertencia de ngrok:**
   - Todas las peticiones `fetch` y conexiones WebSockets hacia el backend deben incluir la cabecera:
     ```typescript
     headers: { 'ngrok-skip-browser-warning': 'true' }
     ```

---

### Paso 9: Entregar el Resultado al Usuario

El subagente debe responder al usuario con un resumen limpio que incluya:
- **URL del Frontend:** Para acceder a la aplicación.
- **URL del Backend:** Para APIs y WebSockets.
- **Panel de control local:** [http://127.0.0.1:4040](http://127.0.0.1:4040) para monitorear el tráfico e inspeccionar las peticiones en vivo.
