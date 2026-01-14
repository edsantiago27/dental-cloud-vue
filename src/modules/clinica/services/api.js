// modules/clinica/services/api.js
import { createApiInstance } from '@shared/services/apiBase'

const api = createApiInstance({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  tokenKey: 'token' // Key en localStorage
})

export default api
