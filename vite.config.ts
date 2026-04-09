import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),

    // 🔹 PWA настройка (чтобы работало как приложение)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PolyRouter CRM',
        short_name: 'PolyRouter',
        description: 'Единое окно для менеджеров полиграфии',
        theme_color: '#0052cc',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      // Работа в режиме разработки
      devOptions: {
        enabled: true,
      },
    }),
  ],

  // 🔹 Алиасы для удобных импортов
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@api': path.resolve(__dirname, './src/api'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },

  // 🔹 Сервер разработки
  server: {
    port: 5173,
    open: true, // Автоматически открывать браузер
    host: true, // Доступ с других устройств в сети
  },

  // 🔹 Оптимизация сборки
  build: {
    outDir: 'docs',
    sourcemap: true, // Для отладки
    rollupOptions: {
      output: {
        // Разделение кода на чанки для лучшей загрузки
        manualChunks: {
          'antd-vendor': ['antd', '@ant-design/icons'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },

  // 🔹 CSS настройки (для Ant Design)
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
