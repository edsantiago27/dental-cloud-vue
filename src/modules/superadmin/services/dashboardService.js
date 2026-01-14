// src/services/superadmin/dashboardService.js
import api from './api'

// Estadísticas generales
export async function getEstadisticas() {
  const response = await api.get('/superadmin/dashboard/estadisticas')
  return response.data
}

// Crecimiento de clínicas (coincide con /crecimiento en routes)
export async function getCrecimientoClinicas(meses = 12) {
  const response = await api.get('/superadmin/dashboard/crecimiento', {
    params: { meses }
  })
  return response.data
}

// Ingresos mensuales (coincide con /ingresos en routes)
export async function getIngresosMensuales(meses = 12) {
  const response = await api.get('/superadmin/dashboard/ingresos', {
    params: { meses }
  })
  return response.data
}

// Clínicas más activas (coincide con /clinicas-activas en routes)
export async function getClinicasMasActivas(limit = 10) {
  const response = await api.get('/superadmin/dashboard/clinicas-activas', {
    params: { limit }
  })
  return response.data
}

// Actividad reciente (coincide con /actividad en routes)
export async function getActividadReciente(limit = 20) {
  const response = await api.get('/superadmin/dashboard/actividad', {
    params: { limit }
  })
  return response.data
}

// Métricas
export async function getMetricas() {
  const response = await api.get('/superadmin/dashboard/metricas')
  return response.data
}

export default {
  getEstadisticas,
  getCrecimientoClinicas,
  getIngresosMensuales,
  getClinicasMasActivas,
  getActividadReciente,
  getMetricas
}