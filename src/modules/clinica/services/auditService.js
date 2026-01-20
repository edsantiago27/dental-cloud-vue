import api from './api'

/**
 * Servicio para gestión de auditoría y cumplimiento
 */
export const auditService = {
  /**
   * Obtener logs de auditoría generales
   */
  async getLogs(params = {}) {
    const response = await api.get('/audit/logs', { params })
    return response.data
  },

  /**
   * Obtener historial de un registro específico
   * @param {string} model - Tipo de modelo (paciente, receta, etc.)
   * @param {number|string} id - ID del registro
   */
  async getModelHistory(model, id) {
    const response = await api.get(`/audit/historial/${model}/${id}`)
    return response.data
  }
}

export default auditService
