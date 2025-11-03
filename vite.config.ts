// vite.config.ts > 1 default
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// Add this
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    // Add this
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Jika ada request ke path yang diawali /apiwilayah
      '/apiwilayah': {
        // Targetkan ke server asli
        target: 'https://wilayah.id',
        // Ganti origin header agar sesuai dengan target
        changeOrigin: true,
        // Hapus '/apiwilayah' dari path sebelum mengirim request
        rewrite: (path) => path.replace(/^\/apiwilayah/, ''),
      },
    },
  },
})
