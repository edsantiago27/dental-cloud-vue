// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@shared/assets/main.css' // Ajustar según tu estructura
import '@fortawesome/fontawesome-free/css/all.css'
import toastPlugin from '@shared/plugins/toast'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(toastPlugin)

// Verificar sesión al iniciar (solo para Clínica/Paciente)
import { useAuthStore } from '@shared/stores/auth'
const authStore = useAuthStore()
authStore.checkAuth()

console.log('🚀 DentalCloud iniciado')
console.log('👤 Sesión activa:', authStore.isAuthenticated)
if (authStore.isAuthenticated) {
  console.log('📋 Tipo usuario:', authStore.userType)
  console.log('🏥 Clínica:', authStore.clinica?.nombre || 'Sin seleccionar')
}

app.mount('#app')
