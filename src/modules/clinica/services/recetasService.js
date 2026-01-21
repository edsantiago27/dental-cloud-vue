// modules/clinica/services/recetasService.js
import api from './api'

export default {
  /**
   * Obtener lista de recetas
   */
  async getAll(params = {}) {
    const response = await api.get('/recetas', { params })
    return response.data
  },

  /**
   * Obtener una receta por ID
   */
  async getById(id) {
    const response = await api.get(`/recetas/${id}`)
    return response.data
  },

  /**
   * Crear una nueva receta
   */
  async create(data) {
    const response = await api.post('/recetas', data)
    return response.data
  },

  /**
   * Anular una receta
   */
  async anular(id, motivo) {
    const response = await api.post(`/recetas/${id}/anular`, { motivo })
    return response.data
  },

  /**
   * Enviar receta por email
   */
  async enviarEmail(id) {
    const response = await api.post(`/recetas/${id}/enviar`)
    return response.data
  },

  /**
   * Obtener medicamentos comunes para autocompletado
   */
  async getMedicamentosComunes() {
    const response = await api.get('/recetas/medicamentos-comunes')
    return response.data
  },

  /**
   * Descargar PDF de receta (con autenticación)
   */
  async downloadPdf(id) {
    const response = await api.get(`/recetas/${id}/pdf`, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `receta-${id}.pdf`
    document.body.appendChild(link)
    link.click()
    
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return { success: true }
  },

  /**
   * Generar URL para descarga de PDF (legacy)
   */
  getPdfUrl(id) {
    return `${api.defaults.baseURL}/recetas/${id}/pdf`
  }
}
