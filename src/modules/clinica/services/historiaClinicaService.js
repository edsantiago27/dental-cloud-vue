// services/historiaClinicaService.js
import api from './api'

export default {
  // ==========================================
  // FICHA MÉDICA
  // ==========================================

  /**
   * Obtener ficha médica del paciente
   */
  async getFichaMedica(pacienteId) {
    const response = await api.get(`/pacientes/${pacienteId}/historia-clinica`)
    return response.data
  },

  /**
   * Guardar/Actualizar ficha médica
   */
  async saveFichaMedica(pacienteId, data) {
    const response = await api.put(`/pacientes/${pacienteId}/historia-clinica/anamnesis`, data)
    return response.data
  },

  /**
   * Actualizar signos vitales
   */
  async updateSignosVitales(pacienteId, data) {
    const response = await api.put(
      `/pacientes/${pacienteId}/historia-clinica/signos-vitales`,
      data
    )
    return response.data
  },

  // ==========================================
  // ODONTOGRAMA
  // ==========================================

  /**
   * Obtener odontograma del paciente
   */
  async getOdontograma(pacienteId) {
    const response = await api.get(`/pacientes/${pacienteId}/odontograma`)
    return response.data
  },

  /**
   * Actualizar un diente específico
   */
  async updateDiente(pacienteId, dienteNumero, data) {
    console.group('🌐 historiaClinicaService - updateDiente')
    console.log('PacienteId:', pacienteId)
    console.log('DienteNumero:', dienteNumero)
    console.log('Data recibido:', data)
    console.log('Data.estado (tipo):', typeof data.estado)
    console.log('Data.estado (valor):', data.estado)
    console.log('Data.estado (JSON):', JSON.stringify(data.estado))
    
    // Asegurar que estado sea string antes de enviar
    const payload = {
      estado: String(data.estado),
      notas: data.notas || ''
    }
    
    console.log('📤 Payload final a enviar:', payload)
    console.log('Payload.estado (tipo):', typeof payload.estado)
    console.log('Payload.estado (JSON):', JSON.stringify(payload))
    console.groupEnd()
    
    const response = await api.put(
      `/pacientes/${pacienteId}/odontograma/${dienteNumero}`,
      payload
    )
    return response.data
  },

  /**
   * Guardar odontograma completo
   */
  async saveOdontograma(pacienteId, dientes) {
    const response = await api.post(`/pacientes/${pacienteId}/odontograma`, {
      dientes
    })
    return response.data
  },

  /**
   * Resetear odontograma
   */
  async resetOdontograma(pacienteId) {
    const response = await api.post(`/pacientes/${pacienteId}/odontograma/reset`)
    return response.data
  },

  // ==========================================
  // TIMELINE DE TRATAMIENTOS (ENTRADAS CLÍNICAS)
  // ==========================================

  /**
   * Obtener historial de tratamientos realizados (entradas clínicas)
   */
  async getHistorialTratamientos(pacienteId, params = {}) {
    const response = await api.get(`/pacientes/${pacienteId}/historia-clinica/entradas`, {
      params
    })
    return response.data
  },

  /**
   * Registrar tratamiento realizado (entrada clínica)
   */
  async registrarTratamiento(pacienteId, data) {
    const response = await api.post(`/pacientes/${pacienteId}/historia-clinica/entradas`, data)
    return response.data
  },

  /**
   * Obtener entradas clínicas
   */
  async getEntradas(pacienteId, params = {}) {
    const response = await api.get(`/pacientes/${pacienteId}/historia-clinica/entradas`, {
      params
    })
    return response.data
  },

  /**
   * Crear entrada clínica
   */
  async storeEntrada(pacienteId, data) {
    const response = await api.post(`/pacientes/${pacienteId}/historia-clinica/entradas`, data)
    return response.data
  },

  /**
   * Actualizar entrada clínica
   */
  async updateEntrada(pacienteId, entradaId, data) {
    const response = await api.put(
      `/pacientes/${pacienteId}/historia-clinica/entradas/${entradaId}`,
      data
    )
    return response.data
  },

  /**
   * Eliminar entrada clínica
   */
  async deleteEntrada(pacienteId, entradaId) {
    const response = await api.delete(
      `/pacientes/${pacienteId}/historia-clinica/entradas/${entradaId}`
    )
    return response.data
  },

  // ==========================================
  // DIAGNÓSTICOS Y NOTAS
  // ==========================================

  /**
   * Obtener diagnósticos del paciente
   */
  async getDiagnosticos(pacienteId, params = {}) {
    const response = await api.get(`/pacientes/${pacienteId}/historia-clinica/diagnosticos`, {
      params
    })
    return response.data
  },

  /**
   * Crear diagnóstico
   */
  async createDiagnostico(pacienteId, data) {
    const response = await api.post(`/pacientes/${pacienteId}/historia-clinica/diagnosticos`, data)
    return response.data
  },

  /**
   * Actualizar diagnóstico
   */
  async updateDiagnostico(pacienteId, diagnosticoId, data) {
    const response = await api.put(
      `/pacientes/${pacienteId}/historia-clinica/diagnosticos/${diagnosticoId}`,
      data
    )
    return response.data
  },

  /**
   * Eliminar diagnóstico
   */
  async deleteDiagnostico(pacienteId, diagnosticoId) {
    const response = await api.delete(
      `/pacientes/${pacienteId}/historia-clinica/diagnosticos/${diagnosticoId}`
    )
    return response.data
  },

  // ==========================================
  // ARCHIVOS/RADIOGRAFÍAS
  // ==========================================

  /**
   * Obtener archivos clínicos
   */
  async getArchivos(pacienteId, params = {}) {
    const response = await api.get(`/pacientes/${pacienteId}/historia-clinica/archivos`, {
      params
    })
    return response.data
  },

  /**
   * Subir archivo con progress
   */
  async uploadArchivo(pacienteId, formData, onProgress = null) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress(percentCompleted)
      }
    }

    const response = await api.post(
      `/pacientes/${pacienteId}/historia-clinica/archivos`,
      formData,
      config
    )
    return response.data
  },

  /**
   * Obtener archivo específico
   */
  async getArchivo(pacienteId, archivoId) {
    const response = await api.get(
      `/pacientes/${pacienteId}/historia-clinica/archivos/${archivoId}`
    )
    return response.data
  },

  /**
   * Descargar archivo
   */
  async downloadArchivo(pacienteId, archivoId) {
    const response = await api.get(
      `/pacientes/${pacienteId}/historia-clinica/archivos/${archivoId}`,
      {
        responseType: 'blob'
      }
    )
    return response.data
  },

  /**
   * Actualizar metadatos de archivo
   */
  async updateArchivo(pacienteId, archivoId, data) {
    const response = await api.put(
      `/pacientes/${pacienteId}/historia-clinica/archivos/${archivoId}`,
      data
    )
    return response.data
  },

  /**
   * Eliminar archivo
   */
  async deleteArchivo(pacienteId, archivoId) {
    const response = await api.delete(
      `/pacientes/${pacienteId}/historia-clinica/archivos/${archivoId}`
    )
    return response.data
  },

  // ==========================================
  // PLAN DE TRATAMIENTO
  // ==========================================

  /**
   * Obtener plan de tratamiento
   */
  async getPlanTratamiento(pacienteId) {
    const response = await api.get(`/pacientes/${pacienteId}/historia-clinica/plan-tratamiento`)
    return response.data
  },

  /**
   * Guardar plan de tratamiento
   */
  async savePlanTratamiento(pacienteId, data) {
    const response = await api.post(
      `/pacientes/${pacienteId}/historia-clinica/plan-tratamiento`,
      data
    )
    return response.data
  },

  // ==========================================
  // UTILIDADES
  // ==========================================

  /**
   * Obtener resumen de historia clínica
   */
  async getResumen(pacienteId) {
    const response = await api.get(`/pacientes/${pacienteId}/historia-clinica`)
    return response.data
  },

  /**
   * Exportar historia clínica a PDF
   */
  async exportarPDF(pacienteId) {
    const response = await api.get(`/pacientes/${pacienteId}/historia-clinica/exportar-pdf`, {
      responseType: 'blob'
    })
    return response.data
  },

  /**
   * Obtener tipos de entradas disponibles
   */
  async getTiposEntradas() {
    const response = await api.get('/historias-clinicas/tipos-entradas')
    return response.data
  },

  /**
   * Obtener tipos de archivos disponibles
   */
  async getTiposArchivos() {
    const response = await api.get('/historias-clinicas/tipos-archivos')
    return response.data
  }
}