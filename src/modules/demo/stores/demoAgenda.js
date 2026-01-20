// src/modules/demo/stores/demoAgenda.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demoStorageService } from '../services/demoStorageService'

export const useDemoAgendaStore = defineStore('demo-agenda', () => {
  const appointments = ref([])
  const loading = ref(false)
  
  const estados = ref([
    { value: 'programada', label: 'Programada', color: '#F59E0B' },
    { value: 'confirmada', label: 'Confirmada', color: '#10B981' },
    { value: 'atendida', label: 'Atendida', color: '#3B82F6' },
    { value: 'cancelada', label: 'Cancelada', color: '#EF4444' }
  ])

  const filters = ref({
    profesional_id: null,
    estado: null
  })

  // Acciones
  function fetchAppointments() {
    loading.value = true
    try {
      appointments.value = demoStorageService.getAgenda()
    } finally {
      loading.value = false
    }
  }

  function createAppointment(data) {
    const newAppointment = {
      ...data,
      id: Date.now(),
      estado: data.estado || 'programada'
    }
    const current = demoStorageService.getAgenda()
    const updated = [...current, newAppointment]
    demoStorageService.saveAgenda(updated)
    appointments.value = updated
    return { success: true, data: newAppointment }
  }

  function updateStatus(id, estado) {
    const current = demoStorageService.getAgenda()
    const updated = current.map(a => a.id === id ? { ...a, estado } : a)
    demoStorageService.saveAgenda(updated)
    appointments.value = updated
    return { success: true }
  }

  function deleteAppointment(id) {
    const current = demoStorageService.getAgenda()
    const updated = current.filter(a => a.id !== id)
    demoStorageService.saveAgenda(updated)
    appointments.value = updated
    return { success: true }
  }

  const filteredAppointments = computed(() => {
    return appointments.value.filter(a => {
      const matchProf = !filters.value.profesional_id || a.profesional_id === filters.value.profesional_id
      const matchStatus = !filters.value.estado || a.estado === filters.value.estado
      return matchProf && matchStatus
    }).sort((a, b) => a.hora.localeCompare(b.hora))
  })

  return {
    appointments,
    loading,
    estados,
    filters,
    filteredAppointments,
    fetchAppointments,
    createAppointment,
    updateStatus,
    deleteAppointment
  }
})
