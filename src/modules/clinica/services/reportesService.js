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
  },

  /**
   * Descargar reporte de citas en Excel
   */
  async downloadCitasExcel(params = {}) {
    const response = await api.get('/export/citas', {
      params,
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `reporte_citas_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return { success: true }
  },

  /**
   * Descargar reporte de pacientes en Excel
   */
  async downloadPacientesExcel(params = {}) {
    const response = await api.get('/export/pacientes', {
      params,
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `reporte_pacientes_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return { success: true }
  }
}
