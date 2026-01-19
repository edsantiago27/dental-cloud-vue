// src/stores/paciente/citas.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { citasService } from '../services'

export const usePacienteCitasStore = defineStore('pacienteCitas', () => {
  // State
  const citas = ref([])
  const citaActual = ref(null)
  const profesionales = ref([])
  const tratamientos = ref([])
  const horariosDisponibles = ref([])
  const diasLaborales = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const citasProximas = computed(() => {
    const ahora = new Date()
    console.log('🔮 Calculating citasProximas. Total citas:', citas.value.length)
    
    return citas.value.filter(c => {
      if (!c.fecha || !c.hora) {
          console.log(`⚠️ Cita ${c.id} rechazada: faltan datos`, { fecha: c.fecha, hora: c.hora })
          return false
      }
      
      const fechaStr = `${c.fecha}T${c.hora}`
      const fechaCita = new Date(fechaStr)
      
      if (isNaN(fechaCita.getTime())) {
          console.log(`⚠️ Cita ${c.id} rechazada: fecha inválida`, fechaStr)
          return false
      }
      
      const esFutura = fechaCita >= ahora
      const estadoValido = !['cancelada', 'completada', 'no_asistio'].includes(c.estado)
      
      if (!esFutura || !estadoValido) {
          console.log(`🚫 Cita ${c.id} filtrada. EsFutura: ${esFutura}, Estado: ${c.estado}, Fecha: ${fechaStr}, Ahora: ${ahora.toISOString()}`)
      }
      
      return esFutura && estadoValido
    }).sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`))
  })

  const citasPasadas = computed(() => {
    const ahora = new Date()
    return citas.value.filter(c => {
      if (!c.fecha || !c.hora) return false
      const fechaStr = `${c.fecha}T${c.hora}`
      const fechaCita = new Date(fechaStr)
      if (isNaN(fechaCita.getTime())) return false
      
      return fechaCita < ahora || ['cancelada', 'completada', 'no_asistio'].includes(c.estado)
    }).sort((a, b) => new Date(`${b.fecha}T${b.hora}`) - new Date(`${a.fecha}T${a.hora}`))
  })

  const proximaCita = computed(() => {
    return citasProximas.value[0] || null
  })

  // Actions
  async function fetchCitas(filtros = {}) {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 Fetching citas with filters:', filtros)
      const response = await citasService.getMisCitas(filtros)
      console.log('📦 Raw citas response:', response)
      
      // Aceptar respuestas que tengan éxito explícito O datos válidos
      if (response.success !== false) {
        // Manejar estructura paginada o lista directa
        const data = response.data || response

        console.log('🔍 Data extracted:', data)
        let citasArray = []
        
        if (data && data.data && Array.isArray(data.data)) {
            console.log('👉 Found paginated data.data')
            citasArray = data.data
        } else if (Array.isArray(data)) {
            console.log('👉 Found direct array in data')
            citasArray = data
        } else if (Array.isArray(response)) {
             console.log('👉 Found direct array in response')
             citasArray = response
        } else {
             console.warn('⚠️ Could not find array in response, defaulting to empty')
             citasArray = []
        }
        
        citas.value = citasArray
        console.log('✅ Final citas stored:', citas.value)
        return { success: true }
      }

      throw new Error(response.message || 'Error al cargar citas')
    } catch (err) {
      console.error('❌ Error fetchCitas:', err)
      error.value = 'Error al cargar las citas'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchCita(id) {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.getCita(id)
      
      if (response.success) {
        citaActual.value = response.data
        return { success: true, data: response.data }
      }

      throw new Error(response.message || 'Error al cargar cita')
    } catch (err) {
      console.error('❌ Error fetchCita:', err)
      error.value = 'Error al cargar el detalle de la cita'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function fetchProfesionales() {
    try {
      const response = await citasService.getProfesionales()
      
      if (response.success) {
        profesionales.value = response.data
        return { success: true }
      }

      throw new Error(response.message || 'Error al cargar profesionales')
    } catch (err) {
      console.error('❌ Error fetchProfesionales:', err)
      return { success: false }
    }
  }

  async function fetchTratamientos() {
    try {
      const response = await citasService.getTratamientos()
      
      if (response.success) {
        tratamientos.value = response.data
        return { success: true }
      }

      throw new Error(response.message || 'Error al cargar tratamientos')
    } catch (err) {
      console.error('❌ Error fetchTratamientos:', err)
      return { success: false }
    }
  }

  async function fetchHorariosDisponibles(profesionalId, fecha, duracion = 30) {
    loading.value = true

    try {
      const response = await citasService.getHorariosDisponibles(profesionalId, fecha, duracion)
      
      if (response.success) {
        horariosDisponibles.value = response.data
        return { success: true, data: response.data }
      }

      throw new Error(response.message || 'Error al cargar horarios')
    } catch (err) {
      console.error('❌ Error fetchHorariosDisponibles:', err)
      horariosDisponibles.value = []
      return { success: false }
    } finally {
      loading.value = false
    }
  }

  async function fetchDiasLaborales(profesionalId) {
    try {
      const response = await citasService.getDiasLaborales(profesionalId)
      
      if (response.success) {
        diasLaborales.value = response.data
        return { success: true, data: response.data }
      }

      throw new Error(response.message || 'Error al cargar días laborales')
    } catch (err) {
      console.error('❌ Error fetchDiasLaborales:', err)
      return { success: false }
    }
  }

  async function agendarCita(datos) {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.agendarCita(datos)
      
      if (response.success) {
        // Agregar la nueva cita a la lista
        citas.value.unshift(response.data)
        return { success: true, data: response.data }
      }

      throw new Error(response.message || 'Error al agendar cita')
    } catch (err) {
      console.error('❌ Error agendarCita:', err)
      
      let message = 'Error al agendar la cita'
      
      if (err.response?.status === 422) {
        const errors = err.response.data.errors
        if (errors) {
          message = Object.values(errors).flat().join(', ')
        } else if (err.response.data.message) {
          message = err.response.data.message
        }
      }

      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  async function cancelarCita(id, motivo) {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.cancelarCita(id, motivo)
      
      if (response.success) {
        // Actualizar la cita en la lista
        const index = citas.value.findIndex(c => c.id === id)
        if (index !== -1) {
          citas.value[index].estado = 'cancelada'
          citas.value[index].motivo_cancelacion = motivo
        }
        return { success: true }
      }

      throw new Error(response.message || 'Error al cancelar cita')
    } catch (err) {
      console.error('❌ Error cancelarCita:', err)
      
      let message = 'Error al cancelar la cita'
      
      if (err.response?.data?.message) {
        message = err.response.data.message
      }

      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  async function reagendarCita(id, fecha, hora) {
    loading.value = true
    error.value = null

    try {
      const response = await citasService.reagendarCita(id, fecha, hora)
      
      if (response.success) {
        // Actualizar la cita en la lista
        const index = citas.value.findIndex(c => c.id === id)
        if (index !== -1) {
          citas.value[index].fecha = fecha
          citas.value[index].hora = hora
        }
        return { success: true }
      }

      throw new Error(response.message || 'Error al reagendar cita')
    } catch (err) {
      console.error('❌ Error reagendarCita:', err)
      
      let message = 'Error al reagendar la cita'
      
      if (err.response?.data?.message) {
        message = err.response.data.message
      }

      error.value = message
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function reset() {
    citas.value = []
    citaActual.value = null
    profesionales.value = []
    tratamientos.value = []
    horariosDisponibles.value = []
    diasLaborales.value = []
    error.value = null
  }

  return {
    // State
    citas,
    citaActual,
    profesionales,
    tratamientos,
    horariosDisponibles,
    diasLaborales,
    loading,
    error,
    
    // Getters
    citasProximas,
    citasPasadas,
    proximaCita,
    
    // Actions
    fetchCitas,
    fetchCita,
    fetchProfesionales,
    fetchTratamientos,
    fetchHorariosDisponibles,
    fetchDiasLaborales,
    agendarCita,
    cancelarCita,
    reagendarCita,
    clearError,
    reset
  }
})