// modules/superadmin/services/api.js
import { createApiInstance } from '@shared/services/apiBase'

const api = createApiInstance({
  baseURL: import.meta.env.VITE_SUPERADMIN_API_URL,
  tokenKey: 'sa_token' // Token diferente para superadmin
})

export default api
