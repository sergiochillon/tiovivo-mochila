import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  preview: {
    proxy: process.env.MOCHILA_IPHONE_PROXY === '1' ? {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        bypass(req) {
          const path = req.url ?? ''
          const allowed = (req.method === 'POST' && path === '/api/sync') ||
            (req.method === 'GET' && (path === '/api/progress/DEMO-01' ||
              /^\/api\/packs\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)))
          if (!allowed) return false
        }
      }
    } : undefined
  },
  plugins: [VitePWA({
    registerType: 'autoUpdate',
    // The header logo and install icons live in public/: precache them so they do not break offline.
    includeAssets: ['mochila.svg', 'mochila-180.png'],
    manifest: {
      name: 'MOCHILA · Aprender sin conexión',
      short_name: 'MOCHILA',
      theme_color: '#174c43',
      background_color: '#faf6eb',
      icons: [
        { src: '/mochila-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/mochila-512.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  })]
})
