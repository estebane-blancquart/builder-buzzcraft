import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Optimisations CSS
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // Supprime les warnings de dépendances
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'] // Supprime les warnings spécifiques
      }
    }
  },

  // Optimisations dev
  server: {
    port: 3000,
    open: true,
    hmr: true
  },

  // Optimisations build
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})