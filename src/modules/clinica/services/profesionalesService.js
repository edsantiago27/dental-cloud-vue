// src/services/profesionalesService.js
import api from './api'

export default {
  /**
   * Obtener lista de profesionales con filtros
   */
  async getAll(params = {}) {
    const response = await api.get('/profesionales', { params })
    return response.data
  },

  /**
   * Obtener profesionales activos
   */
  async getActivos() {
    const response = await api.get('/profesionales', { 
      params: { estado: 'activo' } 
    })
    return response.data
  },

  /**
   * Obtener un profesional específico
   */
  async getById(id) {
    const response = await api.get(`/profesionales/${id}`)
    return response.data
  },

  /**
   * Crear nuevo profesional
   */
  async create(data) {
    const response = await api.post('/profesionales', data)
    return response.data
  },

  /**
   * Actualizar profesional
   */
  async update(id, data) {
    const response = await api.put(`/profesionales/${id}`, data)
    return response.data
  },

  /**
   * Eliminar profesional
   */
  async delete(id) {
    const response = await api.delete(`/profesionales/${id}`)
    return response.data
  },

  /**
   * Obtener horarios de un profesional
   */
  async getHorarios(id) {
    const response = await api.get(`/profesionales/${id}/horarios`)
    return response.data
  }
}