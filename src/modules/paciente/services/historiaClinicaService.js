// src/services/paciente/historiaClinicaService.js
// ADAPTADO PARA USAR LAS RUTAS EXISTENTES
import api from './api'

/**
 * Obtener historia clínica del paciente
 * Ruta: GET /paciente/mi-historia
 */
export async function getHistoriaClinica() {
  const response = await api.get('/paciente/mi-historia')
  return response.data
}

export default {
  getHistoriaClinica
}