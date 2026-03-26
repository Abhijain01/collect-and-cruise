import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin'
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false }
        ]
      },
      webp: { quality: 75 }
    }),
    Sitemap({
      hostname: 'https://collect-and-cruise.vercel.app',
      dynamicRoutes: ['/', '/products', '/about', '/contact']
    })
  ],
  
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