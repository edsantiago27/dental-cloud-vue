// shared/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
//import api from '@shared/services/api'

export const useAuthStore = defineStore('auth', () => {
  // ==========================================
  // STATE
  // ==========================================
  
  const user = ref(null)
  const clinica = ref(null)
  const clinicas = ref([]) // Lista de clínicas del paciente
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const userType = ref(null) // 'clinica' o 'paciente'

  // ==========================================
  // GETTERS
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
  
  // Roles de CLÍNICA
  const isAdmin = computed(() => user.value?.rol === 'admin_clinica')
  const isDoctor = computed(() => user.value?.rol === 'doctor')
  const isRecepcionista = computed(() => user.value?.rol === 'recepcionista')
  
  // Rol de PACIENTE
  const isPaciente = computed(() => user.value?.rol === 'paciente')
  
  // Tipo de usuario
  const isClinicaUser = computed(() => userType.value === 'clinica')
  const isPacienteUser = computed(() => userType.value === 'paciente')
  
  // Paciente tiene múltiples clínicas
  const hasMultipleClinics = computed(() => clinicas.value.length > 1)

  // ==========================================
  // ACTIONS - LOGIN CLÍNICA
  // ==========================================
  
  async function loginClinica(credentials) {
    loading.value = true
    error.value = null

    try {
      console.log('🔐 Login Clínica...', {
        clinica_slug: credentials.clinica_slug,
        email: credentials.email
      })

      const { default: api } = await import('@clinica/services/api')
     const response = await api.post('/auth/login/usuario', {
  clinica_slug: credentials.clinica_slug,
  email: credentials.email,
  password: credentials.password
})

console.log('📦 Respuesta completa del servidor:', response)

// Laravel envuelve la respuesta en { success, message, data }
// Extraer el objeto data que contiene { token, user, clinica }
let authData = response.data || response

// Si la respuesta tiene un campo "data" anidado, usarlo
if (authData.data && authData.data.token) {
  authData = authData.data
}

console.log('🔑 Datos de autenticación:', authData)

if (!authData.token) {
  throw new Error('Token no recibido del servidor')
}

// Guardar en state
token.value = authData.token
user.value = authData.user
clinica.value = authData.clinica
userType.value = 'clinica'
clinicas.value = []


      // Persistir en localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('clinica', JSON.stringify(clinica.value))
      localStorage.setItem('userType', 'clinica')

      console.log('✅ Login Clínica exitoso')

      return { success: true }

    } catch (err) {
      console.error('❌ Error en login clínica:', err)
      logout()
      error.value = parseError(err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // ==========================================
  // ACTIONS - LOGIN PACIENTE
  // ==========================================
  
  async function loginPaciente(credentials) {
  loading.value = true
  error.value = null

  try {
    console.log('🔐 Login Paciente...', {
      email: credentials.email
    })

    const response = await api.post('/auth/login/paciente', {
      email: credentials.email,
      password: credentials.password
    })

    console.log('📦 Respuesta completa del servidor:', response)

    // Laravel envuelve la respuesta en { success, message, data }
    let authData = response.data || response

    // Si la respuesta tiene un campo "data" anidado, usarlo
    if (authData.data && authData.data.token) {
      authData = authData.data
    }

    console.log('🔑 Datos de autenticación:', authData)

    if (!authData.token) {
      throw new Error('Token no recibido del servidor')
    }

    // Guardar token y usuario
    token.value = authData.token
    user.value = authData.user
    userType.value = 'paciente'

    // Persistir básico (sin clínica aún)
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('userType', 'paciente')

    // Verificar si tiene clínicas
    if (authData.clinicas && Array.isArray(authData.clinicas)) {
      clinicas.value = authData.clinicas
      localStorage.setItem('clinicas', JSON.stringify(clinicas.value))

      console.log(`✅ Login Paciente exitoso - ${clinicas.value.length} clínica(s)`)

      // Si tiene múltiples clínicas, requiere selección
      if (clinicas.value.length > 1) {
        return { 
          success: true, 
          requiresSelection: true,
          clinicas: clinicas.value
        }
      }
      
      // Si tiene solo una, seleccionarla automáticamente
      if (clinicas.value.length === 1) {
        clinica.value = clinicas.value[0]
        localStorage.setItem('clinica', JSON.stringify(clinica.value))
        
        return { 
          success: true, 
          requiresSelection: false
        }
      }
    }

    // Sin clínicas asignadas
    console.log('⚠️ Paciente sin clínicas asignadas')
    return { 
      success: true, 
      requiresSelection: false,
      noClinicas: true
    }

  } catch (err) {
    console.error('❌ Error en login paciente:', err)
    logout()
    error.value = parseError(err)
    return { success: false, message: error.value }
  } finally {
    loading.value = false
  }
}


  // ==========================================
  // ACTIONS - SELECCIONAR CLÍNICA (PACIENTE)
  // ==========================================
  
  async function selectClinica(clinicaId) {
    if (!isPacienteUser.value) {
      console.error('❌ Solo pacientes pueden seleccionar clínica')
      return { success: false, message: 'Acción no permitida' }
    }

    loading.value = true
    error.value = null

    try {
      console.log('🏥 Seleccionando clínica...', clinicaId)

      // Buscar la clínica en la lista
      const selectedClinica = clinicas.value.find(c => c.id === clinicaId)
      
      if (!selectedClinica) {
        throw new Error('Clínica no encontrada en tu lista')
      }

      // Opcional: Hacer llamada al backend para obtener datos adicionales
      const response = await api.post('/paciente/select-clinica', {
        clinica_id: clinicaId
      })

      const data = response.data || response

      // Actualizar clínica seleccionada
      clinica.value = data.clinica || selectedClinica
      
      // Guardar en localStorage
      localStorage.setItem('clinica', JSON.stringify(clinica.value))

      console.log('✅ Clínica seleccionada:', clinica.value.nombre)

      return { success: true }

    } catch (err) {
      console.error('❌ Error al seleccionar clínica:', err)
      error.value = parseError(err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // ==========================================
  // ACTIONS - CAMBIAR CLÍNICA (PACIENTE)
  // ==========================================
  
  async function switchClinica(clinicaId) {
    // Reutilizar selectClinica pero limpiar datos previos
    clinica.value = null
    return await selectClinica(clinicaId)
  }

  // ==========================================
  // ACTIONS - COMPARTIDAS
  // ==========================================
  
  async function logout() {
    try {
      if (token.value) {
        await api.post('/logout').catch(() => {
          console.log('⚠️ Error al hacer logout en servidor')
        })
      }
    } finally {
      // Limpiar state
      user.value = null
      clinica.value = null
      clinicas.value = []
      token.value = null
      error.value = null
      userType.value = null

      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('clinica')
      localStorage.removeItem('clinicas')
      localStorage.removeItem('userType')

      console.log('👋 Logout completado')
    }
  }

  function checkAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    const savedUserType = localStorage.getItem('userType')

    if (savedToken && savedUser && savedUserType) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
        userType.value = savedUserType
        
        // Restaurar clínica según tipo de usuario
        if (savedUserType === 'clinica') {
          const savedClinica = localStorage.getItem('clinica')
          if (savedClinica) {
            clinica.value = JSON.parse(savedClinica)
          }
        }
        
        if (savedUserType === 'paciente') {
          const savedClinicas = localStorage.getItem('clinicas')
          const savedClinica = localStorage.getItem('clinica')
          
          if (savedClinicas) {
            clinicas.value = JSON.parse(savedClinicas)
          }
          
          if (savedClinica) {
            clinica.value = JSON.parse(savedClinica)
          }
        }
        
        console.log(`✅ Sesión restaurada (${savedUserType})`)
        return true
      } catch (err) {
        console.error('❌ Error al restaurar sesión:', err)
        logout()
        return false
      }
    }

    return false
  }

  function clearError() {
    error.value = null
  }

  // Helper para parsear errores
  function parseError(err) {
    if (err.response?.status === 401) {
      return 'Credenciales inválidas'
    } else if (err.response?.status === 404) {
      return 'Recurso no encontrado'
    } else if (err.response?.status === 422) {
      const errors = err.response?.data?.errors
      if (errors) {
        return Object.values(errors).flat().join(', ')
      }
      return 'Datos inválidos'
    } else if (err.code === 'ERR_NETWORK') {
      return 'No se puede conectar con el servidor'
    }
    return err.response?.data?.message || err.message || 'Error desconocido'
  }

  // ==========================================
  // RETURN
  // ==========================================
  
  return {
    // State
    user,
    clinica,
    clinicas,
    token,
    loading,
    error,
    userType,
    
    // Getters
    isAuthenticated,
    userName,
    userInitials,
    isAdmin,
    isDoctor,
    isRecepcionista,
    isPaciente,
    isClinicaUser,
    isPacienteUser,
    hasMultipleClinics,
    
    // Actions
    loginClinica,
    loginPaciente,
    selectClinica,
    switchClinica,
    logout,
    checkAuth,
    clearError
  }
})
