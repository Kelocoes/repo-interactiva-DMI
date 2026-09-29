import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(() => {
  const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:3000'

  return {
    base: '/iaslab/dmi/',
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: true as const,
      proxy: {
        '/iaslab/dmiapi/socket.io': {
          target: proxyTarget,
          ws: true,
          changeOrigin: true,
        },
        '/iaslab/dmiapi': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/socket.io': {
          target: proxyTarget,
          ws: true,
          changeOrigin: true,
        },
        '/stores': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/uploads': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
