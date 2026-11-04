import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [VitePWA({
    registerType: 'autoUpdate',
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
