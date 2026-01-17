// src/services/superadmin/authService.js
import api from './api'

// Login de SuperAdmin
export async function login(email, password) {
  const response = await api.post('/superadmin/login', {
    email,
    password
  })
  return response.data
}

// Logout
export async function logout() {
  const response = await api.post('/superadmin/logout')
  return response.data
}

// Obtener perfil del SuperAdmin
export async function getProfile() {
  const response = await api.get('/superadmin/me')
  return response.data
}

// Verificar token
export async function verifyToken() {
  const response = await api.get('/superadmin/me')
  return response.data
}

export default {
  login,
  logout,
  getProfile,
  verifyToken
}