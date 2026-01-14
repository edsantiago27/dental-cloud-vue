// src/stores/superadmin/planes.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { planesService } from '@/services/superadmin'

export const useSuperAdminPlanesStore = defineStore('superadminPlanes', () => {
  // State
  const planes = ref([])
  const planActual = ref(null)
  
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const planesActivos = computed(() => {
    return planes.value.filter(p => p.activo)
  })

  const planesOrdenados = computed(() => {
    // Ordenar por precio (ascendente)
    return [...planes.value].sort((a, b) => a.precio_mensual - b.precio_mensual)
  })

  // Actions
  async function fetchPlanes(params = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await planesService.getPlanes(params)
      
      if (response.success && response.data) {
        planes.value = response.data.data || response.data
      }

      return { success: true }
    } catch (err) {
      console.error('Error fetching planes:', err)
      error.value = err.response?.data?.message || 'Error al cargar planes'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchPlan(id) {
    loading.value = true
    error.value = null

    try {
      const response = await planesService.getPlan(id)
      
      if (response.success && response.data) {
        planActual.value = response.data
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error fetching plan:', err)
      error.value = err.response?.data?.message || 'Error al cargar plan'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function crearPlan(data) {
    loading.value = true
    error.value = null

    try {
      const response = await planesService.crearPlan(data)
      
      if (response.success) {
        // Recargar lista
        await fetchPlanes()
        return { success: true, message: response.message, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error creating plan:', err)
      error.value = err.response?.data?.message || 'Error al crear plan'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function actualizarPlan(id, data) {
    loading.value = true
    error.value = null

    try {
      const response = await planesService.actualizarPlan(id, data)
      
      if (response.success) {
        // Actualizar en la lista local
        const index = planes.value.findIndex(p => p.id === id)
        if (index !== -1 && response.data) {
          planes.value[index] = response.data
        }

        // Actualizar planActual si es el mismo
        if (planActual.value?.id === id) {
          planActual.value = response.data
        }

        return { success: true, message: response.message, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error updating plan:', err)
      error.value = err.response?.data?.message || 'Error al actualizar plan'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function eliminarPlan(id) {
    loading.value = true
    error.value = null

    try {
      const response = await planesService.eliminarPlan(id)
      
      if (response.success) {
        // Eliminar de la lista local
        planes.value = planes.value.filter(p => p.id !== id)
        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error deleting plan:', err)
      error.value = err.response?.data?.message || 'Error al eliminar plan'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function activarPlan(id) {
    loading.value = true
    error.value = null

    try {
      const response = await planesService.activar(id)
      
      if (response.success) {
        // Actualizar estado en la lista
        const plan = planes.value.find(p => p.id === id)
        if (plan) {
          plan.activo = true
        }

        if (planActual.value?.id === id) {
          planActual.value.activo = true
        }

        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error activating plan:', err)
      error.value = err.response?.data?.message || 'Error al activar plan'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function desactivarPlan(id) {
    loading.value = true
    error.value = null

    try {
      const response = await planesService.desactivar(id)
      
      if (response.success) {
        // Actualizar estado en la lista
        const plan = planes.value.find(p => p.id === id)
        if (plan) {
          plan.activo = false
        }

        if (planActual.value?.id === id) {
          planActual.value.activo = false
        }

        return { success: true, message: response.message }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('Error deactivating plan:', err)
      error.value = err.response?.data?.message || 'Error al desactivar plan'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetPlanActual() {
    planActual.value = null
  }

  return {
    // State
    planes,
    planActual,
    loading,
    error,

    // Getters
    planesActivos,
    planesOrdenados,

    // Actions
    fetchPlanes,
    fetchPlan,
    crearPlan,
    actualizarPlan,
    eliminarPlan,
    activarPlan,
    desactivarPlan,
    clearError,
    resetPlanActual
  }
})