// services/citasService.js
import api from './api'

export default {
  /**
   * Obtener lista de citas con filtros
   */
  async getAll(params = {}) {
    const response = await api.get('/citas', { params })
    return response.data
  },

  /**
   * Obtener citas de un rango de fechas (para calendario)
   */
  async getByDateRange(start, end, params = {}) {
    const response = await api.get('/citas', {
      params: {
        fecha_inicio: start,
        fecha_fin: end,
        ...params
      }
    })
    return response.data
  },

  /**
   * Obtener una cita por ID
   */
  async getById(id) {
    const response = await api.get(`/citas/${id}`)
    return response.data
  },

  /**
   * Crear una nueva cita
   */
  async create(citaData) {
    const response = await api.post('/citas', citaData)
    return response.data
  },

  /**
   * Actualizar una cita existente
   */
  async update(id, citaData) {
    const response = await api.put(`/citas/${id}`, citaData)
    return response.data
  },

  /**
   * Cambiar estado de una cita
   */
  async updateStatus(id, estado) {
    const response = await api.patch(`/citas/${id}/estado`, { estado })
    return response.data
  },

  /**
   * Cancelar una cita
   */
  async cancel(id, motivo = '') {
    const response = await api.post(`/citas/${id}/cancelar`, { motivo })
    return response.data
  },

  /**
   * Confirmar una cita
   */
  async confirm(id) {
    const response = await api.post(`/citas/${id}/confirmar`)
    return response.data
  },

  /**
   * Eliminar una cita
   */
  async delete(id) {
    const response = await api.delete(`/citas/${id}`)
    return response.data
  },

  /**
   * Verificar disponibilidad de horario
   */
  async checkAvailability(fecha, hora, profesional_id, duracion_minutos, exclude_cita_id = null) {
    const response = await api.get('/citas/verificar-disponibilidad', {
      params: {
        fecha,
        hora,
        profesional_id,
        duracion_minutos,
        exclude_cita_id
      }
    })
    return response.data
  },

  /**
   * Obtener citas del día
   */
  async getToday(profesional_id = null) {
    const params = {}
    if (profesional_id) {
      params.profesional_id = profesional_id
    }
    const response = await api.get('/citas/hoy', { params })
    return response.data
  }
}