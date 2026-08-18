import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Project-ECE/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['embedded-roadmap-icon.svg'],
      manifest: {
        name: 'Embedded Career Planner',
        short_name: 'EmbeddedPlan',
        description: '1-year embedded systems and C programming roadmap for part-time learners.',
        theme_color: '#020817',
        background_color: '#020817',
        display: 'standalone',
        start_url: '/Project-ECE/',
        icons: [
          {
            src: '/embedded-roadmap-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
