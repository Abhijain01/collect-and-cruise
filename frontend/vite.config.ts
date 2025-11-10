import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- THIS IS THE "PROPER" FIX ---
  // This tells Vite (on port 5173) to create a "proxy"
  // for development. Any request to '/api' will be
  // forwarded to your backend server on port 5000.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  // --------------------------------
})