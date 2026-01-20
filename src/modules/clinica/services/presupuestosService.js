// modules/clinica/services/presupuestosService.js
import api from './api'

export default {
  /**
   * Obtener lista de presupuestos
   */
  async getAll(params = {}) {
    const response = await api.get('/presupuestos', { params })
    return response.data
  },

  /**
   * Obtener un presupuesto por ID
   */
  async getById(id) {
    const response = await api.get(`/presupuestos/${id}`)
    return response.data
  },

  /**
   * Crear un nuevo presupuesto
   */
  async create(data) {
    const response = await api.post('/presupuestos', data)
    return response.data
  },

  /**
   * Actualizar un presupuesto
   */
  async update(id, data) {
    const response = await api.put(`/presupuestos/${id}`, data)
    return response.data
  },

  /**
   * Eliminar/Anular un presupuesto
   */
  async delete(id) {
    const response = await api.delete(`/presupuestos/${id}`)
    return response.data
  },

  /**
   * Enviar presupuesto por email
   */
  async enviarEmail(id) {
    const response = await api.post(`/presupuestos/${id}/enviar`)
    return response.data
  },

  /**
   * Convertir presupuesto a factura/cargo
   */
  async convertirAFactura(id) {
    const response = await api.post(`/presupuestos/${id}/convertir-factura`)
    return response.data
  },

  /**
   * Generar URL para descarga de PDF
   */
  getPdfUrl(id) {
    return `${api.defaults.baseURL}/presupuestos/${id}/pdf`
  }
}
