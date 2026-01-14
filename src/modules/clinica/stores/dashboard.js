// src/stores/dashboard.js - VERSION CORREGIDA
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dashboardService from '../services/dashboardService'
import { usePacientesStore } from './pacientes'
import { useCitasStore } from './citas'
import { useFacturacionStore } from './facturacion'
import { useProfesionalesStore } from './profesionales'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const loading = ref(false)
  const error = ref(null)
  
  const kpis = ref({
    pacientes: { total: 0, nuevos_mes: 0, activos: 0 },
    citas: { hoy: 0, semana: 0, mes: 0, pendientes: 0 },
    ingresos: { mes_actual: 0, pendiente: 0, total_ano: 0 },
    tratamientos: { activos: 0, completados_mes: 0 }
  })

  const proximasCitas = ref([])
  const alertas = ref([])

  // Actions

  /**
   * Cargar todos los datos del dashboard
   */
  async function loadDashboard() {
    loading.value = true
    error.value = null

    try {
      // Cargar datos en paralelo
      await Promise.all([
        loadKPIs(),
        loadProximasCitas(),
        loadAlertas()
      ])

      return { success: true }
    } catch (err) {
      console.error('❌ Error al cargar dashboard:', err)
      error.value = err.message
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Cargar KPIs desde stores existentes
   */
  async function loadKPIs() {
    try {
      // Intentar obtener KPIs del backend
      const response = await dashboardService.getKPIs()
      
      if (response.success && response.data) {
        kpis.value = response.data
        return
      }
    } catch (error) {
      console.log('⚠️ Endpoint de KPIs no disponible, calculando desde stores...')
    }

    // Fallback: Calcular desde stores existentes
    try {
      const pacientesStore = usePacientesStore()
      const citasStore = useCitasStore()
      const facturacionStore = useFacturacionStore()
      const profesionalesStore = useProfesionalesStore()

      // Cargar datos de stores si no están cargados
      if (!pacientesStore.pacientes || pacientesStore.pacientes.length === 0) {
        await pacientesStore.fetchPacientes()
      }
      if (!citasStore.citas || citasStore.citas.length === 0) {
        await citasStore.fetchCitas()
      }
      if (!facturacionStore.cuentas || facturacionStore.cuentas.length === 0) {
        await facturacionStore.fetchCuentas()
      }
      if (!profesionalesStore.profesionales || profesionalesStore.profesionales.length === 0) {
        await profesionalesStore.fetchProfesionales()
      }

      // ✅ FIX: Asegurar que tenemos arrays válidos
      const pacientes = pacientesStore.pacientes || []
      const citas = citasStore.citas || []
      const cuentas = facturacionStore.cuentas || []
      const profesionales = profesionalesStore.profesionales || []

      // Calcular KPIs
      const hoy = new Date()
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      const inicioSemana = new Date(hoy)
      inicioSemana.setDate(hoy.getDate() - hoy.getDay())

      // Pacientes
      const pacientesNuevosMes = pacientes.filter(p => {
        if (!p.created_at) return false
        const createdAt = new Date(p.created_at)
        return createdAt >= inicioMes
      }).length

      const pacientesActivos = pacientes.filter(p => p.estado === 'activo').length

      // Citas
      const citasHoy = citas.filter(c => {
        if (!c.fecha) return false
        const fecha = new Date(c.fecha)
        return fecha.toDateString() === hoy.toDateString()
      }).length

      const citasSemana = citas.filter(c => {
        if (!c.fecha) return false
        const fecha = new Date(c.fecha)
        return fecha >= inicioSemana && fecha <= hoy
      }).length

      const citasMes = citas.filter(c => {
        if (!c.fecha) return false
        const fecha = new Date(c.fecha)
        return fecha >= inicioMes
      }).length

      const citasPendientes = citas.filter(c => 
        c.estado === 'programada'
      ).length

      // Ingresos
      const ingresosMes = cuentas
        .filter(c => {
          if (!c.created_at) return false
          const fecha = new Date(c.created_at)
          return fecha >= inicioMes
        })
        .reduce((sum, c) => sum + parseFloat(c.monto_pagado || 0), 0)

      const pendiente = cuentas
        .filter(c => c.estado === 'pendiente' || c.estado === 'parcial')
        .reduce((sum, c) => sum + parseFloat(c.saldo || 0), 0)

      // Tratamientos
      const tratamientosActivos = cuentas.filter(c =>
        c.tratamiento_id && (c.estado === 'pendiente' || c.estado === 'parcial')
      ).length

      kpis.value = {
        pacientes: {
          total: pacientes.length,
          nuevos_mes: pacientesNuevosMes,
          activos: pacientesActivos
        },
        citas: {
          hoy: citasHoy,
          semana: citasSemana,
          mes: citasMes,
          pendientes: citasPendientes
        },
        ingresos: {
          mes_actual: ingresosMes,
          pendiente: pendiente,
          total_ano: 0
        },
        tratamientos: {
          activos: tratamientosActivos,
          completados_mes: 0
        },
        profesionales: {
          total: profesionales.length,
          activos: profesionales.filter(p => p.estado === 'activo').length
        }
      }

      console.log('✅ KPIs calculados desde stores:', kpis.value)

    } catch (err) {
      console.error('❌ Error calculando KPIs:', err)
      // Mantener valores en 0 si hay error
    }
  }

  /**
   * Cargar próximas citas
   */
  async function loadProximasCitas() {
    try {
      const response = await dashboardService.getProximasCitas({ limit: 5 })
      
      if (response.success && response.data) {
        proximasCitas.value = response.data
        return
      }
    } catch (error) {
      console.log('⚠️ Próximas citas no disponible')
    }
    
    // Fallback: obtener desde store de citas
    try {
      const citasStore = useCitasStore()
      const hoy = new Date()
      
      // ✅ FIX: Asegurar que citas es un array
      const citas = citasStore.citas || []
      
      proximasCitas.value = citas
        .filter(c => {
          if (!c.fecha) return false
          const fecha = new Date(c.fecha)
          return fecha >= hoy && (c.estado === 'programada' || c.estado === 'confirmada')
        })
        .sort((a, b) => {
          const fechaA = new Date(a.fecha + ' ' + (a.hora || '00:00'))
          const fechaB = new Date(b.fecha + ' ' + (b.hora || '00:00'))
          return fechaA - fechaB
        })
        .slice(0, 5)
        
      console.log('✅ Próximas citas calculadas:', proximasCitas.value.length)
    } catch (err) {
      console.error('❌ Error obteniendo próximas citas:', err)
      proximasCitas.value = []
    }
  }

  /**
   * Cargar alertas
   */
  async function loadAlertas() {
    try {
      const response = await dashboardService.getAlertas()
      
      if (response.success && response.data) {
        alertas.value = response.data
        return
      }
    } catch (error) {
      console.log('⚠️ Alertas no disponibles')
    }
    
    // Generar alertas básicas
    alertas.value = []
  }

  /**
   * Refrescar dashboard
   */
  async function refresh() {
    return await loadDashboard()
  }

  return {
    // State
    loading,
    error,
    kpis,
    proximasCitas,
    alertas,
    
    // Actions
    loadDashboard,
    loadKPIs,
    loadProximasCitas,
    loadAlertas,
    refresh
  }
})