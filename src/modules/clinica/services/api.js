// modules/clinica/services/api.js
import { createApiInstance } from '@shared/services/apiBase'

const api = createApiInstance({
  tokenKey: 'token' // Key en localStorage
})

export default api
