// modules/paciente/services/api.js
import { createApiInstance } from '@shared/services/apiBase'

const api = createApiInstance({
  baseURL: import.meta.env.VITE_PACIENTE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  tokenKey: 'token' // Mismo token que clínica
})

export default api
