// src/services/paciente/authService.js
// ADAPTADO PARA USAR LAS RUTAS EXISTENTES
import api from './api'

/**
 * Login de paciente
 * Ruta backend: POST /auth/login/paciente
 */
export async function login(clinicaSlug, email, password) {
  const response = await api.post('/auth/login/paciente', {
    clinica_slug: clinicaSlug,
    email,
    password
  })
  return response.data
}

/**
 * Registro de paciente
 * Ruta backend: POST /auth/registro/paciente
 */
export async function registro(data) {
  const response = await api.post('/auth/registro/paciente', data)
  return response.data
}

/**
 * Logout
 * Ruta backend: POST /logout (con auth:sanctum)
 */
export async function logout() {
  const response = await api.post('/logout')
  return response.data
}

/**
 * Obtener perfil del paciente autenticado
 * Ruta backend: GET /paciente/perfil
 */
export async function getPerfil() {
  const response = await api.get('/paciente/perfil')
  return response.data
}

/**
 * Actualizar perfil
 * Ruta backend: PUT /paciente/perfil
 */
export async function actualizarPerfil(data) {
  const response = await api.put('/paciente/perfil', data)
  return response.data
}

/**
 * Cambiar contraseña
 * Ruta backend: PUT /paciente/cambiar-password
 */
export async function cambiarPassword(passwordActual, password, passwordConfirmation) {
  const response = await api.put('/paciente/cambiar-password', {
    password_actual: passwordActual,
    password: password,
    password_confirmation: passwordConfirmation
  })
  return response.data
}

export default {
  login,
  registro,
  logout,
  getPerfil,
  actualizarPerfil,
  cambiarPassword
}