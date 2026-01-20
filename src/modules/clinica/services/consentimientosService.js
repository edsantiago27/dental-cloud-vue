import api from './api'

/**
 * Servicio para gestión de Consentimientos Informados y Firmas Digitales
 */
export const consentimientosService = {
  /**
   * Listar consentimientos
   */
  async getConsentimientos(params = {}) {
    const response = await api.get('/consentimientos', { params })
    return response.data
  },

  /**
   * Crear nuevo consentimiento (borrador)
   */
  async createConsentimiento(data) {
    const response = await api.post('/consentimientos', data)
    return response.data
  },

  /**
   * Obtener detalle de un consentimiento
   */
  async getConsentimiento(id) {
    const response = await api.get(`/consentimientos/${id}`)
    return response.data
  },

  /**
   * Registrar firma digital (Base64)
   */
  async firmar(id, firma) {
    const response = await api.post(`/consentimientos/${id}/firmar`, { firma })
    return response.data
  }
}

export default consentimientosService
