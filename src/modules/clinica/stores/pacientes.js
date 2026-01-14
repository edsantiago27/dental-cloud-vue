// stores/pacientes.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import pacientesService from '@clinica/services/pacientesService'

export const usePacientesStore = defineStore('pacientes', () => {
  // ==========================================
  // STATE
  // ==========================================
  
  const pacientes = ref([])
  const pacienteActual = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Paginación
  const currentPage = ref(1)
  const perPage = ref(20)
  const total = ref(0)
  const lastPage = ref(1)
  
  // Filtros
  const filters = ref({
    search: '',
    estado: 'activo',
    genero: '',
    fechaDesde: '',
    fechaHasta: ''
  })

  // ==========================================
  // GETTERS
  // ==========================================
  
  const totalPages = computed(() => lastPage.value)
  
  const hasNextPage = computed(() => currentPage.value < lastPage.value)
  
  const hasPrevPage = computed(() => currentPage.value > 1)
  
  const paginationInfo = computed(() => {
    const from = (currentPage.value - 1) * perPage.value + 1
    const to = Math.min(currentPage.value * perPage.value, total.value)
    return { from, to, total: total.value }
  })

  // ==========================================
  // ACTIONS
  // ==========================================
  
  /**
   * Obtener lista de pacientes
   */
  async function fetchPacientes(page = 1) {
    loading.value = true
    error.value = null

    try {
      const params = {
        page,
        per_page: perPage.value,
        ...filters.value
      }

      const response = await pacientesService.getAll(params)
      
      console.log('📦 Pacientes obtenidos:', response)

      // Laravel devuelve estructura paginada
      if (response.success && response.data) {
        pacientes.value = response.data.data || []
        currentPage.value = response.data.current_page || 1
        total.value = response.data.total || 0
        lastPage.value = response.data.last_page || 1
        perPage.value = response.data.per_page || 20
      } else {
        pacientes.value = []
      }

      return { success: true }
    } catch (err) {
      console.error('❌ Error al obtener pacientes:', err)
      error.value = err.response?.data?.message || 'Error al cargar pacientes'
      pacientes.value = []
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener un paciente por ID
   */
  async function fetchPaciente(id) {
    loading.value = true
    error.value = null

    try {
      const response = await pacientesService.getById(id)
      
      if (response.success && response.data) {
        pacienteActual.value = response.data
      }

      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Error al obtener paciente:', err)
      error.value = err.response?.data?.message || 'Error al cargar paciente'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Crear nuevo paciente
   */
  async function createPaciente(pacienteData) {
    loading.value = true
    error.value = null

    try {
      const response = await pacientesService.create(pacienteData)
      
      console.log('✅ Paciente creado:', response)

      // Recargar lista
      await fetchPacientes(currentPage.value)

      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Error al crear paciente:', err)
      
      // Manejar errores de validación
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {}
        error.value = Object.values(errors).flat().join(', ')
      } else {
        error.value = err.response?.data?.message || 'Error al crear paciente'
      }
      
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
   * Actualizar paciente existente
   */
  async function updatePaciente(id, pacienteData) {
    loading.value = true
    error.value = null

    try {
      const response = await pacientesService.update(id, pacienteData)
      
      console.log('✅ Paciente actualizado:', response)

      // Recargar lista
      await fetchPacientes(currentPage.value)

      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Error al actualizar paciente:', err)
      
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {}
        error.value = Object.values(errors).flat().join(', ')
      } else {
        error.value = err.response?.data?.message || 'Error al actualizar paciente'
      }
      
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
   * Eliminar paciente
   */
  async function deletePaciente(id) {
    loading.value = true
    error.value = null

    try {
      await pacientesService.delete(id)
      
      console.log('✅ Paciente eliminado')

      // Recargar lista
      await fetchPacientes(currentPage.value)

      return { success: true }
    } catch (err) {
      console.error('❌ Error al eliminar paciente:', err)
      error.value = err.response?.data?.message || 'Error al eliminar paciente'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Buscar pacientes
   */
  async function searchPacientes(query) {
    filters.value.search = query
    await fetchPacientes(1)
  }

  /**
   * Aplicar filtros
   */
  async function applyFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    await fetchPacientes(1)
  }

  /**
   * Limpiar filtros
   */
  async function clearFilters() {
    filters.value = {
      search: '',
      estado: 'activo',
      genero: '',
      fechaDesde: '',
      fechaHasta: ''
    }
    await fetchPacientes(1)
  }

  /**
   * Cambiar página
   */
  async function changePage(page) {
    await fetchPacientes(page)
  }

  /**
   * Limpiar errores
   */
  function clearError() {
    error.value = null
  }

  /**
   * Reset store
   */
  function $reset() {
    pacientes.value = []
    pacienteActual.value = null
    loading.value = false
    error.value = null
    currentPage.value = 1
    total.value = 0
    lastPage.value = 1
    filters.value = {
      search: '',
      estado: 'activo',
      genero: '',
      fechaDesde: '',
      fechaHasta: ''
    }
  }

  // ==========================================
  // RETURN
  // ==========================================
  
  return {
    // State
    pacientes,
    pacienteActual,
    loading,
    error,
    currentPage,
    perPage,
    total,
    lastPage,
    filters,
    
    // Getters
    totalPages,
    hasNextPage,
    hasPrevPage,
    paginationInfo,
    
    // Actions
    fetchPacientes,
    fetchPaciente,
    createPaciente,
    updatePaciente,
    deletePaciente,
    searchPacientes,
    applyFilters,
    clearFilters,
    changePage,
    clearError,
    $reset
  }
})