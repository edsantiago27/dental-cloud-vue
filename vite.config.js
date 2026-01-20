import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@clinica': fileURLToPath(new URL('./src/modules/clinica', import.meta.url)),
      '@paciente': fileURLToPath(new URL('./src/modules/paciente', import.meta.url)),
      '@superadmin': fileURLToPath(new URL('./src/modules/superadmin', import.meta.url)),
      '@demo': fileURLToPath(new URL('./src/modules/demo', import.meta.url))
    }
  },
  server: {
    port: 5173
  }
})
