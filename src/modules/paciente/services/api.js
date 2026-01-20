// modules/paciente/services/api.js
import { createApiInstance } from '@shared/services/apiBase'

const api = createApiInstance({
  baseURL: import.meta.env.VITE_PACIENTE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  tokenKey: 'paciente_token' // ✅ CORREGIDO: Usar la key correcta
})

// Interceptor para manejar errores 401 (Sesión expirada)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🔒 Sesión expirada o inválida, redirigiendo a login...')
      localStorage.removeItem('paciente_token')
      localStorage.removeItem('paciente_user')
      if (window.location.pathname.startsWith('/paciente') && !window.location.pathname.includes('/login')) {
        window.location.href = '/paciente/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
