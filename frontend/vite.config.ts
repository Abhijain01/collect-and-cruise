import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // --- THIS IS THE CRITICAL FIX ---
    proxy: {
      '/api': {
        // We are forcing Vite to proxy to port 5000
        // We use '127.0.0.1' instead of 'localhost'
        // to avoid any network ambiguity.
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
    // --------------------------------
  },
});