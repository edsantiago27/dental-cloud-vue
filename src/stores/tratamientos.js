// stores/tratamientos.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import tratamientosService from '@/services/tratamientosService'

export const useTratamientosStore = defineStore('tratamientos', () => {
  // ==========================================
  // STATE
  // ==========================================
  
  const tratamientos = ref([])
  const tratamientoActual = ref(null)
  const categorias = ref([
    { value: 'preventivo', label: 'Preventivo' },
    { value: 'restaurador', label: 'Restaurador' },
    { value: 'quirurgico', label: 'Quirúrgico' },
    { value: 'estetico', label: 'Estético' },
    { value: 'ortodontico', label: 'Ortodóntico' },
    { value: 'endodoncia', label: 'Endodoncia' },
    { value: 'periodoncia', label: 'Periodoncia' },
    { value: 'otro', label: 'Otro' }
  ])
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
    categoria: '',
    estado: '' // Mostrar todos por defecto
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

  const tratamientosActivos = computed(() => {
    return tratamientos.value.filter(t => t.estado === 'activo')
  })

  // ==========================================
  // ACTIONS
  // ==========================================
  
  /**
   * Obtener lista de tratamientos
   */
  async function fetchTratamientos(page = 1) {
    loading.value = true
    error.value = null

    try {
      // Mapear parámetros de Vue a Laravel
      const params = {
        page,
        per_page: perPage.value
      }

      // Solo agregar parámetros si tienen valor
      if (filters.value.search) {
        params.buscar = filters.value.search // Laravel usa "buscar"
      }
      if (filters.value.categoria) {
        params.categoria = filters.value.categoria
      }
      if (filters.value.estado) {
        params.estado = filters.value.estado
      }

      const response = await tratamientosService.getAll(params)
      
      console.log('📦 Respuesta completa de API:', response)
      console.log('📦 response.data:', response.data)
      console.log('📦 response.data.data:', response.data?.data)

      // Intentar múltiples estructuras de respuesta
      let data = []
      let paginationData = null

      if (response.success) {
        // Opción 1: response.data es un array directo
        if (Array.isArray(response.data)) {
          console.log('✅ Estructura: Array directo')
          data = response.data
          total.value = data.length
          lastPage.value = 1
        }
        // Opción 2: response.data.data es un array directo
        else if (Array.isArray(response.data?.data)) {
          console.log('✅ Estructura: response.data.data es array')
          data = response.data.data
          // Puede o no tener paginación
          paginationData = response.data
        }
        // Opción 3: response.data.data.data (triple anidado como pacientes)
        else if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          console.log('✅ Estructura: Triple anidado (como pacientes)')
          data = response.data.data.data
          paginationData = response.data.data
        }
        // Opción 4: response.data.tratamientos
        else if (Array.isArray(response.data?.tratamientos)) {
          console.log('✅ Estructura: response.data.tratamientos')
          data = response.data.tratamientos
        }
        else {
          console.error('❌ Estructura desconocida:', response)
        }

        tratamientos.value = data

        // Manejar paginación si existe
        if (paginationData) {
          currentPage.value = paginationData.current_page || 1
          total.value = paginationData.total || data.length
          lastPage.value = paginationData.last_page || 1
          perPage.value = paginationData.per_page || 20
        } else {
          currentPage.value = 1
          total.value = data.length
          lastPage.value = 1
        }

        console.log('✅ Tratamientos cargados:', data.length)
        console.log('✅ Tratamientos:', data)
      } else {
        tratamientos.value = []
        console.error('❌ Response sin success:', response)
      }

      return { success: true }
    } catch (err) {
      console.error('❌ Error al obtener tratamientos:', err)
      console.error('❌ Error completo:', err.response)
      error.value = err.response?.data?.message || 'Error al cargar tratamientos'
      tratamientos.value = []
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener un tratamiento por ID
   */
  async function fetchTratamiento(id) {
    loading.value = true
    error.value = null

    try {
      const response = await tratamientosService.getById(id)
      
      if (response.success && response.data) {
        tratamientoActual.value = response.data
      }

      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Error al obtener tratamiento:', err)
      error.value = err.response?.data?.message || 'Error al cargar tratamiento'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Crear nuevo tratamiento
   */
  async function createTratamiento(tratamientoData) {
    loading.value = true
    error.value = null

    try {
      const response = await tratamientosService.create(tratamientoData)
      
      console.log('✅ Tratamiento creado:', response)

      // Recargar lista
      await fetchTratamientos(currentPage.value)

      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Error al crear tratamiento:', err)
      
      // Manejar errores de validación
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {}
        error.value = Object.values(errors).flat().join(', ')
      } else {
        error.value = err.response?.data?.message || 'Error al crear tratamiento'
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
   * Actualizar tratamiento existente
   */
  async function updateTratamiento(id, tratamientoData) {
    loading.value = true
    error.value = null

    try {
      const response = await tratamientosService.update(id, tratamientoData)
      
      console.log('✅ Tratamiento actualizado:', response)

      // Recargar lista
      await fetchTratamientos(currentPage.value)

      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Error al actualizar tratamiento:', err)
      
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {}
        error.value = Object.values(errors).flat().join(', ')
      } else {
        error.value = err.response?.data?.message || 'Error al actualizar tratamiento'
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
   * Eliminar tratamiento
   */
  async function deleteTratamiento(id) {
    loading.value = true
    error.value = null

    try {
      await tratamientosService.delete(id)
      
      console.log('✅ Tratamiento eliminado')

      // Recargar lista
      await fetchTratamientos(currentPage.value)

      return { success: true }
    } catch (err) {
      console.error('❌ Error al eliminar tratamiento:', err)
      error.value = err.response?.data?.message || 'Error al eliminar tratamiento'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Buscar tratamientos
   */
  async function searchTratamientos(query) {
    filters.value.search = query
    await fetchTratamientos(1)
  }

  /**
   * Aplicar filtros
   */
  async function applyFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    await fetchTratamientos(1)
  }

  /**
   * Limpiar filtros
   */
  async function clearFilters() {
    filters.value = {
      search: '',
      categoria: '',
      estado: '' // Mostrar todos
    }
    await fetchTratamientos(1)
  }

  /**
   * Cambiar página
   */
  async function changePage(page) {
    await fetchTratamientos(page)
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
    tratamientos.value = []
    tratamientoActual.value = null
    loading.value = false
    error.value = null
    currentPage.value = 1
    total.value = 0
    lastPage.value = 1
    filters.value = {
      search: '',
      categoria: '',
      estado: '' // Mostrar todos
    }
  }

  // ==========================================
  // RETURN
  // ==========================================
  
  return {
    // State
    tratamientos,
    tratamientoActual,
    categorias,
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
    tratamientosActivos,
    
    // Actions
    fetchTratamientos,
    fetchTratamiento,
    createTratamiento,
    updateTratamiento,
    deleteTratamiento,
    searchTratamientos,
    applyFilters,
    clearFilters,
    changePage,
    clearError,
    $reset
  }
})