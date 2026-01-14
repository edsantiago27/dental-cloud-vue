// src/stores/superadmin/facturacion.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { facturacionService } from '../services'

export const useSuperAdminFacturacionStore = defineStore('superadminFacturacion', () => {
  // State
  const facturas = ref([])
  const facturaActual = ref(null)
  const estadisticas = ref({
    ingresos_mes: 0,
    pendientes: 0,
    vencidas: 0,
    tasa_cobro: 0
  })
  
  const filtros = ref({
    buscar: '',
    estado: '',
    mes: '',
    fecha_desde: '',
    fecha_hasta: ''
  })

  const paginacion = ref({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  })

  const loading = ref(false)
  const error = ref(null)

  // Getters
  const facturasPendientes = computed(() => {
    return facturas.value.filter(f => f.estado === 'pendiente')
  })

  const facturasVencidas = computed(() => {
    return facturas.value.filter(f => f.estado === 'vencida')
  })

  const totalPendiente = computed(() => {
    return facturasPendientes.value.reduce((sum, f) => sum + (f.total || 0), 0)
  })

  // Actions
  async function fetchFacturas(params = {}) {
    loading.value = true
    error.value = null

    try {
      const queryParams = {
        page: paginacion.value.current_page,
        per_page: paginacion.value.per_page,
        ...filtros.value,
        ...params
      }

      const response = await facturacionService.getFacturas(queryParams)
      
      if (response.success && response.data) {
        facturas.value = response.data.data || response.data
        
        // Actualizar paginación si existe
        if (response.data.current_page) {
          paginacion.value = {
            current_page: response.data.current_page,
            per_page: response.data.per_page,
            total: response.data.total,
            last_page: response.data.last_page
          }
        }
      }

      return { success: true }
    } catch (err) {
      console.error('Error fetching facturas:', err)
      error.value = err.response?.data?.message || 'Error al cargar facturas'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchEstadisticas() {
    try {
      const response = await facturacionService.getEstadisticas()
      if (response.success && response.data) {
        estadisticas.value = response.data
      }
    } catch (err) {
      console.error('Error fetching estadisticas:', err)
    }
  }

  async function fetchFactura(id) {
    loading.value = true
    error.value = null

    try {
      const response = await facturacionService.getFactura(id)
      
      if (response.success && response.data) {
        facturaActual.value = response.data
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error fetching factura:', err)
      error.value = err.response?.data?.message || 'Error al cargar factura'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function generarFactura(data) {
    loading.value = true
    error.value = null

    try {
      const response = await facturacionService.generar(data)
      
      if (response.success) {
        // Recargar lista
        await fetchFacturas()
        await fetchEstadisticas()
        return { success: true, message: response.message, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error generating factura:', err)
      error.value = err.response?.data?.message || 'Error al generar factura'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function registrarPago(id, data) {
    loading.value = true
    error.value = null

    try {
      const response = await facturacionService.registrarPago(id, data)
      
      if (response.success) {
        // Actualizar en la lista local
        const index = facturas.value.findIndex(f => f.id === id)
        if (index !== -1 && response.data) {
          facturas.value[index] = response.data
        }

        // Actualizar facturaActual si es la misma
        if (facturaActual.value?.id === id) {
          facturaActual.value = response.data
        }

        await fetchEstadisticas()
        return { success: true, message: response.message, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error registering payment:', err)
      error.value = err.response?.data?.message || 'Error al registrar pago'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function anularFactura(id, motivo = '') {
    loading.value = true
    error.value = null

    try {
      const response = await facturacionService.anular(id, motivo)
      
      if (response.success) {
        // Actualizar estado en la lista
        const factura = facturas.value.find(f => f.id === id)
        if (factura) {
          factura.estado = 'anulada'
        }

        if (facturaActual.value?.id === id) {
          facturaActual.value.estado = 'anulada'
        }

        await fetchEstadisticas()
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error voiding factura:', err)
      error.value = err.response?.data?.message || 'Error al anular factura'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function enviarRecordatorio(id) {
    loading.value = true
    error.value = null

    try {
      const response = await facturacionService.enviarRecordatorio(id)
      
      if (response.success) {
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error sending reminder:', err)
      error.value = err.response?.data?.message || 'Error al enviar recordatorio'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function generarMasivo() {
    loading.value = true
    error.value = null

    try {
      const response = await facturacionService.generarMasivo()
      
      if (response.success) {
        await fetchFacturas()
        await fetchEstadisticas()
        return { success: true, message: response.message, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error generating bulk invoices:', err)
      error.value = err.response?.data?.message || 'Error al generar facturas masivas'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function resumenMensual(meses = 12) {
    try {
      const response = await facturacionService.resumenMensual(meses)
      return response.data || []
    } catch (err) {
      console.error('Error fetching monthly summary:', err)
      return []
    }
  }

  async function exportarFacturas(params = {}) {
    try {
      const blob = await facturacionService.exportar({ ...filtros.value, ...params })
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `facturas_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (err) {
      console.error('Error exporting facturas:', err)
      return { success: false, message: 'Error al exportar facturas' }
    }
  }

  function actualizarFiltros(nuevosFiltros) {
    filtros.value = { ...filtros.value, ...nuevosFiltros }
  }

  function limpiarFiltros() {
    filtros.value = {
      buscar: '',
      estado: '',
      mes: '',
      fecha_desde: '',
      fecha_hasta: ''
    }
  }

  function cambiarPagina(pagina) {
    paginacion.value.current_page = pagina
    fetchFacturas()
  }

  function clearError() {
    error.value = null
  }

  function resetFacturaActual() {
    facturaActual.value = null
  }

  return {
    // State
    facturas,
    facturaActual,
    estadisticas,
    filtros,
    paginacion,
    loading,
    error,

    // Getters
    facturasPendientes,
    facturasVencidas,
    totalPendiente,

    // Actions
    fetchFacturas,
    fetchEstadisticas,
    fetchFactura,
    generarFactura,
    registrarPago,
    anularFactura,
    enviarRecordatorio,
    generarMasivo,
    resumenMensual,
    exportarFacturas,
    actualizarFiltros,
    limpiarFiltros,
    cambiarPagina,
    clearError,
    resetFacturaActual
  }
})