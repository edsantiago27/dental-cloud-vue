// src/stores/superadmin/clinicas.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { clinicasService } from '../services'

export const useSuperAdminClinicasStore = defineStore('superadminClinicas', () => {
  // State
  const clinicas = ref([])
  const clinicaActual = ref(null)
  const estadisticas = ref({
    total: 0,
    activas: 0,
    suspendidas: 0,
    trial: 0
  })
  
  const filtros = ref({
    buscar: '',
    estado: '',
    plan_id: '',
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
  const clinicasFiltradas = computed(() => {
    let resultado = [...clinicas.value]

    if (filtros.value.buscar) {
      const buscar = filtros.value.buscar.toLowerCase()
      resultado = resultado.filter(c => 
        c.nombre?.toLowerCase().includes(buscar) ||
        c.email?.toLowerCase().includes(buscar) ||
        c.rut?.toLowerCase().includes(buscar)
      )
    }

    if (filtros.value.estado) {
      resultado = resultado.filter(c => c.estado === filtros.value.estado)
    }

    if (filtros.value.plan_id) {
      resultado = resultado.filter(c => c.plan_id == filtros.value.plan_id)
    }

    return resultado
  })

  // Actions
  async function fetchClinicas(params = {}) {
    loading.value = true
    error.value = null

    try {
      const queryParams = {
        page: paginacion.value.current_page,
        per_page: paginacion.value.per_page,
        ...filtros.value,
        ...params
      }

      const response = await clinicasService.getClinicas(queryParams)
      
      if (response.success && response.data) {
        clinicas.value = response.data.data || response.data
        
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
      console.error('Error fetching clinicas:', err)
      error.value = err.response?.data?.message || 'Error al cargar clínicas'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchEstadisticas() {
    try {
      const response = await clinicasService.getEstadisticas()
      if (response.success && response.data) {
        estadisticas.value = response.data
      }
    } catch (err) {
      console.error('Error fetching estadisticas:', err)
    }
  }

  async function fetchClinica(id) {
    loading.value = true
    error.value = null

    try {
      const response = await clinicasService.getClinica(id)
      
      if (response.success && response.data) {
        // El backend devuelve { data: { clinica: {}, estadisticas: {}, usuarios: [], ... } }
        // Necesitamos extraer solo la clínica
        const clinicaData = response.data.clinica || response.data
        clinicaActual.value = clinicaData
        return { success: true, data: clinicaData }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error fetching clinica:', err)
      error.value = err.response?.data?.message || 'Error al cargar clínica'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function crearClinica(data) {
    loading.value = true
    error.value = null

    try {
      const response = await clinicasService.crearClinica(data)
      
      if (response.success) {
        // Recargar lista
        await fetchClinicas()
        await fetchEstadisticas()
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error creating clinica:', err)
      error.value = err.response?.data?.message || 'Error al crear clínica'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function actualizarClinica(id, data) {
    loading.value = true
    error.value = null

    try {
      const response = await clinicasService.actualizarClinica(id, data)
      
      if (response.success) {
        // Actualizar en la lista local
        const index = clinicas.value.findIndex(c => c.id === id)
        if (index !== -1 && response.data) {
          clinicas.value[index] = response.data
        }

        // Actualizar clinicaActual si es la misma
        if (clinicaActual.value?.id === id) {
          clinicaActual.value = response.data
        }

        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error updating clinica:', err)
      error.value = err.response?.data?.message || 'Error al actualizar clínica'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function suspenderClinica(id, motivo = '') {
    loading.value = true
    error.value = null

    try {
      const response = await clinicasService.suspenderClinica(id, motivo)
      
      if (response.success) {
        // Actualizar estado en la lista
        const clinica = clinicas.value.find(c => c.id === id)
        if (clinica) {
          clinica.estado = 'suspendida'
        }

        await fetchEstadisticas()
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error suspending clinica:', err)
      error.value = err.response?.data?.message || 'Error al suspender clínica'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function activarClinica(id) {
    loading.value = true
    error.value = null

    try {
      const response = await clinicasService.activarClinica(id)
      
      if (response.success) {
        // Actualizar estado en la lista
        const clinica = clinicas.value.find(c => c.id === id)
        if (clinica) {
          clinica.estado = 'activa'
        }

        await fetchEstadisticas()
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error activating clinica:', err)
      error.value = err.response?.data?.message || 'Error al activar clínica'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function eliminarClinica(id) {
    loading.value = true
    error.value = null

    try {
      const response = await clinicasService.eliminarClinica(id)
      
      if (response.success) {
        // Eliminar de la lista local
        clinicas.value = clinicas.value.filter(c => c.id !== id)
        await fetchEstadisticas()
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error deleting clinica:', err)
      error.value = err.response?.data?.message || 'Error al eliminar clínica'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function exportarClinicas(params = {}) {
    try {
      const blob = await clinicasService.exportar({ ...filtros.value, ...params })
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `clinicas_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (err) {
      console.error('Error exporting clinicas:', err)
      return { success: false, message: 'Error al exportar clínicas' }
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
      fecha_desde: '',
      fecha_hasta: ''
    }
  }

  function cambiarPagina(pagina) {
    paginacion.value.current_page = pagina
    fetchClinicas()
  }

  function clearError() {
    error.value = null
  }

  function resetClinicaActual() {
    clinicaActual.value = null
  }

  return {
    // State
    clinicas,
    clinicaActual,
    estadisticas,
    filtros,
    paginacion,
    loading,
    error,

    // Getters
    clinicasFiltradas,

    // Actions
    fetchClinicas,
    fetchEstadisticas,
    fetchClinica,
    crearClinica,
    actualizarClinica,
    suspenderClinica,
    activarClinica,
    eliminarClinica,
    exportarClinicas,
    actualizarFiltros,
    limpiarFiltros,
    cambiarPagina,
    clearError,
    resetClinicaActual
  }
})