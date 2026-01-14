// stores/historiaClinica.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import historiaClinicaService from '@/services/historiaClinicaService'

export const useHistoriaClinicaStore = defineStore('historiaClinica', () => {
  // ==========================================
  // STATE
  // ==========================================

  const pacienteActual = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Ficha Médica
  const fichaMedica = ref(null)

  // Odontograma
  const odontograma = ref([])
  
  // Estados posibles de dientes
  const estadosDiente = ref([
    { value: 'sano', label: 'Sano', color: '#FFFFFF', icon: 'fa-check-circle' },
    { value: 'caries', label: 'Caries', color: '#8B4513', icon: 'fa-exclamation-triangle' },
    { value: 'obturacion', label: 'Obturación', color: '#808080', icon: 'fa-fill' },
    { value: 'endodoncia', label: 'Endodoncia', color: '#FF69B4', icon: 'fa-tooth' },
    { value: 'corona', label: 'Corona', color: '#FFD700', icon: 'fa-crown' },
    { value: 'puente', label: 'Puente', color: '#4169E1', icon: 'fa-bridge' },
    { value: 'implante', label: 'Implante', color: '#32CD32', icon: 'fa-tooth' },
    { value: 'ausente', label: 'Ausente', color: '#FF0000', icon: 'fa-times-circle' },
    { value: 'fractura', label: 'Fractura', color: '#DC143C', icon: 'fa-broken-heart' },
    { value: 'protesis', label: 'Prótesis', color: '#9370DB', icon: 'fa-tooth' }
  ])

  // Timeline de Tratamientos
  const tratamientosRealizados = ref([])
  const totalTratamientos = ref(0)
  const currentPage = ref(1)

  // Diagnósticos
  const diagnosticos = ref([])

  // Archivos
  const archivos = ref([])
  const uploadProgress = ref(0)

  // Plan de Tratamiento
  const planTratamiento = ref(null)

  // ==========================================
  // GETTERS
  // ==========================================

  const dientesSuperiores = computed(() => {
    return odontograma.value.filter(d => d.numero >= 11 && d.numero <= 28)
  })

  const dientesInferiores = computed(() => {
    return odontograma.value.filter(d => d.numero >= 31 && d.numero <= 48)
  })

  const dientesConProblemas = computed(() => {
    return odontograma.value.filter(d => d.estado !== 'sano' && d.estado !== 'ausente')
  })

  const tratamientosRecientes = computed(() => {
    return tratamientosRealizados.value.slice(0, 10)
  })

  const costoTotalTratamientos = computed(() => {
    return tratamientosRealizados.value.reduce((total, t) => {
      return total + (parseFloat(t.costo) || 0)
    }, 0)
  })

  const diagnosticosActivos = computed(() => {
    return diagnosticos.value.filter(d => d.estado === 'activo')
  })

  const archivosPorTipo = computed(() => {
    const tipos = {
      radiografia: [],
      documento: [],
      imagen: [],
      otro: []
    }
    
    archivos.value.forEach(archivo => {
      const tipo = archivo.tipo || 'otro'
      if (tipos[tipo]) {
        tipos[tipo].push(archivo)
      }
    })
    
    return tipos
  })

  // ==========================================
  // ACTIONS - FICHA MÉDICA
  // ==========================================

  async function fetchFichaMedica(pacienteId) {
    loading.value = true
    error.value = null

    try {
      const response = await historiaClinicaService.getFichaMedica(pacienteId)
      
      if (response.success) {
        fichaMedica.value = response.data
      }
      
      return response
    } catch (err) {
      error.value = err.message
      console.error('Error al obtener ficha médica:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  async function saveFichaMedica(pacienteId, data) {
    loading.value = true
    error.value = null

    try {
      const response = await historiaClinicaService.saveFichaMedica(pacienteId, data)
      
      if (response.success) {
        fichaMedica.value = response.data
      }
      
      return response
    } catch (err) {
      error.value = err.message
      console.error('Error al guardar ficha médica:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  // ==========================================
  // ACTIONS - ODONTOGRAMA
  // ==========================================

  async function fetchOdontograma(pacienteId) {
    loading.value = true
    error.value = null

    try {
      const response = await historiaClinicaService.getOdontograma(pacienteId)
      
      if (response.success) {
        odontograma.value = response.data || generarOdontogramaVacio()
      } else {
        // Si no existe, generar uno vacío
        odontograma.value = generarOdontogramaVacio()
      }
      
      return response
    } catch (err) {
      // Si hay error, usar odontograma vacío
      odontograma.value = generarOdontogramaVacio()
      console.error('Error al obtener odontograma:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateDiente(pacienteId, dienteNumero, estado, notas = '') {
    console.group('📡 Store - updateDiente')
    console.log('PacienteId:', pacienteId)
    console.log('Diente número:', dienteNumero)
    console.log('Estado (tipo):', typeof estado)
    console.log('Estado (valor):', estado)
    console.log('Notas:', notas)
    
    const payload = {
      estado: String(estado),  // Asegurar string
      notas: notas || ''
    }
    console.log('📦 Payload a enviar:', payload)
    console.groupEnd()
    
    try {
      const response = await historiaClinicaService.updateDiente(pacienteId, dienteNumero, payload)
      
      if (response.success) {
        // Actualizar en el array local
        const index = odontograma.value.findIndex(d => d.numero === dienteNumero)
        if (index !== -1) {
          odontograma.value[index] = {
            ...odontograma.value[index],
            estado: String(estado),
            notas: notas || ''
          }
        }
      }
      
      return response
    } catch (err) {
      console.error('Error al actualizar diente:', err)
      return { success: false, message: err.message }
    }
  }

  async function saveOdontograma(pacienteId) {
    loading.value = true
    error.value = null

    try {
      const response = await historiaClinicaService.saveOdontograma(
        pacienteId,
        odontograma.value
      )
      
      return response
    } catch (err) {
      error.value = err.message
      console.error('Error al guardar odontograma:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  function generarOdontogramaVacio() {
    const dientes = []
    
    // Dientes superiores: 11-18 (derecha), 21-28 (izquierda)
    for (let i = 18; i >= 11; i--) {
      dientes.push({ numero: i, estado: 'sano', notas: '' })
    }
    for (let i = 21; i <= 28; i++) {
      dientes.push({ numero: i, estado: 'sano', notas: '' })
    }
    
    // Dientes inferiores: 41-48 (derecha), 31-38 (izquierda)
    for (let i = 48; i >= 41; i--) {
      dientes.push({ numero: i, estado: 'sano', notas: '' })
    }
    for (let i = 31; i <= 38; i++) {
      dientes.push({ numero: i, estado: 'sano', notas: '' })
    }
    
    return dientes
  }

  // ==========================================
  // ACTIONS - TRATAMIENTOS REALIZADOS (ENTRADAS CLÍNICAS)
  // ==========================================

  async function fetchTratamientosRealizados(pacienteId, params = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await historiaClinicaService.getEntradas(pacienteId, params)
      
      if (response.success) {
        tratamientosRealizados.value = response.data.data || response.data
        totalTratamientos.value = response.data.total || tratamientosRealizados.value.length
      }
      
      return response
    } catch (err) {
      error.value = err.message
      console.error('Error al obtener tratamientos:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }

  async function registrarTratamiento(pacienteId, data) {
    try {
      const response = await historiaClinicaService.storeEntrada(pacienteId, data)
      
      if (response.success) {
        // Agregar al inicio del array
        tratamientosRealizados.value.unshift(response.data)
      }
      
      return response
    } catch (err) {
      console.error('Error al registrar tratamiento:', err)
      return { success: false, message: err.message }
    }
  }

  async function updateTratamiento(pacienteId, entradaId, data) {
    try {
      const response = await historiaClinicaService.updateEntrada(pacienteId, entradaId, data)
      
      if (response.success) {
        // Actualizar en el array local
        const index = tratamientosRealizados.value.findIndex(t => t.id === entradaId)
        if (index !== -1) {
          tratamientosRealizados.value[index] = response.data
        }
      }
      
      return response
    } catch (err) {
      console.error('Error al actualizar tratamiento:', err)
      return { success: false, message: err.message }
    }
  }

  async function deleteTratamiento(pacienteId, entradaId) {
    try {
      const response = await historiaClinicaService.deleteEntrada(pacienteId, entradaId)
      
      if (response.success) {
        // Eliminar del array local
        tratamientosRealizados.value = tratamientosRealizados.value.filter(t => t.id !== entradaId)
      }
      
      return response
    } catch (err) {
      console.error('Error al eliminar tratamiento:', err)
      return { success: false, message: err.message }
    }
  }

  // ==========================================
  // ACTIONS - DIAGNÓSTICOS
  // ==========================================

  async function fetchDiagnosticos(pacienteId) {
    try {
      const response = await historiaClinicaService.getDiagnosticos(pacienteId)
      
      if (response.success) {
        diagnosticos.value = response.data
      }
      
      return response
    } catch (err) {
      console.error('Error al obtener diagnósticos:', err)
      return { success: false, message: err.message }
    }
  }

  async function createDiagnostico(pacienteId, data) {
    try {
      const response = await historiaClinicaService.createDiagnostico(pacienteId, data)
      
      if (response.success) {
        diagnosticos.value.unshift(response.data)
      }
      
      return response
    } catch (err) {
      console.error('Error al crear diagnóstico:', err)
      return { success: false, message: err.message }
    }
  }

  // ==========================================
  // ACTIONS - ARCHIVOS
  // ==========================================

  async function fetchArchivos(pacienteId) {
    try {
      const response = await historiaClinicaService.getArchivos(pacienteId)
      
      if (response.success) {
        archivos.value = response.data
      }
      
      return response
    } catch (err) {
      console.error('Error al obtener archivos:', err)
      return { success: false, message: err.message }
    }
  }

  async function uploadArchivo(pacienteId, file, tipo, descripcion) {
    uploadProgress.value = 0

    const formData = new FormData()
    formData.append('archivo', file)
    formData.append('tipo', tipo)
    formData.append('descripcion', descripcion || '')

    try {
      const response = await historiaClinicaService.uploadArchivo(
        pacienteId,
        formData,
        (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      )
      
      if (response.success) {
        archivos.value.unshift(response.data)
      }
      
      uploadProgress.value = 0
      return response
    } catch (err) {
      uploadProgress.value = 0
      console.error('Error al subir archivo:', err)
      return { success: false, message: err.message }
    }
  }

  async function deleteArchivo(pacienteId, archivoId) {
    try {
      const response = await historiaClinicaService.deleteArchivo(pacienteId, archivoId)
      
      if (response.success) {
        archivos.value = archivos.value.filter(a => a.id !== archivoId)
      }
      
      return response
    } catch (err) {
      console.error('Error al eliminar archivo:', err)
      return { success: false, message: err.message }
    }
  }

  // ==========================================
  // ACTIONS - PLAN DE TRATAMIENTO
  // ==========================================

  async function fetchPlanTratamiento(pacienteId) {
    try {
      const response = await historiaClinicaService.getPlanTratamiento(pacienteId)
      
      if (response.success) {
        planTratamiento.value = response.data
      }
      
      return response
    } catch (err) {
      console.error('Error al obtener plan:', err)
      return { success: false, message: err.message }
    }
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  function setPacienteActual(paciente) {
    pacienteActual.value = paciente
  }

  function resetStore() {
    pacienteActual.value = null
    fichaMedica.value = null
    odontograma.value = []
    tratamientosRealizados.value = []
    diagnosticos.value = []
    archivos.value = []
    planTratamiento.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    pacienteActual,
    loading,
    error,
    fichaMedica,
    odontograma,
    estadosDiente,
    tratamientosRealizados,
    totalTratamientos,
    currentPage,
    diagnosticos,
    archivos,
    uploadProgress,
    planTratamiento,

    // Getters
    dientesSuperiores,
    dientesInferiores,
    dientesConProblemas,
    tratamientosRecientes,
    costoTotalTratamientos,
    diagnosticosActivos,
    archivosPorTipo,

    // Actions
    fetchFichaMedica,
    saveFichaMedica,
    fetchOdontograma,
    updateDiente,
    saveOdontograma,
    generarOdontogramaVacio,
    fetchTratamientosRealizados,
    registrarTratamiento,
    updateTratamiento,
    deleteTratamiento,
    fetchDiagnosticos,
    createDiagnostico,
    fetchArchivos,
    uploadArchivo,
    deleteArchivo,
    fetchPlanTratamiento,
    setPacienteActual,
    resetStore
  }
})