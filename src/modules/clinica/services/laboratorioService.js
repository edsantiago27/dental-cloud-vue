// modules/clinica/services/laboratorioService.js
import api from './api'

export default {
  /**
   * Obtener órdenes de laboratorio
   */
  async getOrdenes(params = {}) {
    const response = await api.get('/laboratorio/ordenes', { params })
    return response.data
  },

  /**
   * Crear nueva orden
   */
  async createOrden(data) {
    const response = await api.post('/laboratorio/ordenes', data)
    return response.data
  },

  /**
   * Cambiar estado de orden
   */
  async updateEstado(id, estado, fecha_entrega_real = null) {
    const response = await api.patch(`/laboratorio/ordenes/${id}/estado`, { 
      estado, 
      fecha_entrega_real 
    })
    return response.data
  },

  /**
   * Gestión de Proveedores de Laboratorio
   */
  async getLaboratorios() {
    const response = await api.get('/laboratorio/proveedores')
    return response.data
  },

  async createLaboratorio(data) {
    const response = await api.post('/laboratorio/proveedores', data)
    return response.data
  }
}
