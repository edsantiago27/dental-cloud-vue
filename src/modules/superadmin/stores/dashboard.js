// src/stores/superadmin/dashboard.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardService } from '../services'

export const useSuperAdminDashboardStore = defineStore('superadminDashboard', () => {
  // State
  const estadisticas = ref({
    clinicas: { total: 0, activas: 0, trial: 0, nuevas_mes: 0 },
    ingresos: { mrr: 0, arr: 0, ingresos_mes: 0 },
    leads: { nuevos: 0, mes: 0 },
    uso: { total_pacientes: 0, citas_mes: 0 },
    alertas: { suscripciones_por_vencer: 0, facturas_pendientes: 0, monto_pendiente: 0 }
  })

  const metricas = ref({
    tasa_conversion: 0,
    churn_rate: 0,
    arpu: 0,
    ltv_estimado: 0,
    clinicas_pagando: 0
  })

  const crecimientoClinicas = ref([])
  const ingresosMensuales = ref([])
  const clinicasMasActivas = ref([])
  const actividadReciente = ref({
    nuevas_clinicas: [],
    nuevos_leads: [],
    ultimos_pagos: []
  })
  const distribucionPlanes = ref([])

  const loading = ref(false)
  const error = ref(null)

  // Actions
  async function loadDashboard() {
    loading.value = true
    error.value = null

    try {
      // Cargar estadísticas principales
      const [estRes, metRes, crecRes, ingRes, actRes] = await Promise.all([
        dashboardService.getEstadisticas(),
        dashboardService.getMetricas(),
        dashboardService.getCrecimientoClinicas(12),
        dashboardService.getIngresosMensuales(12),
        dashboardService.getActividadReciente(20)
      ])

      if (estRes.success) {
        estadisticas.value = estRes.data
        if (estRes.data.distribucion_planes) {
          distribucionPlanes.value = estRes.data.distribucion_planes
        }
      }

      if (metRes.success) {
        metricas.value = metRes.data
      }

      if (crecRes.success) {
        crecimientoClinicas.value = crecRes.data
      }

      if (ingRes.success) {
        ingresosMensuales.value = ingRes.data
      }

      if (actRes.success) {
        actividadReciente.value = actRes.data
      }

      return { success: true }
    } catch (err) {
      console.error('Error loading dashboard:', err)
      error.value = err.response?.data?.message || 'Error al cargar dashboard'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function loadClinicasMasActivas(limit = 10) {
    try {
      const response = await dashboardService.getClinicasMasActivas(limit)
      if (response.success) {
        clinicasMasActivas.value = response.data
      }
    } catch (err) {
      console.error('Error loading top clinicas:', err)
    }
  }

  async function refresh() {
    await loadDashboard()
    await loadClinicasMasActivas()
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    estadisticas,
    metricas,
    crecimientoClinicas,
    ingresosMensuales,
    clinicasMasActivas,
    actividadReciente,
    distribucionPlanes,
    loading,
    error,
    
    // Actions
    loadDashboard,
    loadClinicasMasActivas,
    refresh,
    clearError
  }
})