// src/services/superadmin/clinicasService.js
import api from './api'

// Listar clínicas
export async function getClinicas(params = {}) {
  const response = await api.get('/superadmin/clinicas', { params })
  return response.data
}

// Obtener una clínica
export async function getClinica(id) {
  const response = await api.get(`/superadmin/clinicas/${id}`)
  return response.data
}

// Crear clínica
export async function crearClinica(data) {
  const response = await api.post('/superadmin/clinicas', data)
  return response.data
}

// Actualizar clínica
export async function actualizarClinica(id, data) {
  const response = await api.put(`/superadmin/clinicas/${id}`, data)
  return response.data
}

// Eliminar clínica
export async function eliminarClinica(id) {
  const response = await api.delete(`/superadmin/clinicas/${id}`)
  return response.data
}

// Suspender clínica
export async function suspenderClinica(id, motivo = '') {
  const response = await api.post(`/superadmin/clinicas/${id}/suspender`, { motivo })
  return response.data
}

// Reactivar clínica
export async function reactivarClinica(id) {
  const response = await api.post(`/superadmin/clinicas/${id}/reactivar`)
  return response.data
}

// Obtener uso de recursos
export async function getUsoRecursos(id) {
  const response = await api.get(`/superadmin/clinicas/${id}/uso-recursos`)
  return response.data
}

// Exportar clínicas
export async function exportar(params = {}) {
  const response = await api.get('/superadmin/clinicas/exportar', {
    params,
    responseType: 'blob'
  })
  return response.data
}
// Cambiar estado de clínica (activo / suspendido / etc.)
export async function cambiarEstadoClinica(id, estado) {
  const response = await api.patch(`superadmin/clinicas/${id}/estado`, { estado });
  return response.data;
}

// Extender trial
export async function extenderTrialClinica(id, dias) {
  const response = await api.patch(`superadmin/clinicas/${id}/extender-trial`, { dias });
  return response.data;
}

// Cambiar plan
export async function cambiarPlanClinica(id, plan_id) {
  const response = await api.patch(`superadmin/clinicas/${id}/cambiar-plan`, { plan_id });
  return response.data;
}

// Impersonar clínica
export async function impersonarClinica(id) {
  const response = await api.post(`superadmin/clinicas/${id}/impersonar`);
  return response.data;
}

// Estadísticas de una clínica
export async function getEstadisticasClinica(id) {
  const response = await api.get(`superadmin/clinicas/${id}/estadisticas`);
  return response.data;
}

// Estadísticas generales de clínicas (stub - pendiente implementación backend)
export async function getEstadisticas() {
  // Por ahora retornamos valores mock para evitar errores
  return {
    success: true,
    data: {
      total: 0,
      activas: 0,
      suspendidas: 0,
      trial: 0
    }
  }
}

export default {
  getClinicas,
  getClinica,
  crearClinica,
  actualizarClinica,
  eliminarClinica,
  suspenderClinica,
  reactivarClinica,
  getUsoRecursos,
  exportar,
  getEstadisticasClinica,
  cambiarEstadoClinica,
  extenderTrialClinica,
  cambiarPlanClinica,
  impersonarClinica
}