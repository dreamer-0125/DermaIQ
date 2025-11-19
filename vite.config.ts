import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Use port 3001 as requested
    host: '0.0.0.0', // Bind to all interfaces (localhost and external)
    strictPort: true, // Don't try other ports if 3001 is busy
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})