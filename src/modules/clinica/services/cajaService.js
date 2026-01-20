// modules/clinica/services/cajaService.js
import api from './api'

export default {
  /**
   * Obtener estado de la caja actual
   */
  async getCajaActual() {
    const response = await api.get('/caja/actual')
    return response.data
  },

  /**
   * Abrir caja
   */
  async abrirCaja(monto_apertura) {
    const response = await api.post('/caja/abrir', { monto_apertura })
    return response.data
  },

  /**
   * Cerrar caja
   */
  async cerrarCaja(data) {
    const response = await api.post('/caja/cerrar', data)
    return response.data
  },

  /**
   * Registrar movimiento manual
   */
  async registrarMovimiento(data) {
    const response = await api.post('/caja/movimiento', data)
    return response.data
  },

  /**
   * Historial de cajas
   */
  async getHistorial(params = {}) {
    const response = await api.get('/caja/historial', { params })
    return response.data
  }
}
