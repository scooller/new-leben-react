import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'legacy-js-api', 'if-function', 'abs-percent'],
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom', 'react-redux'],
          'redux': ['@reduxjs/toolkit'],
          'gsap': ['gsap'],
          'motion': ['motion'],
          'lucide': ['lucide-react'],
        },
      },
    },
  },
  server: {
    port: 5174,
    open: true,
  },
})
