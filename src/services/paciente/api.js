// src/services/paciente/api.js
import axios from 'axios'

// Crear instancia de axios para Paciente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('paciente_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Si el error es 401 (no autorizado), limpiar token y redirigir a login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('paciente_token')
      localStorage.removeItem('paciente_user')
      localStorage.removeItem('paciente_clinica')
      
      // Redirigir a login si no estamos ya ahí
      const clinicaSlug = localStorage.getItem('clinica_slug') || 'demo'
      if (!window.location.pathname.includes('/paciente/login')) {
        window.location.href = `/${clinicaSlug}/paciente/login`
      }
    }
    
    return Promise.reject(error)
  }
)

export default api