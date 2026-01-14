// src/stores/profesionales.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import profesionalesService from '@/services/profesionalesService'

export const useProfesionalesStore = defineStore('profesionales', () => {
  // State
  const profesionales = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentProfesional = ref(null)

  // Constantes
  const DIAS_SEMANA = [
    { value: 0, label: 'Domingo', short: 'Dom' },
    { value: 1, label: 'Lunes', short: 'Lun' },
    { value: 2, label: 'Martes', short: 'Mar' },
    { value: 3, label: 'Miércoles', short: 'Mié' },
    { value: 4, label: 'Jueves', short: 'Jue' },
    { value: 5, label: 'Viernes', short: 'Vie' },
    { value: 6, label: 'Sábado', short: 'Sáb' }
  ]

  const ESTADOS = [
    { value: 'activo', label: 'Activo', color: '#10B981', icon: 'fas fa-check-circle' },
    { value: 'inactivo', label: 'Inactivo', color: '#6B7280', icon: 'fas fa-times-circle' },
    { value: 'licencia', label: 'En Licencia', color: '#F59E0B', icon: 'fas fa-umbrella-beach' }
  ]

  const ESPECIALIDADES = [
    'Odontología General',
    'Ortodoncia',
    'Endodoncia',
    'Periodoncia',
    'Implantología',
    'Cirugía Maxilofacial',
    'Odontopediatría',
    'Estética Dental',
    'Rehabilitación Oral'
  ]

  // Getters
  const profesionalesActivos = computed(() => {
    return profesionales.value.filter(p => p.estado === 'activo')
  })

  const profesionalesOptions = computed(() => {
    return profesionalesActivos.value.map(p => ({
      value: p.id,
      label: `${p.nombre} ${p.apellido}${p.especialidad ? ' - ' + p.especialidad : ''}`,
      data: p
    }))
  })

  const totalProfesionales = computed(() => profesionales.value.length)
  const totalActivos = computed(() => profesionalesActivos.value.length)
  const totalInactivos = computed(() => {
    return profesionales.value.filter(p => p.estado === 'inactivo').length
  })
  const totalEnLicencia = computed(() => {
    return profesionales.value.filter(p => p.estado === 'licencia').length
  })

  // Actions

  /**
   * Obtener todos los profesionales
   */
  async function fetchProfesionales(params = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await profesionalesService.getAll(params)
      
      console.log('📦 Profesionales obtenidos:', response)

      if (response.success) {
        // Manejar diferentes estructuras de paginación de Laravel
        if (Array.isArray(response.data)) {
          profesionales.value = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          profesionales.value = response.data.data
        } else {
          profesionales.value = []
        }
      } else {
        profesionales.value = []
      }

      return { success: true }
    } catch (err) {
      console.error('❌ Error al obtener profesionales:', err)
      error.value = err.response?.data?.message || 'Error al cargar profesionales'
      profesionales.value = []
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener un profesional específico
   */
  async function fetchProfesionalById(id) {
    loading.value = true
    error.value = null

    try {
      const response = await profesionalesService.getById(id)
      
      if (response.success) {
        currentProfesional.value = response.data
        return { success: true, data: response.data }
      }

      return { success: false }
    } catch (err) {
      console.error('❌ Error al obtener profesional:', err)
      error.value = err.response?.data?.message || 'Error al cargar profesional'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Crear nuevo profesional
   */
  async function createProfesional(data) {
    loading.value = true
    error.value = null

    try {
      const response = await profesionalesService.create(data)
      
      console.log('✅ Profesional creado:', response)

      if (response.success) {
        // Agregar a la lista local
        profesionales.value.push(response.data)
        
        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('❌ Error al crear profesional:', err)
      error.value = err.response?.data?.message || 'Error al crear profesional'
      return { 
        success: false, 
        message: error.value,
        errors: err.response?.data?.errors 
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Actualizar profesional
   */
  async function updateProfesional(id, data) {
    loading.value = true
    error.value = null

    try {
      const response = await profesionalesService.update(id, data)
      
      console.log('✅ Profesional actualizado:', response)

      if (response.success) {
        // Actualizar en la lista local
        const index = profesionales.value.findIndex(p => p.id === id)
        if (index !== -1) {
          profesionales.value[index] = response.data
        }
        
        // Actualizar current si es el mismo
        if (currentProfesional.value?.id === id) {
          currentProfesional.value = response.data
        }

        return { success: true, data: response.data }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('❌ Error al actualizar profesional:', err)
      error.value = err.response?.data?.message || 'Error al actualizar profesional'
      return { 
        success: false, 
        message: error.value,
        errors: err.response?.data?.errors 
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar profesional
   */
  async function deleteProfesional(id) {
    loading.value = true
    error.value = null

    try {
      const response = await profesionalesService.delete(id)
      
      console.log('✅ Profesional eliminado:', response)

      if (response.success) {
        // Remover de la lista local
        profesionales.value = profesionales.value.filter(p => p.id !== id)
        
        // Limpiar current si era el mismo
        if (currentProfesional.value?.id === id) {
          currentProfesional.value = null
        }

        return { success: true }
      }

      return { success: false, message: response.message }
    } catch (err) {
      console.error('❌ Error al eliminar profesional:', err)
      error.value = err.response?.data?.message || 'Error al eliminar profesional'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener horarios de un profesional
   */
  async function getHorarios(id) {
    try {
      const response = await profesionalesService.getHorarios(id)
      
      if (response.success) {
        return { success: true, data: response.data }
      }

      return { success: false }
    } catch (err) {
      console.error('❌ Error al obtener horarios:', err)
      return { success: false, message: err.message }
    }
  }

  /**
   * Cambiar estado de profesional
   */
  async function cambiarEstado(id, nuevoEstado) {
    try {
      const response = await updateProfesional(id, { estado: nuevoEstado })
      return response
    } catch (err) {
      console.error('❌ Error al cambiar estado:', err)
      return { success: false, message: err.message }
    }
  }

  /**
   * Limpiar estado
   */
  function clearCurrent() {
    currentProfesional.value = null
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    profesionales,
    loading,
    error,
    currentProfesional,
    
    // Constantes
    DIAS_SEMANA,
    ESTADOS,
    ESPECIALIDADES,
    
    // Getters
    profesionalesActivos,
    profesionalesOptions,
    totalProfesionales,
    totalActivos,
    totalInactivos,
    totalEnLicencia,
    
    // Actions
    fetchProfesionales,
    fetchProfesionalById,
    createProfesional,
    updateProfesional,
    deleteProfesional,
    getHorarios,
    cambiarEstado,
    clearCurrent,
    clearError
  }
})