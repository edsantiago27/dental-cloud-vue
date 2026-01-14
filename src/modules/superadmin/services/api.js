// modules/superadmin/services/api.js
import { createApiInstance } from '@shared/services/apiBase'

const api = createApiInstance({
  baseURL: import.meta.env.VITE_SUPERADMIN_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8001/api',
  tokenKey: 'sa_token' // Token diferente para superadmin
})

export default api
