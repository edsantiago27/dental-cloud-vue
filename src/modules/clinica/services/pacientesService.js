// services/pacientesService.js
import api from './api'

export default {
  /**
   * Obtener lista de pacientes con paginación y filtros
   */
  async getAll(params = {}) {
    const response = await api.get('/pacientes', { params })
    return response.data
  },

  /**
   * Obtener un paciente por ID
   */
  async getById(id) {
    const response = await api.get(`/pacientes/${id}`)
    return response.data
  },

  /**
   * Crear un nuevo paciente
   */
  async create(pacienteData) {
    const response = await api.post('/pacientes', pacienteData)
    return response.data
  },

  /**
   * Actualizar un paciente existente
   */
  async update(id, pacienteData) {
    const response = await api.put(`/pacientes/${id}`, pacienteData)
    return response.data
  },

  /**
   * Eliminar un paciente
   */
  async delete(id) {
    const response = await api.delete(`/pacientes/${id}`)
    return response.data
  },

  /**
   * Buscar pacientes
   */
  async search(query) {
    const response = await api.get('/pacientes/search', {
      params: { q: query }
    })
    return response.data
  }
}