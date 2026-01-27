import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-htaccess',
      closeBundle() {
        // Copier .htaccess dans dist après le build
        try {
          copyFileSync(
            resolve(__dirname, '.htaccess'),
            resolve(__dirname, 'dist/.htaccess')
          )
          console.log('✓ .htaccess copié dans dist/')
        } catch (err) {
          console.warn('⚠ Impossible de copier .htaccess:', err.message)
        }
      }
    }
  ],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://xamleprodbackend.yeskarangue.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
