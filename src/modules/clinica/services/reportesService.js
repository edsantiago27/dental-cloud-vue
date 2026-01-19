// src/modules/clinica/services/reportesService.js (ACTUALIZADO)
import api from './api'

export const reportesService = {
  async getResumen(params = {}) {
    const { data } = await api.get('/reportes/resumen', { params })
    return data
  },

  async getRendimientoProfesionales(params = {}) {
    const { data } = await api.get('/reportes/rendimiento-profesionales', { params })
    return data
  },

  async getPacientesNuevos(params = {}) {
    const { data } = await api.get('/reportes/pacientes-nuevos', { params })
    return data
  },

  async getDistribucionEstados(params = {}) {
    const { data } = await api.get('/reportes/distribucion-estados', { params })
    return data
  },

  async getHorariosPopulares(params = {}) {
    const { data } = await api.get('/reportes/horarios-populares', { params })
    return data
  },

  async getDiasPopulares(params = {}) {
    const { data } = await api.get('/reportes/dias-populares', { params })
    return data
  }
}
