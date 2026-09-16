# Proyecto Base: Frontend (React + Vite + DaisyUI) & Backend (NestJS + SQLite)

Arquitectura base para el desarrollo de entornos digitales interactivos.

## 📂 Estructura del Monorepo

- [`back/`](file:///F:/Universidad/Docencia%20ICESI/Desarrollo%20de%20Entornos%20Digitales%20Web/2026%2002/repo-interactiva-DMI/back/README.md): Servidor backend con **NestJS**, **TypeScript**, **TypeORM** y **SQLite** embebido.
- [`front/`](file:///F:/Universidad/Docencia%20ICESI/Desarrollo%20de%20Entornos%20Digitales%20Web/2026%2002/repo-interactiva-DMI/front/README.md): Aplicación cliente con **React**, **Vite**, **TypeScript**, **Tailwind CSS** y **DaisyUI**.

---

## ⚡ Guía de Inicio Rápido

### 1. Iniciar el Backend (NestJS + SQLite)
En una terminal:
```bash
cd back
npm install
npm run start:dev
```
> El servidor estará disponible en `http://localhost:3000` con endpoints REST en `/tasks`.

### 2. Iniciar el Frontend (React + Vite + DaisyUI)
En otra terminal:
```bash
cd front
npm install
npm run dev
```
> La interfaz web estará disponible en `http://localhost:5173`.
