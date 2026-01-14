// src/services/configuracionService.js
import api from './api'

export default {
  /**
   * Obtener configuración de la clínica
   */
  async getConfiguracion() {
    const response = await api.get('/configuracion')
    return response.data
  },

  /**
   * Actualizar configuración general
   */
  async updateGeneral(data) {
    const response = await api.put('/configuracion/general', data)
    return response.data
  },

  /**
   * Actualizar logo
   */
  async updateLogo(formData) {
    const response = await api.post('/configuracion/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  /**
   * Actualizar colores de branding
   */
  async updateBranding(data) {
    const response = await api.put('/configuracion/branding', data)
    return response.data
  },

  /**
   * Actualizar horarios de atención
   */
  async updateHorarios(data) {
    const response = await api.put('/configuracion/horarios', data)
    return response.data
  },

  /**
   * Actualizar preferencias del sistema
   */
  async updatePreferencias(data) {
    const response = await api.put('/configuracion/preferencias', data)
    return response.data
  },

  /**
   * Actualizar datos fiscales
   */
  async updateFiscales(data) {
    const response = await api.put('/configuracion/fiscales', data)
    return response.data
  }
}