// services/api.js
import axios from 'axios'

// Configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
api.interceptors.request.use(
  (config) => {
    // Agregar token si existe
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log(`🔄 ${config.method.toUpperCase()} ${config.url}`, config.data || '')

    return config
  },
  (error) => {
    console.error('❌ Error en request:', error)
    return Promise.reject(error)
  }
)

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    // Log completo del error
    console.group('❌ ERROR DE API')
    console.error('URL:', error.config?.url)
    console.error('Método:', error.config?.method?.toUpperCase())
    console.error('Status:', error.response?.status)
    console.error('Mensaje:', error.message)
    console.error('Data completo:', error.response?.data)
    
    // Si es error 422, mostrar errores de validación
    if (error.response?.status === 422) {
      console.group('📋 ERRORES DE VALIDACIÓN (422)')
      
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([campo, mensajes]) => {
          console.error(`❌ ${campo}:`, mensajes)
        })
      } else {
        console.error('No se encontraron errores específicos en response.data.errors')
        console.error('Response data:', error.response?.data)
      }
      
      console.groupEnd()
    }
    
    console.groupEnd()
    
    return Promise.reject(error)
  }
)

export default api