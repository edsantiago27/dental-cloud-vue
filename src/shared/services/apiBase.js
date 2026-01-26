// shared/services/apiBase.js
import axios from 'axios'

/**
 * Crear instancia de Axios con configuración base
 */
export function createApiInstance(config = {}) {
  const instance = axios.create({
    baseURL: config.baseURL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...config.headers
    },
    withCredentials: config.withCredentials || false,
    ...config
  })

  // ==========================================
  // REQUEST INTERCEPTOR
  // ==========================================
  instance.interceptors.request.use(
    (requestConfig) => {
      // Agregar token si existe
      const tokenKey = config.tokenKey || 'token'
      const token = localStorage.getItem(tokenKey)
      
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`
      }

      console.log(`🔄 ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`, requestConfig.data || '')

      return requestConfig
    },
    (error) => {
      console.error('❌ Error en request:', error)
      return Promise.reject(error)
    }
  )

  // ==========================================
  // RESPONSE INTERCEPTOR
  // ==========================================
  instance.interceptors.response.use(
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
      console.error('Data:', error.response?.data)
      
      // Si es error 422, mostrar errores de validación
      if (error.response?.status === 422) {
        console.group('📋 ERRORES DE VALIDACIÓN (422)')
        
        if (error.response?.data?.errors) {
          Object.entries(error.response.data.errors).forEach(([campo, mensajes]) => {
            console.error(`❌ ${campo}:`, mensajes)
          })
        }
        
        console.groupEnd()
      }
      
      console.groupEnd()
      
      return Promise.reject(error)
    }
  )

  return instance
}

export default createApiInstance()
