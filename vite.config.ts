import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
      }
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/icons/*.png'],
      manifest: {
        name: 'Cookie Clicker Save Toolkit',
        short_name: 'CC Save Editor',
        description: 'Decripte e edite saves de diversos jogos. Offline, 100% client-side.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['games', 'utilities'],
        lang: 'pt-BR',
        icons: [
          {
            src: 'assets/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'assets/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\.(txt|json)$/,
            handler: 'NetworkFirst'
          }
        ]
      }
    })
  ]
});
