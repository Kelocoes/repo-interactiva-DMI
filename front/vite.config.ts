import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
      '/stores': {
        target: 'http://localhost:3000',
      },
      '/uploads': {
        target: 'http://localhost:3000',
      },
    },
  },
})
