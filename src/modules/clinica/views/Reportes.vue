<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-chart-bar text-blue-600"></i>
          Reportes y Estadísticas
        </h1>
        <p class="text-gray-600 mt-1">Análisis completo del desempeño de la clínica</p>
      </div>
      
      <!-- Filtros -->
      <FiltrosPeriodo 
        v-model="filtros"
        :profesionales="profesionales"
        @change="handleFiltrosChange" 
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando reportes...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <i class="fas fa-exclamation-circle text-3xl text-red-600 mb-3"></i>
      <p class="text-red-800 font-medium">{{ error }}</p>
      <button 
        @click="recargarReportes"
        class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
      >
        <i class="fas fa-redo mr-2"></i>
        Reintentar
      </button>
    </div>

    <!-- Contenido -->
    <div v-else>

      <!-- KPIs Principales -->
      <KPIsGenerales :data="resumen" />

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md mt-6">
        
        <!-- Tab Headers -->
        <div class="border-b border-gray-200">
          <div class="flex overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition whitespace-nowrap"
              :class="activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'"
            >
              <i :class="tab.icon"></i>
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          
          <!-- Tab: Citas y Pacientes -->
          <div v-show="activeTab === 'citas'">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoLineas
                title="Pacientes Nuevos"
                :data="pacientesNuevos"
                color="#8B5CF6"
              />
              <GraficoPie
                title="Distribución de Estados de Citas"
                :data="distribucionEstados"
              />
            </div>
          </div>

          <!-- Tab: Profesionales -->
          <div v-show="activeTab === 'profesionales'">
            <TablaRendimiento :data="rendimientoProfesionales" />
          </div>

          <!-- Tab: Horarios -->
          <div v-show="activeTab === 'horarios'">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GraficoBarras
                title="Horarios Más Solicitados"
                :data="horariosPopulares"
                color="#10B981"
              />
              <GraficoBarras
                title="Días Más Solicitados"
                :data="diasPopulares"
                color="#F59E0B"
              />
            </div>
          </div>

        </div>
      </div>

      <!-- Acciones adicionales -->
      <div class="mt-6 flex justify-end gap-3">
        <button
          @click="exportarExcel"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition"
        >
          <i class="fas fa-file-excel"></i>
          <span>Exportar Excel</span>
        </button>
        
        <button
          @click="imprimirReporte"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition"
        >
          <i class="fas fa-print"></i>
          <span>Imprimir</span>
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReportesStore } from '@clinica/stores/reportes'
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useToast } from 'vue-toastification'

// Components
import KPIsGenerales from '@clinica/components/reportes/KPIsGenerales.vue'
import GraficoLineas from '@clinica/components/reportes/GraficoLineas.vue'
import GraficoPie from '@clinica/components/reportes/GraficoPie.vue'
import GraficoBarras from '@clinica/components/reportes/GraficoBarras.vue'
import TablaRendimiento from '@clinica/components/reportes/TablaRendimiento.vue'
import FiltrosPeriodo from '@clinica/components/reportes/FiltrosPeriodo.vue'

// Stores
const reportesStore = useReportesStore()
const profesionalesStore = useProfesionalesStore()
const toast = useToast()

// State
const activeTab = ref('citas')
const filtros = ref({
  periodo: 'mes',
  fecha_inicio: null,
  fecha_fin: null,
  profesional_id: null
})

// Tabs
const tabs = [
  { 
    id: 'citas', 
    label: 'Citas y Pacientes', 
    icon: 'fas fa-calendar-check' 
  },
  { 
    id: 'profesionales', 
    label: 'Profesionales', 
    icon: 'fas fa-user-md' 
  },
  { 
    id: 'horarios', 
    label: 'Horarios y Días', 
    icon: 'fas fa-clock' 
  }
]

// Computed
const loading = computed(() => reportesStore.loading)
const error = computed(() => reportesStore.error)
const resumen = computed(() => reportesStore.resumen)
const pacientesNuevos = computed(() => reportesStore.pacientesNuevos)
const distribucionEstados = computed(() => reportesStore.distribucionEstados)
const horariosPopulares = computed(() => reportesStore.horariosPopulares)
const diasPopulares = computed(() => reportesStore.diasPopulares)
const rendimientoProfesionales = computed(() => reportesStore.rendimientoProfesionales)
const profesionales = computed(() => profesionalesStore.profesionales)

// Methods
function handleFiltrosChange(nuevosFiltros) {
  filtros.value = nuevosFiltros
  reportesStore.actualizarFiltros(nuevosFiltros)
}

async function recargarReportes() {
  try {
    await reportesStore.fetchTodosLosReportes()
    toast.success('Reportes actualizados correctamente')
  } catch (err) {
    toast.error('Error al recargar reportes')
  }
}

function exportarExcel() {
  toast.info('Funcionalidad de exportar en desarrollo')
  // TODO: Implementar exportación a Excel
}

function imprimirReporte() {
  window.print()
}

// Lifecycle
onMounted(async () => {
  try {
    // Cargar profesionales para el filtro
    await profesionalesStore.fetchProfesionales()
    
    // Cargar todos los reportes
    await reportesStore.fetchTodosLosReportes()
  } catch (err) {
    console.error('Error al cargar reportes:', err)
    toast.error('Error al cargar los reportes iniciales')
  }
})
</script>

<style scoped>
/* Estilos para impresión */
@media print {
  .no-print {
    display: none !important;
  }
}
</style>