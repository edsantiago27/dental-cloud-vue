// src/modules/demo/stores/demoPacientes.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demoStorageService } from '../services/demoStorageService'

export const useDemoPacientesStore = defineStore('demo-pacientes', () => {
  const pacientes = ref([])
  const loading = ref(false)
  
  const filters = ref({
    search: '',
    estado: 'activo'
  })

  // Acciones
  function fetchPacientes() {
    loading.value = true
    try {
      pacientes.value = demoStorageService.getPacientes()
    } finally {
      loading.value = false
    }
  }

  function createPaciente(data) {
    const newPaciente = {
      ...data,
      id: Date.now(),
      estado: 'activo'
    }
    const current = demoStorageService.getPacientes()
    const updated = [newPaciente, ...current]
    demoStorageService.savePacientes(updated)
    pacientes.value = updated
    return { success: true, data: newPaciente }
  }

  function updatePaciente(id, data) {
    const current = demoStorageService.getPacientes()
    const updated = current.map(p => p.id === id ? { ...p, ...data } : p)
    demoStorageService.savePacientes(updated)
    pacientes.value = updated
    return { success: true }
  }

  function deletePaciente(id) {
    const current = demoStorageService.getPacientes()
    const updated = current.filter(p => p.id !== id)
    demoStorageService.savePacientes(updated)
    pacientes.value = updated
    return { success: true }
  }

  const filteredPacientes = computed(() => {
    return pacientes.value.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(filters.value.search.toLowerCase()) || 
                          p.email.toLowerCase().includes(filters.value.search.toLowerCase())
      const matchEstado = !filters.value.estado || p.estado === filters.value.estado
      return matchSearch && matchEstado
    })
  })

  return {
    pacientes,
    loading,
    filters,
    filteredPacientes,
    fetchPacientes,
    createPaciente,
    updatePaciente,
    deletePaciente
  }
})
