// src/services/superadmin/api.js
import axios from 'axios'

// Crear instancia de axios para SuperAdmin
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superadmintoken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Solo forzar logout si no estamos en login
      if (!window.location.pathname.includes('/superadmin/login')) {
        localStorage.removeItem('superadmintoken')
        localStorage.removeItem('superadminuser')
        window.location.href = '/superadmin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api