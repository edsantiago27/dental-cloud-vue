/**
 * apiBase.js
 * ==========
 * Cliente HTTP para comunicación con el backend
 * Compatible con la arquitectura del proyecto
 */

// Base URL del API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'

/**
 * Obtener token de autenticación
 */
function getToken() {
  return localStorage.getItem('token')
}

/**
 * Obtener headers para requests
 */
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

/**
 * Manejar respuesta del API
 */
async function handleResponse(response) {
  const data = await response.json()
  
  if (!response.ok) {
    // Si es 401, redirigir a login
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('clinica')
      window.location.href = '/login.html'
    }
    
    throw new Error(data.message || 'Error en la petición')
  }
  
  return data
}

/**
 * Cliente API
 */
export const apiBase = {
  /**
   * GET request
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders()
      })
      return await handleResponse(response)
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error)
      throw error
    }
  },

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return await handleResponse(response)
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error)
      throw error
    }
  },

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      return await handleResponse(response)
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error)
      throw error
    }
  },

  /**
   * DELETE request
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      return await handleResponse(response)
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error)
      throw error
    }
  }
}

export default apiBase