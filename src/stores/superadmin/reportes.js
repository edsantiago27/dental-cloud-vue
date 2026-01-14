// src/stores/superadmin/reportes.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reportesService } from '@/services/superadmin'

export const useSuperAdminReportesStore = defineStore('superadminReportes', () => {
  // State
  const kpis = ref({
    mrr: 0,
    arr: 0,
    arpu: 0,
    ltv: 0,
    churn_rate: 0,
    conversion_rate: 0,
    cac: 0,
    new_signups: 0
  })

  const crecimiento = ref([])
  const ingresos = ref([])
  const distribucionPlanes = ref([])
  const topClinicas = ref([])
  const cohortAnalysis = ref([])

  const loading = ref(false)
  const error = ref(null)

  // Actions
  async function fetchKPIs() {
    loading.value = true
    error.value = null

    try {
      const response = await reportesService.getKPIs()
      
      if (response.success && response.data) {
        kpis.value = response.data
      }

      return { success: true }
    } catch (err) {
      console.error('Error fetching KPIs:', err)
      error.value = err.response?.data?.message || 'Error al cargar KPIs'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchCrecimiento(meses = 12) {
    try {
      const response = await reportesService.getCrecimiento(meses)
      
      if (response.success && response.data) {
        crecimiento.value = response.data
      }
    } catch (err) {
      console.error('Error fetching crecimiento:', err)
    }
  }

  async function fetchIngresos(meses = 12) {
    try {
      const response = await reportesService.getIngresos(meses)
      
      if (response.success && response.data) {
        ingresos.value = response.data
      }
    } catch (err) {
      console.error('Error fetching ingresos:', err)
    }
  }

  async function fetchDistribucionPlanes() {
    try {
      const response = await reportesService.getDistribucionPlanes()
      
      if (response.success && response.data) {
        distribucionPlanes.value = response.data
      }
    } catch (err) {
      console.error('Error fetching distribución:', err)
    }
  }

  async function fetchTopClinicas(limit = 10) {
    try {
      const response = await reportesService.getTopClinicas(limit)
      
      if (response.success && response.data) {
        topClinicas.value = response.data
      }
    } catch (err) {
      console.error('Error fetching top clínicas:', err)
    }
  }

  async function fetchCohortAnalysis(meses = 6) {
    try {
      const response = await reportesService.getCohortAnalysis(meses)
      
      if (response.success && response.data) {
        cohortAnalysis.value = response.data
      }
    } catch (err) {
      console.error('Error fetching cohort analysis:', err)
    }
  }

  async function exportarReporte(tipo, params = {}) {
    try {
      const blob = await reportesService.exportar(tipo, params)
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte_${tipo}_${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (err) {
      console.error('Error exporting reporte:', err)
      return { success: false, message: 'Error al exportar reporte' }
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    kpis,
    crecimiento,
    ingresos,
    distribucionPlanes,
    topClinicas,
    cohortAnalysis,
    loading,
    error,

    // Actions
    fetchKPIs,
    fetchCrecimiento,
    fetchIngresos,
    fetchDistribucionPlanes,
    fetchTopClinicas,
    fetchCohortAnalysis,
    exportarReporte,
    clearError
  }
})