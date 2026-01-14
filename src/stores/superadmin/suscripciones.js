// src/stores/superadmin/suscripciones.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { suscripcionesService } from '@/services/superadmin'

export const useSuperAdminSuscripcionesStore = defineStore('superadminSuscripciones', () => {
  // State
  const suscripciones = ref([])
  const suscripcionActual = ref(null)
  const estadisticas = ref({
    activas: 0,
    trial: 0,
    por_vencer: 0,
    mrr: 0,
    arr: 0
  })
  
  const filtros = ref({
    buscar: '',
    estado: '',
    plan_id: '',
    tipo: '',
    es_trial: null
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
  const suscripcionesFiltradas = computed(() => {
    let resultado = [...suscripciones.value]

    if (filtros.value.buscar) {
      const buscar = filtros.value.buscar.toLowerCase()
      resultado = resultado.filter(s => 
        s.clinica?.nombre?.toLowerCase().includes(buscar) ||
        s.clinica?.email?.toLowerCase().includes(buscar)
      )
    }

    if (filtros.value.estado) {
      if (filtros.value.estado === 'por_vencer') {
        // Filtrar suscripciones que vencen en los próximos 7 días
        const hoy = new Date()
        const enSieteDias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000)
        resultado = resultado.filter(s => {
          const fechaFin = new Date(s.fecha_fin)
          return fechaFin >= hoy && fechaFin <= enSieteDias
        })
      } else {
        resultado = resultado.filter(s => s.estado === filtros.value.estado)
      }
    }

    if (filtros.value.plan_id) {
      resultado = resultado.filter(s => s.plan_id == filtros.value.plan_id)
    }

    if (filtros.value.tipo) {
      resultado = resultado.filter(s => s.tipo === filtros.value.tipo)
    }

    if (filtros.value.es_trial !== null) {
      resultado = resultado.filter(s => s.es_trial === filtros.value.es_trial)
    }

    return resultado
  })

  // Actions
  async function fetchSuscripciones(params = {}) {
    loading.value = true
    error.value = null

    try {
      const queryParams = {
        page: paginacion.value.current_page,
        per_page: paginacion.value.per_page,
        ...filtros.value,
        ...params
      }

      const response = await suscripcionesService.getSuscripciones(queryParams)
      
      if (response.success && response.data) {
        suscripciones.value = response.data.data || response.data
        
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
      console.error('Error fetching suscripciones:', err)
      error.value = err.response?.data?.message || 'Error al cargar suscripciones'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchEstadisticas() {
    try {
      const response = await suscripcionesService.getEstadisticas()
      if (response.success && response.data) {
        estadisticas.value = response.data
      }
    } catch (err) {
      console.error('Error fetching estadisticas:', err)
    }
  }

  async function fetchSuscripcion(id) {
    loading.value = true
    error.value = null

    try {
      const response = await suscripcionesService.getSuscripcion(id)
      
      if (response.success && response.data) {
        suscripcionActual.value = response.data
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error fetching suscripcion:', err)
      error.value = err.response?.data?.message || 'Error al cargar suscripción'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function extenderTrial(id, dias) {
    loading.value = true
    error.value = null

    try {
      const response = await suscripcionesService.extenderTrial(id, dias)
      
      if (response.success) {
        // Actualizar en la lista local
        const index = suscripciones.value.findIndex(s => s.id === id)
        if (index !== -1 && response.data) {
          suscripciones.value[index] = { 
            ...suscripciones.value[index], 
            ...response.data 
          }
        }

        // Actualizar suscripcionActual si es la misma
        if (suscripcionActual.value?.id === id) {
          suscripcionActual.value = { 
            ...suscripcionActual.value, 
            ...response.data 
          }
        }

        return { success: true, message: response.message, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error extending trial:', err)
      error.value = err.response?.data?.message || 'Error al extender trial'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function suspender(id, motivo = '') {
    loading.value = true
    error.value = null

    try {
      const response = await suscripcionesService.suspender(id, motivo)
      
      if (response.success) {
        // Actualizar estado en la lista
        const suscripcion = suscripciones.value.find(s => s.id === id)
        if (suscripcion) {
          suscripcion.estado = 'suspendida'
        }

        if (suscripcionActual.value?.id === id) {
          suscripcionActual.value.estado = 'suspendida'
        }

        await fetchEstadisticas()
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error suspending suscripcion:', err)
      error.value = err.response?.data?.message || 'Error al suspender suscripción'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function reactivar(id) {
    loading.value = true
    error.value = null

    try {
      const response = await suscripcionesService.reactivar(id)
      
      if (response.success) {
        // Actualizar estado en la lista
        const suscripcion = suscripciones.value.find(s => s.id === id)
        if (suscripcion) {
          suscripcion.estado = 'activa'
        }

        if (suscripcionActual.value?.id === id) {
          suscripcionActual.value.estado = 'activa'
        }

        await fetchEstadisticas()
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error reactivating suscripcion:', err)
      error.value = err.response?.data?.message || 'Error al reactivar suscripción'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function cancelar(id, motivo = '') {
    loading.value = true
    error.value = null

    try {
      const response = await suscripcionesService.cancelar(id, motivo)
      
      if (response.success) {
        // Actualizar estado en la lista
        const suscripcion = suscripciones.value.find(s => s.id === id)
        if (suscripcion) {
          suscripcion.estado = 'cancelada'
        }

        if (suscripcionActual.value?.id === id) {
          suscripcionActual.value.estado = 'cancelada'
        }

        await fetchEstadisticas()
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error canceling suscripcion:', err)
      error.value = err.response?.data?.message || 'Error al cancelar suscripción'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function exportarSuscripciones(params = {}) {
    try {
      const blob = await suscripcionesService.exportar({ ...filtros.value, ...params })
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `suscripciones_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (err) {
      console.error('Error exporting suscripciones:', err)
      return { success: false, message: 'Error al exportar suscripciones' }
    }
  }

  function actualizarFiltros(nuevosFiltros) {
    filtros.value = { ...filtros.value, ...nuevosFiltros }
  }

  function limpiarFiltros() {
    filtros.value = {
      buscar: '',
      estado: '',
      plan_id: '',
      tipo: '',
      es_trial: null
    }
  }

  function cambiarPagina(pagina) {
    paginacion.value.current_page = pagina
    fetchSuscripciones()
  }

  function clearError() {
    error.value = null
  }

  function resetSuscripcionActual() {
    suscripcionActual.value = null
  }

  return {
    // State
    suscripciones,
    suscripcionActual,
    estadisticas,
    filtros,
    paginacion,
    loading,
    error,

    // Getters
    suscripcionesFiltradas,

    // Actions
    fetchSuscripciones,
    fetchEstadisticas,
    fetchSuscripcion,
    extenderTrial,
    suspender,
    reactivar,
    cancelar,
    exportarSuscripciones,
    actualizarFiltros,
    limpiarFiltros,
    cambiarPagina,
    clearError,
    resetSuscripcionActual
  }
})