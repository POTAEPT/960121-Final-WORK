import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

 // https://vite.dev/config/
export default defineConfig({
  plugins: [
     react(),
     mkcert()
  ],
  server: {
    https: true, // บังคับให้ใช้ HTTPS
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
