<!-- views/admin/HistoriaClinicaView.vue -->
<template>
  <div class="max-w-7xl mx-auto">
    
    <!-- Header con Info del Paciente -->
    <div class="bg-white rounded-lg shadow-md mb-6">
      <!-- Banner Superior -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Avatar -->
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <i class="fas fa-user-circle text-4xl text-blue-600"></i>
            </div>
            <!-- Info -->
            <div class="text-white">
              <h1 class="text-2xl font-bold">Historia Clínica</h1>
              <p class="text-blue-100 text-sm mt-1" v-if="paciente">
                {{ paciente.nombre }} {{ paciente.apellido }}
              </p>
            </div>
          </div>
          <!-- Botón Volver -->
          <router-link
            :to="{ name: 'pacientes' }"
            class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Volver a Pacientes
          </router-link>
        </div>
      </div>

      <!-- Info del Paciente -->
      <div v-if="paciente" class="px-6 py-4 border-b border-gray-200">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-xs text-gray-500 mb-1">Edad</p>
            <p class="text-sm font-medium text-gray-900">{{ calcularEdad(paciente.fecha_nacimiento) }} años</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Email</p>
            <p class="text-sm font-medium text-gray-900">{{ paciente.email || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Teléfono</p>
            <p class="text-sm font-medium text-gray-900">{{ paciente.telefono || '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Última Visita</p>
            <p class="text-sm font-medium text-gray-900">{{ ultimaVisita || 'Sin visitas' }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="px-6">
        <div class="flex items-center gap-2 overflow-x-auto pb-px">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition border-b-2"
            :class="activeTab === tab.id 
              ? 'text-blue-600 border-blue-600' 
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-lg shadow-md p-12 text-center">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando historia clínica...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-white rounded-lg shadow-md p-6">
      <div class="text-center py-8">
        <i class="fas fa-exclamation-triangle text-5xl text-red-500 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Error al Cargar</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="fetchData"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <i class="fas fa-redo mr-2"></i>
          Reintentar
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div v-else>
      
      <!-- Odontograma -->
      <transition name="fade" mode="out-in">
        <Odontograma
          v-if="activeTab === 'odontograma'"
          :paciente-id="pacienteId"
        />
      </transition>

      <!-- Timeline -->
      <transition name="fade" mode="out-in">
        <TimelineTratamientos
          v-if="activeTab === 'timeline'"
          :paciente-id="pacienteId"
        />
      </transition>

      <!-- Ficha Médica -->
      <transition name="fade" mode="out-in">
        <FichaMedica
          v-if="activeTab === 'ficha'"
          :paciente-id="pacienteId"
        />
      </transition>

      <!-- Archivos -->
      <transition name="fade" mode="out-in">
        <ArchivosClinica
          v-if="activeTab === 'archivos'"
          :paciente-id="pacienteId"
        />
      </transition>

    </div>

    <!-- Quick Stats (Footer) -->
    <div v-if="!loading && !error" class="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        <i class="fas fa-chart-line text-blue-600 mr-2"></i>
        Resumen
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-3xl font-bold text-blue-600">{{ stats.totalCitas || 0 }}</p>
          <p class="text-sm text-gray-600 mt-1">Citas Totales</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-3xl font-bold text-green-600">{{ stats.totalTratamientos || 0 }}</p>
          <p class="text-sm text-gray-600 mt-1">Tratamientos</p>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <p class="text-3xl font-bold text-purple-600">{{ stats.totalArchivos || 0 }}</p>
          <p class="text-sm text-gray-600 mt-1">Archivos</p>
        </div>
        <div class="text-center p-4 bg-orange-50 rounded-lg">
          <p class="text-3xl font-bold text-orange-600">${{ stats.gastoTotal || 0 }}</p>
          <p class="text-sm text-gray-600 mt-1">Gasto Total</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePacientesStore } from '../stores/pacientes'
import { useHistoriaClinicaStore } from '../stores/historiaClinica'
import { useNotification } from '@/composables/useNotification'

// Componentes
import Odontograma from '../components/historiaClinica/Odontograma.vue'
import TimelineTratamientos from '../components/historiaClinica/TimelineTratamientos.vue'
import FichaMedica from '../components/historiaClinica/FichaMedica.vue'
import ArchivosClinica from '../components/historiaClinica/ArchivosClinica.vue'

const route = useRoute()
const pacientesStore = usePacientesStore()
const historiaStore = useHistoriaClinicaStore()
const notify = useNotification()

// State
const loading = ref(true)
const error = ref(null)
const activeTab = ref('odontograma')
const paciente = ref(null)
const ultimaVisita = ref(null)

// Tabs
const tabs = [
  {
    id: 'odontograma',
    label: 'Odontograma',
    icon: 'fas fa-tooth'
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: 'fas fa-history'
  },
  {
    id: 'ficha',
    label: 'Ficha Médica',
    icon: 'fas fa-file-medical'
  },
  {
    id: 'archivos',
    label: 'Archivos',
    icon: 'fas fa-folder-open'
  }
]

// Stats
const stats = computed(() => {
  return {
    totalCitas: paciente.value?.total_citas || 0,
    totalTratamientos: historiaStore.tratamientosRealizados.length || 0,
    totalArchivos: historiaStore.archivos.length || 0,
    gastoTotal: calcularGastoTotal()
  }
})

// Computed
const pacienteId = computed(() => {
  return parseInt(route.params.id)
})

// Methods
async function fetchData() {
  loading.value = true
  error.value = null

  try {
    // Obtener datos del paciente
    const response = await pacientesStore.fetchPaciente(pacienteId.value)
    
    if (response.success) {
      paciente.value = response.data
      
      // Calcular última visita
      if (paciente.value.ultima_cita) {
        ultimaVisita.value = formatFecha(paciente.value.ultima_cita)
      }
    } else {
      error.value = 'No se pudo cargar la información del paciente'
    }
  } catch (err) {
    error.value = 'Error al cargar datos: ' + (err.message || 'Error desconocido')
    notify.error('Error al cargar historia clínica')
  } finally {
    loading.value = false
  }
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '-'
  
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  
  return edad
}

function formatFecha(fecha) {
  if (!fecha) return null
  
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function calcularGastoTotal() {
  return historiaStore.tratamientosRealizados.reduce((sum, t) => {
    return sum + (parseFloat(t.costo) || 0)
  }, 0)
}

// Lifecycle
onMounted(async () => {
  // Verificar tab inicial desde query params
  if (route.query.tab) {
    const tab = tabs.find(t => t.id === route.query.tab)
    if (tab) {
      activeTab.value = tab.id
    }
  }
  
  await fetchData()
})
</script>

<style scoped>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar para tabs */
::-webkit-scrollbar {
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>