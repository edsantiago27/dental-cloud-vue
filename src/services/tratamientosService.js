// services/tratamientosService.js
import api from './api'

export default {
  /**
   * Obtener lista de tratamientos con paginación y filtros
   */
  async getAll(params = {}) {
    const response = await api.get('/tratamientos', { params })
    return response.data
  },

  /**
   * Obtener un tratamiento por ID
   */
  async getById(id) {
    const response = await api.get(`/tratamientos/${id}`)
    return response.data
  },

  /**
   * Crear un nuevo tratamiento
   */
  async create(tratamientoData) {
    const response = await api.post('/tratamientos', tratamientoData)
    return response.data
  },

  /**
   * Actualizar un tratamiento existente
   */
  async update(id, tratamientoData) {
    const response = await api.put(`/tratamientos/${id}`, tratamientoData)
    return response.data
  },

  /**
   * Eliminar un tratamiento
   */
  async delete(id) {
    const response = await api.delete(`/tratamientos/${id}`)
    return response.data
  },

  /**
   * Buscar tratamientos
   */
  async search(query) {
    const response = await api.get('/tratamientos/search', {
      params: { q: query }
    })
    return response.data
  },

  /**
   * Obtener categorías de tratamientos
   */
  async getCategorias() {
    const response = await api.get('/tratamientos/categorias')
    return response.data
  }
}