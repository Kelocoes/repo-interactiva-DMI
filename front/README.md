# Frontend - React + Vite + TypeScript + Tailwind CSS + DaisyUI

Aplicación frontend moderna desarrollada con **React 19**, **Vite**, **TypeScript**, **Tailwind CSS** y la librería de componentes **DaisyUI**.

## 🚀 Requisitos
- [Node.js](https://nodejs.org/) (versión 18 o superior)
- npm

## 📦 Instalación

```bash
cd front
npm install
```

## 🛠️ Ejecución

### Modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Compilación para producción
```bash
npm run build
```

## 🎨 Temas y DaisyUI
- Selector interactivo de más de 10 temas (`cupcake`, `dark`, `light`, `emerald`, `synthwave`, `cyberpunk`, `luxury`, etc.).
- Persistencia automática de tema mediante `localStorage` y atributo `data-theme` en el elemento HTML.
- Componentes incluidos: Navbar, Hero, Tarjetas con sombras, Botones temáticos, Formularios, Badges, Modales e Indicador de estado de conexión con el backend.

## 📁 Estructura del Proyecto

```
front/
├── src/
│   ├── assets/
│   ├── App.tsx          # Componente principal con interfaz DaisyUI y conexión a API
│   ├── index.css        # Directivas Tailwind base/components/utilities
│   └── main.tsx         # Punto de entrada de React
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```
