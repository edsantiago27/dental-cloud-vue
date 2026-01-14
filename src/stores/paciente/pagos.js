// src/stores/paciente/pagos.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pagosService } from '@/services/paciente'

export const usePacientePagosStore = defineStore('pacientePagos', () => {
  // State
  const resumen = ref({
    total_pendiente: 0,
    total_pagado: 0,
    cuentas_pendientes: 0,
    ultimo_pago: null
  })
  const cuentas = ref([])
  const cuentaActual = ref(null)
  const historialPagos = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const cuentasPendientes = computed(() => {
    return cuentas.value.filter(c => ['pendiente', 'parcial'].includes(c.estado))
  })

  const cuentasPagadas = computed(() => {
    return cuentas.value.filter(c => c.estado === 'pagado')
  })

  const totalPendiente = computed(() => {
    return resumen.value.total_pendiente
  })

  const totalPagado = computed(() => {
    return resumen.value.total_pagado
  })

  // Actions
  async function fetchResumen() {
    loading.value = true
    error.value = null

    try {
      const response = await pagosService.getResumen()
      
      if (response.success) {
        resumen.value = response.data
        return { success: true }
      }

      throw new Error(response.message || 'Error al cargar resumen')
    } catch (err) {
      console.error('❌ Error fetchResumen:', err)
      error.value = 'Error al cargar el resumen de pagos'
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  async function fetchCuentas(estado = null) {
    loading.value = true
    error.value = null

    try {
      const response = await pagosService.getCuentas(estado)
      
      if (response.success) {
        cuentas.value = response.data
        return { success: true }
      }

      throw new Error(response.message || 'Error al cargar cuentas')
    } catch (err) {
      console.error('❌ Error fetchCuentas:', err)
      error.value = 'Error al cargar las cuentas'
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  async function fetchDetalleCuenta(id) {
    loading.value = true
    error.value = null

    try {
      const response = await pagosService.getDetalleCuenta(id)
      
      if (response.success) {
        cuentaActual.value = response.data
        return { success: true, data: response.data }
      }

      throw new Error(response.message || 'Error al cargar cuenta')
    } catch (err) {
      console.error('❌ Error fetchDetalleCuenta:', err)
      error.value = 'Error al cargar el detalle de la cuenta'
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  async function fetchHistorialPagos() {
    loading.value = true
    error.value = null

    try {
      const response = await pagosService.getHistorialPagos()
      
      if (response.success) {
        historialPagos.value = response.data
        return { success: true }
      }

      throw new Error(response.message || 'Error al cargar historial')
    } catch (err) {
      console.error('❌ Error fetchHistorialPagos:', err)
      error.value = 'Error al cargar el historial de pagos'
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  async function descargarComprobante(id) {
    try {
      const response = await pagosService.getComprobante(id)
      
      if (response.success) {
        return { success: true, data: response.data }
      }

      throw new Error(response.message || 'Error al descargar comprobante')
    } catch (err) {
      console.error('❌ Error descargarComprobante:', err)
      return { success: false, message: 'Error al descargar el comprobante' }
    }
  }

  function clearError() {
    error.value = null
  }

  function reset() {
    resumen.value = {
      total_pendiente: 0,
      total_pagado: 0,
      cuentas_pendientes: 0,
      ultimo_pago: null
    }
    cuentas.value = []
    cuentaActual.value = null
    historialPagos.value = []
    error.value = null
  }

  return {
    // State
    resumen,
    cuentas,
    cuentaActual,
    historialPagos,
    loading,
    error,
    
    // Getters
    cuentasPendientes,
    cuentasPagadas,
    totalPendiente,
    totalPagado,
    
    // Actions
    fetchResumen,
    fetchCuentas,
    fetchDetalleCuenta,
    fetchHistorialPagos,
    descargarComprobante,
    clearError,
    reset
  }
})