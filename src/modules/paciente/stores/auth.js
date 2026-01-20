// src/stores/paciente/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services'

export const usePacienteAuthStore = defineStore('pacienteAuth', () => {
  // State
  const user = ref(null)
  const clinica = ref(null)
  const clinicas = ref([])
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isPacienteUser = computed(() => true)
  
  const userName = computed(() => {
    if (!user.value) return ''
    return `${user.value.nombre || ''} ${user.value.apellido || ''}`.trim()
  })

  const userInitials = computed(() => {
    if (!user.value) return '?'
    const n = user.value.nombre?.[0] || ''
    const a = user.value.apellido?.[0] || ''
    return (n + a).toUpperCase() || '?'
  })

  // Paciente tiene múltiples clínicas
  const hasMultipleClinics = computed(() => clinicas.value.length > 1)

  // Mantener alias para compatibilidad interna si se requiere
  const paciente = computed(() => user.value)

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

    // Aceptar respuestas exitosas implícitas
    if (response.success !== false) {
      // El token puede venir directo o en data
      const authData = response.data || response // Fallback si la respuesta raíz tiene los datos
      
      // Token priority: authData.token > authData.access_token
      token.value = authData.token || authData.access_token
      user.value = authData.user || authData.paciente
      clinica.value = authData.clinica
      clinicas.value = authData.clinicas || []

      if (token.value) {
        localStorage.setItem('paciente_token', token.value)
      }
      
      if (user.value) {
        localStorage.setItem('paciente_user', JSON.stringify(user.value))
      }
      
      if (clinica.value) {
        localStorage.setItem('paciente_clinica', JSON.stringify(clinica.value))
      }

      if (clinicas.value.length > 0) {
        localStorage.setItem('paciente_clinicas', JSON.stringify(clinicas.value))
      }
      
      localStorage.setItem('clinica_slug', clinicaSlug)

      return { 
        success: true, 
        requiresSelection: clinicas.value.length > 1,
        clinicas: clinicas.value
      }
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

    if (response.success !== false) {
      const authData = response.data || response
      
      token.value = authData.token || authData.access_token
      user.value = authData.user || authData.paciente
      clinica.value = authData.clinica
      clinicas.value = authData.clinicas || []

      // Guardar en localStorage
      if (token.value) {
        localStorage.setItem('paciente_token', token.value)
      }
      if (user.value) {
        localStorage.setItem('paciente_user', JSON.stringify(user.value))
      }
      if (clinica.value) {
        localStorage.setItem('paciente_clinica', JSON.stringify(clinica.value))
      }
      if (clinicas.value.length > 0) {
        localStorage.setItem('paciente_clinicas', JSON.stringify(clinicas.value))
      }
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
      user.value = null
      clinica.value = null
      clinicas.value = []
      token.value = null
      error.value = null

      localStorage.removeItem('paciente_token')
      localStorage.removeItem('paciente_user')
      localStorage.removeItem('paciente_clinica')
      localStorage.removeItem('paciente_clinicas')
      localStorage.removeItem('clinica_slug')
    }
  }

  async function selectClinica(clinicaId) {
    loading.value = true
    error.value = null
    try {
      const selected = clinicas.value.find(c => c.id === clinicaId)
      if (selected) {
        clinica.value = selected
        localStorage.setItem('paciente_clinica', JSON.stringify(selected))
        return { success: true }
      }
      throw new Error('Clínica no encontrada en la lista')
    } catch (err) {
      error.value = err.message
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  async function switchClinica(clinicaId) {
    clinica.value = null
    return await selectClinica(clinicaId)
  }

  async function checkAuth() {
    const storedToken = localStorage.getItem('paciente_token')
    const storedUser = localStorage.getItem('paciente_user')
    const storedClinica = localStorage.getItem('paciente_clinica')
    const storedClinicas = localStorage.getItem('paciente_clinicas')

    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
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

      if (storedClinicas) {
        try {
          clinicas.value = JSON.parse(storedClinicas)
        } catch (e) {
          console.error('Error parsing clinicas:', e)
        }
      }
    }
  }

  async function fetchPerfil() {
    try {
      const response = await authService.getPerfil()
      
      if (response.success) {
        user.value = response.data
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
        user.value = { ...user.value, ...response.data }
        
        // Actualizar localStorage
        localStorage.setItem('paciente_user', JSON.stringify(user.value))
        
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
    user,
    clinica,
    clinicas,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userName,
    isPacienteUser,
    hasMultipleClinics,
    
    // Actions
    login,
    registro,
    logout,
    selectClinica,
    switchClinica,
    checkAuth,
    fetchPerfil,
    actualizarPerfil,
    cambiarPassword,
    clearError
  }
})