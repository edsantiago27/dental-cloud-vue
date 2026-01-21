/**
 * reportes.js
 * ============
 * Pinia Store para gestión de estado de Reportes
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { reportesService } from '@clinica/services/reportesService'

export const useReportesStore = defineStore('reportes', () => {
  // =============================================
  // STATE
  // =============================================
  
  const loading = ref(false)
  const error = ref(null)

  // Resumen general (KPIs principales)
  const resumen = ref({
    citas_hoy: 0,
    citas_mes: 0,
    citas_completadas: 0,
    citas_canceladas: 0,
    variacion_citas: 0,
    total_pacientes: 0,
    pacientes_nuevos_mes: 0,
    variacion_pacientes: 0,
    ingresos_mes: 0,
    variacion_ingresos: 0,
    tasa_cancelacion: 0,
    tasa_completacion: 0
  })

  // Rendimiento de profesionales
  const rendimientoProfesionales = ref([])

  // Pacientes nuevos (para gráfico de líneas)
  const pacientesNuevos = ref({
    labels: [],
    data: []
  })

  // Distribución de estados (para gráfico pie)
  const distribucionEstados = ref([])

  // Horarios populares (para gráfico barras)
  const horariosPopulares = ref({
    labels: [],
    citas: []
  })

  // Días populares (para gráfico barras)
  const diasPopulares = ref({
    labels: [],
    citas: []
  })

  // Filtros actuales
  const filtros = ref({
    periodo: 'mes', // 'semana', 'mes', 'año', 'personalizado'
    fecha_inicio: null,
    fecha_fin: null,
    profesional_id: null
  })

  // =============================================
  // GETTERS (Computed)
  // =============================================

  const hasData = computed(() => {
    return resumen.value.citas_mes > 0 || resumen.value.total_pacientes > 0
  })

  const variacionCitasPositiva = computed(() => {
    return resumen.value.variacion_citas >= 0
  })

  const variacionPacientesPositiva = computed(() => {
    return resumen.value.variacion_pacientes >= 0
  })

  const variacionIngresosPositiva = computed(() => {
    return resumen.value.variacion_ingresos >= 0
  })

  // =============================================
  // ACTIONS
  // =============================================

  /**
   * Cargar resumen general
   */
  async function fetchResumen() {
    try {
      error.value = null
      const response = await reportesService.getResumen(filtros.value)
      
      if (response.success) {
        resumen.value = response.data
      }
      
      return response
    } catch (err) {
      error.value = 'Error al cargar resumen'
      console.error('Error fetchResumen:', err)
      throw err
    }
  }

  /**
   * Cargar rendimiento de profesionales
   */
  async function fetchRendimientoProfesionales() {
    try {
      error.value = null
      const response = await reportesService.getRendimientoProfesionales(filtros.value)
      
      if (response.success) {
        rendimientoProfesionales.value = response.data
      }
      
      return response
    } catch (err) {
      error.value = 'Error al cargar rendimiento'
      console.error('Error fetchRendimientoProfesionales:', err)
      throw err
    }
  }

  /**
   * Cargar pacientes nuevos
   */
  async function fetchPacientesNuevos() {
    try {
      error.value = null
      const response = await reportesService.getPacientesNuevos(filtros.value)
      
      if (response.success) {
        pacientesNuevos.value = response.data
      }
      
      return response
    } catch (err) {
      error.value = 'Error al cargar pacientes nuevos'
      console.error('Error fetchPacientesNuevos:', err)
      throw err
    }
  }

  /**
   * Cargar distribución de estados
   */
  async function fetchDistribucionEstados() {
    try {
      error.value = null
      const response = await reportesService.getDistribucionEstados(filtros.value)
      
      if (response.success) {
        distribucionEstados.value = response.data
      }
      
      return response
    } catch (err) {
      error.value = 'Error al cargar distribución'
      console.error('Error fetchDistribucionEstados:', err)
      throw err
    }
  }

  /**
   * Cargar horarios populares
   */
  async function fetchHorariosPopulares() {
    try {
      error.value = null
      const response = await reportesService.getHorariosPopulares(filtros.value)
      
      if (response.success) {
        horariosPopulares.value = response.data
      }
      
      return response
    } catch (err) {
      error.value = 'Error al cargar horarios'
      console.error('Error fetchHorariosPopulares:', err)
      throw err
    }
  }

  /**
   * Cargar días populares
   */
  async function fetchDiasPopulares() {
    try {
      error.value = null
      const response = await reportesService.getDiasPopulares(filtros.value)
      
      if (response.success) {
        diasPopulares.value = response.data
      }
      
      return response
    } catch (err) {
      error.value = 'Error al cargar días'
      console.error('Error fetchDiasPopulares:', err)
      throw err
    }
  }

  /**
   * Cargar todos los reportes
   */
  async function fetchTodosLosReportes() {
    loading.value = true
    error.value = null
    
    try {
      await Promise.all([
        fetchResumen(),
        fetchRendimientoProfesionales(),
        fetchPacientesNuevos(),
        fetchDistribucionEstados(),
        fetchHorariosPopulares(),
        fetchDiasPopulares()
      ])
    } catch (err) {
      console.error('Error al cargar reportes:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar filtros y recargar reportes
   */
  function actualizarFiltros(nuevosFiltros) {
    filtros.value = { ...filtros.value, ...nuevosFiltros }
    fetchTodosLosReportes()
  }

  /**
   * Restablecer filtros a valores por defecto
   */
  function resetFiltros() {
    filtros.value = {
      periodo: 'mes',
      fecha_inicio: null,
      fecha_fin: null,
      profesional_id: null
    }
    fetchTodosLosReportes()
  }

  /**
   * Limpiar todos los datos
   */
  function clearData() {
    resumen.value = {
      citas_hoy: 0,
      citas_mes: 0,
      citas_completadas: 0,
      citas_canceladas: 0,
      variacion_citas: 0,
      total_pacientes: 0,
      pacientes_nuevos_mes: 0,
      variacion_pacientes: 0,
      ingresos_mes: 0,
      variacion_ingresos: 0,
      tasa_cancelacion: 0,
      tasa_completacion: 0
    }
    rendimientoProfesionales.value = []
    pacientesNuevos.value = { labels: [], data: [] }
    distribucionEstados.value = []
    horariosPopulares.value = { labels: [], citas: [] }
    diasPopulares.value = { labels: [], citas: [] }
    error.value = null
  }

  /**
   * Descargar reporte de citas en Excel
   */
  async function downloadCitasExcel(params = {}) {
    try {
      await reportesService.downloadCitasExcel(params)
      return { success: true }
    } catch (err) {
      console.error('Error downloadCitasExcel:', err)
      throw err
    }
  }

  // =============================================
  // RETURN (Public API)
  // =============================================

  return {
    // State
    loading,
    error,
    resumen,
    rendimientoProfesionales,
    pacientesNuevos,
    distribucionEstados,
    horariosPopulares,
    diasPopulares,
    filtros,

    // Getters
    hasData,
    variacionCitasPositiva,
    variacionPacientesPositiva,
    variacionIngresosPositiva,

    // Actions
    fetchResumen,
    fetchRendimientoProfesionales,
    fetchPacientesNuevos,
    fetchDistribucionEstados,
    fetchHorariosPopulares,
    fetchDiasPopulares,
    fetchTodosLosReportes,
    actualizarFiltros,
    resetFiltros,
    clearData,
    downloadCitasExcel
  }
})