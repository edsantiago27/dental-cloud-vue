// src/services/paciente/citasService.js
// ADAPTADO PARA USAR LAS RUTAS EXISTENTES DEL BACKEND
import api from './api'

/**
 * Obtener citas del paciente
 * Ruta: GET /paciente/mis-citas
 */
export async function getMisCitas(filtros = {}) {
  const response = await api.get('/paciente/mis-citas', {
    params: filtros // estado, desde, hasta, tipo (proximas/pasadas), per_page
  })
  return response.data
}

/**
 * Ver detalle de una cita
 * Ruta: GET /paciente/mis-citas/{id}
 */
export async function getCita(id) {
  const response = await api.get(`/paciente/mis-citas/${id}`)
  return response.data
}

/**
 * Cancelar cita
 * Ruta: PUT /paciente/mis-citas/{id}/cancelar
 */
export async function cancelarCita(id, motivoCancelacion) {
  const response = await api.put(`/paciente/mis-citas/${id}/cancelar`, {
    motivo_cancelacion: motivoCancelacion
  })
  return response.data
}

/**
 * Reagendar cita
 * Ruta: PUT /paciente/mis-citas/{id}/reagendar
 */
export async function reagendarCita(id, fecha, hora) {
  const response = await api.put(`/paciente/mis-citas/${id}/reagendar`, {
    nueva_fecha: fecha,
    nueva_hora: hora
  })
  return response.data
}

/**
 * Obtener profesionales disponibles
 * Ruta: GET /paciente/profesionales
 */
export async function getProfesionales() {
  const response = await api.get('/paciente/profesionales')
  return response.data
}

/**
 * Obtener tratamientos disponibles
 * Ruta: GET /paciente/tratamientos
 */
export async function getTratamientos() {
  const response = await api.get('/paciente/tratamientos')
  return response.data
}

/**
 * Obtener horarios disponibles
 * Ruta: GET /paciente/horarios-disponibles
 */
export async function getHorariosDisponibles(profesionalId, fecha, duracion) {
  const response = await api.get('/paciente/horarios-disponibles', {
    params: {
      profesional_id: profesionalId,
      fecha,
      duracion
    }
  })
  return response.data
}

/**
 * Obtener disponibilidad para reagendar
 * Ruta: GET /paciente/disponibilidad
 */
export async function getDisponibilidad(profesionalId, fecha, duracion) {
  const response = await api.get('/paciente/disponibilidad', {
    params: {
      profesional_id: profesionalId,
      fecha,
      duracion
    }
  })
  return response.data
}

/**
 * Obtener días laborales del profesional
 * Ruta: GET /paciente/dias-laborales
 */
export async function getDiasLaborales(profesionalId) {
  const response = await api.get('/paciente/dias-laborales', {
    params: {
      profesional_id: profesionalId
    }
  })
  return response.data
}

/**
 * Agendar nueva cita
 * Ruta: POST /paciente/agendar-cita
 */
export async function agendarCita(data) {
  const response = await api.post('/paciente/agendar-cita', data)
  return response.data
}

export default {
  getMisCitas,
  getCita,
  cancelarCita,
  reagendarCita,
  getProfesionales,
  getTratamientos,
  getHorariosDisponibles,
  getDisponibilidad,
  getDiasLaborales,
  agendarCita
}