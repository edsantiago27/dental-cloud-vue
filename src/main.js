// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
// Font Awesome Icons
import '@fortawesome/fontawesome-free/css/all.css'
// Toast notifications
import toastPlugin from './plugins/toast'

// Crear app
const app = createApp(App)

// Pinia (debe ir antes del router)
const pinia = createPinia()
app.use(pinia)

// Router
app.use(router)

// Toast
app.use(toastPlugin)

// Inicializar auth store
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()

// Verificar si hay sesión guardada
authStore.checkAuth()

console.log('🚀 DentalCloud iniciado')
console.log('👤 Usuario autenticado:', authStore.isAuthenticated)

// Montar app
app.mount('#app')