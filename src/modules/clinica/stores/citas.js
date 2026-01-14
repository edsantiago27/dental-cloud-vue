// stores/citas.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import citasService from '../services/citasService'

export const useCitasStore = defineStore('citas', () => {
  // ==========================================
  // STATE
  // ==========================================
  
  const citas = ref([])
  const citaActual = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Estados disponibles
  const estados = ref([
  { value: 'programada', label: 'Programada', color: '#F59E0B', icon: 'fas fa-clock' },
  { value: 'confirmada', label: 'Confirmada', color: '#10B981', icon: 'fas fa-check-circle' },
  { value: 'en_atencion', label: 'En Atención', color: '#3B82F6', icon: 'fas fa-hourglass-half' },
  { value: 'completada', label: 'Completada', color: '#6366F1', icon: 'fas fa-check-double' },
  { value: 'cancelada', label: 'Cancelada', color: '#EF4444', icon: 'fas fa-times-circle' },
  { value: 'no_asistio', label: 'No Asistió', color: '#6B7280', icon: 'fas fa-user-slash' }
])
  
  // Filtros (sin valores por defecto para evitar parámetros vacíos)
  const filters = ref({
    profesional_id: null,
    paciente_id: null,
    estado: null,
    fecha_inicio: null,
    fecha_fin: null
  })

  // Vista del calendario
  const calendarView = ref('timeGridWeek') // dayGridMonth, timeGridWeek, timeGridDay, listWeek
  const currentDate = ref(new Date())

  // ==========================================
  // GETTERS
  // ==========================================
  
  const citasDelDia = computed(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return citas.value.filter(cita => cita.fecha === hoy)
  })

  const citasPendientes = computed(() => {
    return citas.value.filter(cita => cita.estado === 'pendiente')
  })

  const citasConfirmadas = computed(() => {
    return citas.value.filter(cita => cita.estado === 'confirmada')
  })

  // Formatear citas para FullCalendar
  const citasParaCalendario = computed(() => {
    return citas.value
      .filter(cita => {
        // Filtrar citas sin fecha o hora válida
        if (!cita.fecha || !cita.hora) {
          console.warn('⚠️ Cita sin fecha/hora, omitiendo:', cita.id)
          return false
        }
        return true
      })
      .map(cita => {
        const endTime = getCitaEndTime(cita)
        
        // Si no se pudo calcular fin, omitir
        if (!endTime) {
          console.warn('⚠️ No se pudo calcular fin para cita:', cita.id)
          return null
        }
        
        // Limpiar fecha y hora para start
        const fechaLimpia = cita.fecha.split('T')[0]
        const horaLimpia = cita.hora.substring(0, 5)
        
        return {
          id: cita.id,
          title: getCitaTitle(cita),
          start: `${fechaLimpia}T${horaLimpia}:00`,
          end: endTime,
          backgroundColor: getEstadoColor(cita.estado),
          borderColor: getEstadoColor(cita.estado),
          extendedProps: {
            ...cita
          }
        }
      })
      .filter(evento => evento !== null) // Filtrar nulls
  })

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  function getCitaTitle(cita) {
    const paciente = cita.paciente 
      ? `${cita.paciente.nombre} ${cita.paciente.apellido}`
      : 'Sin paciente'
    const tratamiento = cita.tratamiento?.nombre || 'Sin tratamiento'
    return `${paciente} - ${tratamiento}`
  }

  function getCitaEndTime(cita) {
    // Validar que tenemos fecha y hora
    if (!cita.fecha || !cita.hora) {
      console.warn('⚠️ Cita sin fecha/hora:', cita)
      return null
    }

    try {
      // Limpiar fecha: extraer solo YYYY-MM-DD
      // Laravel puede devolver: "2025-01-15" o "2025-01-15T00:00:00.000000Z"
      const fechaLimpia = cita.fecha.split('T')[0]
      
      // Limpiar hora: extraer solo HH:MM
      // Laravel puede devolver: "10:00" o "10:00:00"
      const horaLimpia = cita.hora.substring(0, 5)
      
      // Formato correcto: YYYY-MM-DDTHH:MM
      const fechaHoraStr = `${fechaLimpia}T${horaLimpia}:00`
      const inicio = new Date(fechaHoraStr)
      
      // Verificar que la fecha es válida
      if (isNaN(inicio.getTime())) {
        console.warn('⚠️ Fecha inválida después de limpiar:', fechaHoraStr, cita)
        return null
      }
      
      const duracion = cita.duracion_minutos || cita.tratamiento?.duracion_estimada || 30
      const fin = new Date(inicio.getTime() + duracion * 60000)
      
      return fin.toISOString()
    } catch (error) {
      console.error('❌ Error calculando fin de cita:', error, cita)
      return null
    }
  }

  function getEstadoColor(estado) {
    const estadoObj = estados.value.find(e => e.value === estado)
    return estadoObj ? estadoObj.color : '#6B7280'
  }

  // ==========================================
  // ACTIONS
  // ==========================================
  
  /**
   * Obtener citas de un rango de fechas
   */
  async function fetchCitas(start, end) {
    // Prevenir llamadas múltiples simultáneas
    if (loading.value) {
      console.log('⏳ Ya hay una carga en progreso, ignorando...')
      return { success: false, message: 'Carga en progreso' }
    }

    loading.value = true
    error.value = null

    try {
      // Solo incluir parámetros con valor
      const params = {}
      
      if (filters.value.profesional_id) {
        params.profesional_id = filters.value.profesional_id
      }
      if (filters.value.paciente_id) {
        params.paciente_id = filters.value.paciente_id
      }
      if (filters.value.estado) {
        params.estado = filters.value.estado
      }
      
      const response = await citasService.getByDateRange(start, end, params)
      
      console.log('📅 Citas obtenidas:', response)

      if (response.success) {
        // Manejar diferentes estructuras
        if (Array.isArray(response.data)) {
          citas.value = response.data
        } else if (Array.isArray(response.data?.data)) {
          citas.value = response.data.data
        } else if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          citas.value = response.data.data.data
        } else {
          citas.value = []
        }
      } else {
        citas.value = []
      }

      return { success: true }
    } catch (err) {
      console.error('❌ Error al obtener citas:', err)
      error.value = err.response?.data?.message || 'Error al cargar citas'
      citas.value = []
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener una cita por ID
   */
  async function fetchCita(id) {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.getById(id)
      
      if (response.success && response.data) {
        citaActual.value = response.data
      }

      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Error al obtener cita:', err)
      error.value = err.response?.data?.message || 'Error al cargar cita'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Crear nueva cita
   */
  async function createCita(citaData) {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.create(citaData)
      
      console.log('✅ Cita creada:', response)

      // Recargar citas del mes actual
      await refreshCalendar()

      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Error al crear cita:', err)
      
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {}
        error.value = Object.values(errors).flat().join(', ')
      } else {
        error.value = err.response?.data?.message || 'Error al crear cita'
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
   * Actualizar cita existente
   */
  async function updateCita(id, citaData) {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.update(id, citaData)
      
      console.log('✅ Cita actualizada:', response)

      await refreshCalendar()

      return { success: true, data: response.data }
    } catch (err) {
      console.error('❌ Error al actualizar cita:', err)
      
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {}
        error.value = Object.values(errors).flat().join(', ')
      } else {
        error.value = err.response?.data?.message || 'Error al actualizar cita'
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
   * Cambiar estado de cita
   */
  async function updateEstado(id, nuevoEstado) {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.updateStatus(id, nuevoEstado)
      
      console.log('✅ Estado actualizado:', response)

      await refreshCalendar()

      return { success: true }
    } catch (err) {
      console.error('❌ Error al actualizar estado:', err)
      error.value = err.response?.data?.message || 'Error al actualizar estado'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancelar cita
   */
  async function cancelarCita(id, motivo = '') {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.cancel(id, motivo)
      
      console.log('✅ Cita cancelada:', response)

      await refreshCalendar()

      return { success: true }
    } catch (err) {
      console.error('❌ Error al cancelar cita:', err)
      error.value = err.response?.data?.message || 'Error al cancelar cita'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Confirmar cita
   */
  async function confirmarCita(id) {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.confirm(id)
      
      console.log('✅ Cita confirmada:', response)

      await refreshCalendar()

      return { success: true }
    } catch (err) {
      console.error('❌ Error al confirmar cita:', err)
      error.value = err.response?.data?.message || 'Error al confirmar cita'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Eliminar cita
   */
  async function deleteCita(id) {
    loading.value = true
    error.value = null

    try {
      await citasService.delete(id)
      
      console.log('✅ Cita eliminada')

      await refreshCalendar()

      return { success: true }
    } catch (err) {
      console.error('❌ Error al eliminar cita:', err)
      error.value = err.response?.data?.message || 'Error al eliminar cita'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Verificar disponibilidad
   */
  async function checkAvailability(fecha, hora, profesional_id, duracion_minutos, exclude_cita_id = null) {
    try {
      const response = await citasService.checkAvailability(
        fecha,
        hora,
        profesional_id,
        duracion_minutos,
        exclude_cita_id
      )
      
      return response
    } catch (err) {
      console.error('❌ Error al verificar disponibilidad:', err)
      return { 
        success: false, 
        disponible: false,
        message: 'Error al verificar disponibilidad' 
      }
    }
  }

  /**
   * Obtener citas de hoy
   */
  async function fetchCitasHoy(profesional_id = null) {
    try {
      const response = await citasService.getToday(profesional_id)
      
      if (response.success) {
        return { success: true, data: response.data }
      }
      
      return { success: false }
    } catch (err) {
      console.error('❌ Error al obtener citas de hoy:', err)
      return { success: false }
    }
  }

  /**
   * Refrescar calendario (obtener mes actual)
   */
  async function refreshCalendar() {
    // No refrescar si ya está cargando
    if (loading.value) {
      console.log('⏳ Ya cargando, omitiendo refresh')
      return { success: false }
    }

    const start = new Date(currentDate.value)
    start.setDate(1)
    
    const end = new Date(currentDate.value)
    end.setMonth(end.getMonth() + 1)
    end.setDate(0)
    
    return await fetchCitas(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    )
  }

  /**
   * Aplicar filtros
   */
  async function applyFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    await refreshCalendar()
  }

  /**
   * Limpiar filtros
   */
  async function clearFilters() {
    filters.value = {
      profesional_id: null,
      paciente_id: null,
      estado: null,
      fecha_inicio: null,
      fecha_fin: null
    }
    await refreshCalendar()
  }

  /**
   * Cambiar vista del calendario
   */
  function changeView(view) {
    calendarView.value = view
  }

  /**
   * Navegar a fecha
   */
  function navigateToDate(date) {
    currentDate.value = new Date(date)
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
    citas.value = []
    citaActual.value = null
    loading.value = false
    error.value = null
    filters.value = {
      profesional_id: null,
      paciente_id: null,
      estado: null,
      fecha_inicio: null,
      fecha_fin: null
    }
    calendarView.value = 'timeGridWeek'
    currentDate.value = new Date()
  }

  // ==========================================
  // RETURN
  // ==========================================
  
  return {
    // State
    citas,
    citaActual,
    loading,
    error,
    estados,
    filters,
    calendarView,
    currentDate,
    
    // Getters
    citasDelDia,
    citasPendientes,
    citasConfirmadas,
    citasParaCalendario,
    
    // Actions
    fetchCitas,
    fetchCita,
    createCita,
    updateCita,
    updateEstado,
    cancelarCita,
    confirmarCita,
    deleteCita,
    checkAvailability,
    fetchCitasHoy,
    refreshCalendar,
    applyFilters,
    clearFilters,
    changeView,
    navigateToDate,
    clearError,
    $reset
  }
})