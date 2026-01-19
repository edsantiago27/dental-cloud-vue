import api from './api'

export const suscripcionService = {
  /**
   * Obtener información completa de suscripción
   */
  async getSuscripcion() {
    const { data } = await api.get('/mi-clinica/suscripcion')
    return data.data
  },

  /**
   * Obtener solo estadísticas de uso
   */
  async getUso() {
    const { data } = await api.get('/mi-clinica/uso')
    return data.data
  },

  /**
   * Verificar si puede agregar más recursos
   * @param {string} tipo - 'usuario' | 'profesional' | 'paciente'
   */
  async puedeAgregar(tipo) {
    const { data } = await api.get(`/mi-clinica/puede-agregar/${tipo}`)
    return data.data
  },

  /**
   * Hacer upgrade de plan
   * @param {number} planId - ID del nuevo plan
   */
  async upgrade(planId) {
    const { data } = await api.post('/mi-clinica/upgrade', { planid: planId })
    return data
  },

  /**
   * Obtener facturas
   */
  async getFacturas(params = {}) {
    // Axios maneja query params automáticamente con 'params'
    const { data } = await api.get('/mi-clinica/facturas', { params })
    return data.data
  }
}
