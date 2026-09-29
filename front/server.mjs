import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3060;
const BASE_PATH = '/iaslab/dmi';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
};

const server = http.createServer((req, res) => {
  try {
    let reqPath = new URL(req.url, `http://${req.headers.host}`).pathname;

    // Redirigir la raíz hacia el basepath para comodidad si se entra directo al puerto
    if (reqPath === '/' || reqPath === '') {
      res.writeHead(302, { Location: `${BASE_PATH}/` });
      return res.end();
    }

    // Remover el prefijo BASE_PATH si viene en la petición
    if (reqPath.startsWith(BASE_PATH)) {
      reqPath = reqPath.slice(BASE_PATH.length);
    }
    if (!reqPath || reqPath === '/') {
      reqPath = '/index.html';
    }

    // Ruta en el sistema de archivos dentro de DIST_DIR
    let filePath = path.join(DIST_DIR, reqPath);
    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    // Si el archivo solicitado existe físicamente, servirlo con su MIME type exacto
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      });
      return fs.createReadStream(filePath).pipe(res);
    }

    // Fallback SPA: Para cualquier ruta de frontend, servir dist/index.html
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      });
      return fs.createReadStream(indexPath).pipe(res);
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (err) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Frontend corriendo en http://0.0.0.0:${PORT}${BASE_PATH}/`);
});
