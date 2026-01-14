// src/services/superadmin/suscripcionesService.js
import api from './api'

// Listar suscripciones
export async function getSuscripciones(params = {}) {
  const response = await api.get('/superadmin/suscripciones', { params })
  return response.data
}

// Obtener estadísticas
export async function getEstadisticas() {
  const response = await api.get('/superadmin/suscripciones/estadisticas')
  return response.data
}

// Obtener una suscripción
export async function getSuscripcion(id) {
  const response = await api.get(`/superadmin/suscripciones/${id}`)
  return response.data
}

// Extender trial
export async function extenderTrial(id, dias) {
  const response = await api.post(`/superadmin/suscripciones/${id}/extender-trial`, { dias })
  return response.data
}

// Suspender suscripción
export async function suspender(id, motivo ) {
  const response = await api.post(`/superadmin/suscripciones/${id}/suspender`, { motivo })
  return response.data
}

// Reactivar suscripción
export async function reactivar(id) {
  const response = await api.post(`/superadmin/suscripciones/${id}/reactivar`)
  return response.data
}

// Cancelar suscripción
export async function cancelar(id, motivo ) {
  const response = await api.post(`/superadmin/suscripciones/${id}/cancelar`, { motivo })
  return response.data
}

// Exportar suscripciones
export async function exportar(params = {}) {
  const response = await api.get('/superadmin/suscripciones/exportar', {
    params,
    responseType: 'blob'
  })
  return response.data
}

export default {
  getSuscripciones,
  getEstadisticas,
  getSuscripcion,
  extenderTrial,
  suspender,
  reactivar,
  cancelar,
  exportar
}