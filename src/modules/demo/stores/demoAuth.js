// src/modules/demo/stores/demoAuth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDemoAuthStore = defineStore('demo-auth', () => {
  const user = ref(JSON.parse(sessionStorage.getItem('demo_user')) || null)
  const isAuthenticated = computed(() => !!user.value)

  function login(credentials) {
    // En modo demo, aceptamos cualquier login
    const demoUser = {
      id: 'demo-user',
      nombre: 'Visitante Demo',
      email: credentials.email || 'demo@dentalcloud.com',
      role: 'admin_clinica',
      clinica: {
        nombre: 'Clínica Dental Demo',
        plan: 'Básico'
      }
    }
    
    user.value = demoUser
    sessionStorage.setItem('demo_user', JSON.stringify(demoUser))
    return { success: true }
  }

  function logout() {
    user.value = null
    sessionStorage.removeItem('demo_user')
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
})
