import { apiBase } from '@/services/apiBase'

export const suscripcionService = {
  /**
   * Obtener información completa de suscripción
   */
  async getSuscripcion() {
    const response = await apiBase.get('/mi-clinica/suscripcion')
    return response.data
  },

  /**
   * Obtener solo estadísticas de uso
   */
  async getUso() {
    const response = await apiBase.get('/mi-clinica/uso')
    return response.data
  },

  /**
   * Verificar si puede agregar más recursos
   * @param {string} tipo - 'usuario' | 'profesional' | 'paciente'
   */
  async puedeAgregar(tipo) {
    const response = await apiBase.get(`/mi-clinica/puede-agregar/${tipo}`)
    return response.data
  },

  /**
   * Hacer upgrade de plan
   * @param {number} planId - ID del nuevo plan
   */
  async upgrade(planId) {
    const response = await apiBase.post('/mi-clinica/upgrade', { planid: planId })
    return response
  },

  /**
   * Obtener facturas
   */
  async getFacturas(params = {}) {
    let endpoint = '/mi-clinica/facturas'
    if (Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString()
      endpoint += `?${queryString}`
    }
    
    const response = await apiBase.get(endpoint)
    return response.data
  }
}
