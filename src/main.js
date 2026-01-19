import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@shared/assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'
import toastPlugin from '@shared/plugins/toast'
import vClickOutside from 'v-click-outside'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(toastPlugin)
app.use(vClickOutside)
// Verificar sesión al iniciar
import { useAuthStore } from '@shared/stores/auth'
const authStore = useAuthStore()
authStore.checkAuth()

console.log('🚀 DentalCloud iniciado')
console.log('👤 Sesión activa:', authStore.isAuthenticated)

app.mount('#app')
