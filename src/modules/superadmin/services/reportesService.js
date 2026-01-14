// src/services/superadmin/reportesService.js
import api from './api'

// Cache de datos
let cachedData = null

// Obtener TODOS los datos de reportes (el backend devuelve todo de una vez)
export async function getDashboard(dias = 30) {
  const response = await api.get('/superadmin/reportes', {
    params: { dias }
  })
  cachedData = response.data.data // Guardar en cache
  return response.data
}

// Los siguientes métodos devuelven datos del cache
export async function getKPIs() {
  if (!cachedData) await getDashboard()
  return { success: true, data: cachedData.kpis }
}

export async function getCrecimiento(meses = 12) {
  if (!cachedData) await getDashboard()
  return { success: true, data: cachedData.mrr_historico }
}

export async function getIngresos(meses = 12) {
  if (!cachedData) await getDashboard()
  return { success: true, data: cachedData.suscripciones_historico }
}

export async function getDistribucionPlanes() {
  if (!cachedData) await getDashboard()
  return { success: true, data: cachedData.distribucion_planes }
}

export async function getTopClinicas(limit = 10) {
  if (!cachedData) await getDashboard()
  return { success: true, data: cachedData.top_clinicas }
}

export async function getCohortAnalysis(meses = 6) {
  if (!cachedData) await getDashboard()
  return { success: true, data: cachedData.funnel }
}

// Exportar reporte
export async function exportar(tipo = 'pdf', params = {}) {
  const response = await api.get('/superadmin/reportes/exportar', {
    params: { ...params, tipo },
    responseType: 'blob'
  })
  return response.data
}

export default {
  getDashboard,
  getKPIs,
  getCrecimiento,
  getIngresos,
  getDistribucionPlanes,
  getTopClinicas,
  getCohortAnalysis,
  exportar
}