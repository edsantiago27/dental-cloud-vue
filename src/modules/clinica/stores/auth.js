// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@clinica/services/api'

export const useAuthStore = defineStore('auth', () => {
  // ==========================================
  // STATE
  // ==========================================
  
  const user = ref(null)
  const clinica = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ==========================================
  // GETTERS (computed)
  // ==========================================
  
  const isAuthenticated = computed(() => !!token.value)
  
  const userName = computed(() => {
    if (!user.value) return ''
    return `${user.value.nombre} ${user.value.apellido}`
  })
  
  const userInitials = computed(() => {
    if (!user.value) return '?'
    const n = user.value.nombre?.[0] || ''
    const a = user.value.apellido?.[0] || ''
    return (n + a).toUpperCase()
  })
  
  const isAdmin = computed(() => {
    return user.value?.rol === 'admin_clinica'
  })
  
  const isDoctor = computed(() => {
    return user.value?.rol === 'doctor'
  })
  
  const isRecepcionista = computed(() => {
    return user.value?.rol === 'recepcionista'
  })

  // ==========================================
  // ACTIONS
  // ==========================================
  
  /**
   * Login de usuario
   */
  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      console.log('🔐 Intentando login...', {
        clinica_slug: credentials.clinica_slug,
        email: credentials.email
      })

      const response = await api.post('/auth/login/usuario', {
        clinica_slug: credentials.clinica_slug,
        email: credentials.email,
        password: credentials.password
      })

      console.log('✅ Login exitoso:', response)

      // Extraer datos según estructura de Laravel
      const data = response.data || response

      if (!data.token) {
        throw new Error('Token no recibido del servidor')
      }

      // Guardar en state
      token.value = data.token
      user.value = data.user
      clinica.value = data.clinica

      // Guardar en localStorage para persistencia
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('clinica', JSON.stringify(clinica.value))

      console.log('💾 Datos guardados en localStorage')

      return { success: true }

    } catch (err) {
      console.error('❌ Error en login:', err)
      
      // Limpiar estado en caso de error
      logout()

      // Parsear mensaje de error
      let message = 'Error al iniciar sesión'
      
      if (err.response?.status === 401) {
        message = 'Credenciales inválidas'
      } else if (err.response?.status === 404) {
        message = 'Clínica no encontrada o inactiva'
      } else if (err.response?.status === 422) {
        const errors = err.response?.data?.errors
        if (errors) {
          message = Object.values(errors).flat().join(', ')
        } else {
          message = 'Datos de login inválidos'
        }
      } else if (err.code === 'ERR_NETWORK') {
        message = 'No se puede conectar con el servidor'
      } else {
        message = err.response?.data?.message || err.message || message
      }

      error.value = message
      
      return { 
        success: false, 
        message 
      }

    } finally {
      loading.value = false
    }
  }

  /**
   * Logout
   */
  async function logout() {
    try {
      // Intentar hacer logout en el servidor si hay token
      if (token.value) {
        await api.post('/logout').catch(() => {
          // Ignorar errores del servidor en logout
          console.log('⚠️ Error al hacer logout en servidor, continuando...')
        })
      }
    } finally {
      // Limpiar state
      user.value = null
      clinica.value = null
      token.value = null
      error.value = null

      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('clinica')

      console.log('👋 Logout completado')
    }
  }

  /**
   * Verificar si hay sesión guardada al cargar la app
   */
  function checkAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    const savedClinica = localStorage.getItem('clinica')

    if (savedToken && savedUser && savedClinica) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
        clinica.value = JSON.parse(savedClinica)
        
        console.log('✅ Sesión restaurada desde localStorage')
        return true
      } catch (err) {
        console.error('❌ Error al restaurar sesión:', err)
        logout()
        return false
      }
    }

    return false
  }

  /**
   * Obtener datos actualizados del usuario
   */
  async function fetchMe() {
    if (!token.value) return

    try {
      const response = await api.get('/me')
      const data = response.data || response
      
      user.value = data.user
      
      // Actualizar en localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true }
    } catch (err) {
      console.error('❌ Error al obtener usuario:', err)
      
      // Si el token expiró, hacer logout
      if (err.response?.status === 401) {
        logout()
      }
      
      return { success: false }
    }
  }

  /**
   * Limpiar errores
   */
  function clearError() {
    error.value = null
  }

  // ==========================================
  // RETURN (exponer al exterior)
  // ==========================================
  
  return {
    // State
    user,
    clinica,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userName,
    userInitials,
    isAdmin,
    isDoctor,
    isRecepcionista,
    
    // Actions
    login,
    logout,
    checkAuth,
    fetchMe,
    clearError
  }
})