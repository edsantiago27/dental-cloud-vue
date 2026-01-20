// src/stores/superadmin/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services'

export const useSuperAdminAuthStore = defineStore('superadminAuth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
 async function login(email, password) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(email, password)
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token       // <- viene de SuperAdminAuthController [file:23]
        localStorage.setItem('sa_token', token.value)
        localStorage.setItem('superadminuser', JSON.stringify(user.value))
        return { success: true }
      } else {
        throw new Error(response.message || 'Error en login')
      }
    } catch (err) {
      // manejo de errores...
      return { success: false, message: 'Error al iniciar sesión' }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await authService.logout().catch(e => console.warn('Logout API failed, continuing with local cleanup'))
      }
    } catch (err) {
      console.warn('Silent logout error:', err)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('sa_token')
      localStorage.removeItem('superadminuser')
    }
  }

  function checkAuth() {
    const savedToken = localStorage.getItem('sa_token')
    const savedUser = localStorage.getItem('superadminuser')

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
        return true
      } catch (err) {
        logout()
        return false
      }
    }
    return false
  }

  function clearError() {
    error.value = null
  }
return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
})