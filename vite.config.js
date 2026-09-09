import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devToken = env.DEV_API_TOKEN || ''
  const apiTarget = env.DEV_API_TARGET || 'https://dev.ileben.cl'

  return {
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
      // Room3DMockup (Three.js, ~800 kB) es un chunk lazy separado; no afecta el load inicial
      chunkSizeWarningLimit: 1000,
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
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
          headers: {
            Origin: 'https://test.ileben.cl',
            Referer: 'https://test.ileben.cl/',
            ...(devToken ? { Authorization: `Bearer ${devToken}` } : {}),
          },
        },
      },
    },
  }
})
