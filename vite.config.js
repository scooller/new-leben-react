import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devToken = env.VITE_API_TOKEN || env.API_TOKEN || env.DEV_API_TOKEN || ''
  const rawTarget = env.VITE_API_TARGET || env.API_TARGET || env.DEV_API_TARGET || 'https://dev.ileben.cl'
  const apiTarget = rawTarget.replace(/\/(?:api(?:\/v1)?)?\/?$/, '')
  const origin = env.DEV_API_ORIGIN || 'https://test.ileben.cl'
  const referer = env.DEV_API_REFERER || 'https://test.ileben.cl/'

  const injectDistPhpDefaults = {
    name: 'inject-dist-php-defaults',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      for (const file of ['api-proxy.php', 'share.php']) {
        const filePath = path.join(distDir, file)
        if (!fs.existsSync(filePath)) continue
        let content = fs.readFileSync(filePath, 'utf8')
        content = content
          .replace(/('DEV_API_TARGET',\s*)'[^']*'/g, `$1'${apiTarget}'`)
          .replace(/('DEV_API_TOKEN',\s*)'[^']*'/g, `$1'${devToken}'`)
          .replace(/('DEV_API_ORIGIN',\s*)\$currentOrigin/g, `$1'${origin}'`)
          .replace(/('DEV_API_REFERER',\s*)\$AUTHORIZED_URL\s*\.\s*'\/'/g, `$1'${referer}'`)
        fs.writeFileSync(filePath, content, 'utf8')
      }
    },
  }

  return {
    plugins: [react(), injectDistPhpDefaults],
    define: {
      'import.meta.env.VITE_API_TARGET': JSON.stringify(apiTarget),
      'import.meta.env.VITE_API_TOKEN': JSON.stringify(devToken),
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'legacy-js-api', 'if-function', 'abs-percent'],
        },
      },
    },
    build: {
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
            Origin: origin,
            Referer: referer,
            ...(devToken ? { Authorization: `Bearer ${devToken}` } : {}),
          },
        },
      },
    },
  }
})
