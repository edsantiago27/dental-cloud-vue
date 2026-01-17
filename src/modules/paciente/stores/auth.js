// src/stores/paciente/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services'

export const usePacienteAuthStore = defineStore('pacienteAuth', () => {
  // State
  const paciente = ref(null)
  const clinica = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  
  const nombreCompleto = computed(() => {
    if (!paciente.value) return ''
    return `${paciente.value.nombre} ${paciente.value.apellido}`
  })

  const iniciales = computed(() => {
    if (!paciente.value) return ''
    const nombre = paciente.value.nombre?.charAt(0) || ''
    const apellido = paciente.value.apellido?.charAt(0) || ''
    return (nombre + apellido).toUpperCase()
  })

  // Actions
  async function login(clinicaSlug, email, password) {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(clinicaSlug, email, password)

      if (response.success) {
        // Guardar datos en el store
        token.value = response.token || response.data?.token
        paciente.value = response.user || response.data?.user
        clinica.value = response.clinica || response.data?.clinica

        // Guardar en localStorage
        localStorage.setItem('paciente_token', token.value)
        localStorage.setItem('paciente_user', JSON.stringify(paciente.value))
        localStorage.setItem('paciente_clinica', JSON.stringify(clinica.value))
        localStorage.setItem('clinica_slug', clinicaSlug)

        return { success: true }
      }

      throw new Error(response.message || 'Error al iniciar sesión')
    } catch (err) {
      console.error('❌ Error login:', err)
      
      let message = 'Error al iniciar sesión'
      
      if (err.response?.status === 401) {
        message = 'Email o contraseña incorrectos'
      } else if (err.response?.status === 404) {
        message = 'Clínica no encontrada'
      } else if (err.response?.data?.message) {
        message = err.response.data.message
      }

      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  async function registro(clinicaSlug, datos) {
    loading.value = true
    error.value = null

    try {
      const datosRegistro = {
        ...datos,
        clinica_slug: clinicaSlug
      }

      const response = await authService.registro(datosRegistro)

      if (response.success) {
        // Auto-login después del registro
        token.value = response.token || response.data?.token
        paciente.value = response.user || response.data?.user
        clinica.value = response.clinica || response.data?.clinica

        // Guardar en localStorage
        localStorage.setItem('paciente_token', token.value)
        localStorage.setItem('paciente_user', JSON.stringify(paciente.value))
        localStorage.setItem('paciente_clinica', JSON.stringify(clinica.value))
        localStorage.setItem('clinica_slug', clinicaSlug)

        return { success: true }
      }

      throw new Error(response.message || 'Error al registrarse')
    } catch (err) {
      console.error('❌ Error registro:', err)
      
      let message = 'Error al registrarse'
      
      if (err.response?.status === 422) {
        const errors = err.response.data.errors
        if (errors) {
          message = Object.values(errors).flat().join(', ')
        } else if (err.response.data.message) {
          message = err.response.data.message
        }
      }

      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Error logout:', err)
    } finally {
      // Limpiar estado y localStorage
      paciente.value = null
      clinica.value = null
      token.value = null
      error.value = null

      localStorage.removeItem('paciente_token')
      localStorage.removeItem('paciente_user')
      localStorage.removeItem('paciente_clinica')
      localStorage.removeItem('clinica_slug')
    }
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem('paciente_token')
    const storedUser = localStorage.getItem('paciente_user')
    const storedClinica = localStorage.getItem('paciente_clinica')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        paciente.value = JSON.parse(storedUser)
      } catch (e) {
        console.error('Error parsing user:', e)
      }
      
      if (storedClinica) {
        try {
          clinica.value = JSON.parse(storedClinica)
        } catch (e) {
          console.error('Error parsing clinica:', e)
        }
      }
    }
  }

  async function fetchPerfil() {
    try {
      const response = await authService.getPerfil()
      
      if (response.success) {
        paciente.value = response.data
        clinica.value = response.data.clinica || clinica.value
        
        // Actualizar localStorage
        localStorage.setItem('paciente_user', JSON.stringify(response.data))
        
        return { success: true }
      }

      throw new Error(response.message || 'Error al cargar perfil')
    } catch (err) {
      console.error('❌ Error fetchPerfil:', err)
      return { success: false }
    }
  }

  async function actualizarPerfil(datos) {
    try {
      const response = await authService.actualizarPerfil(datos)
      
      if (response.success) {
        // Actualizar el store
        paciente.value = { ...paciente.value, ...response.data }
        
        // Actualizar localStorage
        localStorage.setItem('paciente_user', JSON.stringify(paciente.value))
        
        return { success: true }
      }

      throw new Error(response.message || 'Error al actualizar perfil')
    } catch (err) {
      console.error('❌ Error actualizarPerfil:', err)
      error.value = err.message || 'Error al actualizar perfil'
      return { success: false, message: error.value }
    }
  }

  async function cambiarPassword(passwordActual, passwordNuevo, passwordNuevoConfirmation) {
    try {
      const response = await authService.cambiarPassword(
        passwordActual,
        passwordNuevo,
        passwordNuevoConfirmation
      )
      
      if (response.success) {
        return { success: true }
      }

      throw new Error(response.message || 'Error al cambiar contraseña')
    } catch (err) {
      console.error('❌ Error cambiarPassword:', err)
      
      let message = 'Error al cambiar contraseña'
      
      if (err.response?.status === 422) {
        message = err.response.data.message || 'La contraseña actual es incorrecta'
      }
      
      throw new Error(message)
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    paciente,
    clinica,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    nombreCompleto,
    iniciales,
    
    // Actions
    login,
    registro,
    logout,
    checkAuth,
    fetchPerfil,
    actualizarPerfil,
    cambiarPassword,
    clearError
  }
})