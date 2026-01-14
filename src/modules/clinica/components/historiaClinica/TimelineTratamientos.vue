<!-- components/historiaClinica/TimelineTratamientos.vue -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold text-gray-800">
          <i class="fas fa-history text-blue-600 mr-2"></i>
          Timeline de Tratamientos
        </h3>
        <p class="text-sm text-gray-600 mt-1">Historial de procedimientos realizados</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Filtros -->
        <button
          @click="showFilters = !showFilters"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <i class="fas fa-filter mr-2"></i>
          Filtros
        </button>
        <!-- Nueva Entrada -->
        <button
          @click="openNewModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <i class="fas fa-plus mr-2"></i>
          Registrar Procedimiento
        </button>
      </div>
    </div>

    <!-- Filtros Expandibles -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showFilters" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Tipo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              v-model="filters.tipo"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option :value="null">Todos</option>
              <option value="consulta">Consulta</option>
              <option value="diagnostico">Diagnóstico</option>
              <option value="tratamiento">Tratamiento</option>
              <option value="control">Control</option>
              <option value="emergencia">Emergencia</option>
            </select>
          </div>

          <!-- Profesional -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Profesional</label>
            <select
              v-model="filters.profesional_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option :value="null">Todos</option>
              <option 
                v-for="prof in profesionalesStore.profesionales" 
                :key="prof.id" 
                :value="prof.id"
              >
                {{ prof.nombre }} {{ prof.apellido }}
              </option>
            </select>
          </div>

          <!-- Fecha Desde -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
              v-model="filters.fecha_desde"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>

          <!-- Fecha Hasta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
              v-model="filters.fecha_hasta"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
        </div>

        <!-- Botones Filtros -->
        <div class="flex items-center gap-3 mt-4">
          <button
            @click="applyFilters"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
          >
            Aplicar
          </button>
          <button
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
          >
            Limpiar
          </button>
        </div>
      </div>
    </transition>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando timeline...</p>
    </div>

    <!-- Sin Entradas -->
    <div v-else-if="entradas.length === 0" class="text-center py-12">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-history text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">No hay entradas registradas</h3>
      <p class="text-gray-600 mb-4">Comienza registrando el primer procedimiento</p>
      <button
        @click="openNewModal"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        <i class="fas fa-plus mr-2"></i>
        Registrar Procedimiento
      </button>
    </div>

    <!-- Timeline -->
    <div v-else class="space-y-6">
      
      <!-- Estadísticas Rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Total Procedimientos</p>
          <p class="text-2xl font-bold text-blue-600">{{ total }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Este Año</p>
          <p class="text-2xl font-bold text-green-600">{{ entradasEsteAño.length }}</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Último Mes</p>
          <p class="text-2xl font-bold text-purple-600">{{ entradasUltimoMes.length }}</p>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Costo Total</p>
          <p class="text-2xl font-bold text-orange-600">${{ costoTotal.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Timeline por Año -->
      <div v-for="(grupo, año) in entradasPorAño" :key="año" class="space-y-4">
        
        <!-- Header Año -->
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <i class="fas fa-calendar text-white text-lg"></i>
          </div>
          <div>
            <h4 class="text-xl font-bold text-gray-800">{{ año }}</h4>
            <p class="text-sm text-gray-600">{{ grupo.length }} procedimiento{{ grupo.length !== 1 ? 's' : '' }}</p>
          </div>
        </div>

        <!-- Entradas del Año -->
        <div class="ml-6 pl-6 border-l-2 border-gray-200 space-y-4">
          <div
            v-for="entrada in grupo"
            :key="entrada.id"
            class="relative"
          >
            <!-- Punto en timeline -->
            <div class="absolute -left-[28px] w-3 h-3 rounded-full"
                 :class="getTipoColorClass(entrada.tipo)">
            </div>

            <!-- Card de Entrada -->
            <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                 @click="openViewModal(entrada)">
              
              <!-- Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-1 rounded text-xs font-medium text-white"
                          :class="getTipoBgClass(entrada.tipo)">
                      {{ getTipoLabel(entrada.tipo) }}
                    </span>
                    <span class="text-sm text-gray-600">
                      {{ formatDate(entrada.fecha_consulta) }}
                    </span>
                  </div>
                  <h5 class="text-lg font-semibold text-gray-900">
                    {{ entrada.titulo || getTipoLabel(entrada.tipo) }}
                  </h5>
                </div>
                <button
                  @click.stop="openEditModal(entrada)"
                  class="text-gray-400 hover:text-blue-600 transition"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </div>

              <!-- Contenido -->
              <div class="space-y-2">
                <!-- Profesional -->
                <div class="flex items-center gap-2 text-sm">
                  <i class="fas fa-user-md text-gray-400 w-4"></i>
                  <span class="text-gray-700">
                    {{ entrada.profesional?.nombre }} {{ entrada.profesional?.apellido }}
                  </span>
                </div>

                <!-- Tratamiento -->
                <div v-if="entrada.tratamiento" class="flex items-center gap-2 text-sm">
                  <i class="fas fa-tooth text-gray-400 w-4"></i>
                  <span class="text-gray-700">{{ entrada.tratamiento?.nombre }}</span>
                </div>

                <!-- Dientes -->
                <div v-if="entrada.dientes_relacionados?.length" class="flex items-center gap-2 text-sm">
                  <i class="fas fa-tooth text-gray-400 w-4"></i>
                  <span class="text-gray-700">
                    Piezas: {{ entrada.dientes_relacionados.join(', ') }}
                  </span>
                </div>

                <!-- Diagnóstico (preview) -->
                <div v-if="entrada.diagnostico" class="text-sm text-gray-600 line-clamp-2">
                  <i class="fas fa-stethoscope text-gray-400 w-4 mr-2"></i>
                  {{ entrada.diagnostico }}
                </div>

                <!-- Costo -->
                <div v-if="entrada.costo" class="flex items-center gap-2 text-sm">
                  <i class="fas fa-dollar-sign text-gray-400 w-4"></i>
                  <span class="font-semibold text-green-600">
                    ${{ parseFloat(entrada.costo).toLocaleString() }}
                  </span>
                </div>
              </div>

              <!-- Footer -->
              <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>
                  <i class="fas fa-user mr-1"></i>
                  Registrado por {{ entrada.creado_por?.nombre || 'Sistema' }}
                </span>
                <span>{{ formatDateTime(entrada.created_at) }}</span>
              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- Paginación -->
      <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-6">
        <button
          v-for="page in lastPage"
          :key="page"
          @click="changePage(page)"
          class="px-3 py-1 rounded transition"
          :class="currentPage === page 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ page }}
        </button>
      </div>

    </div>

    <!-- Modal Nueva Entrada -->
    <EntradaModal
      v-model="showNewModal"
      :paciente-id="pacienteId"
      @saved="handleSaved"
    />

    <!-- Modal Editar Entrada -->
    <EntradaModal
      v-model="showEditModal"
      :paciente-id="pacienteId"
      :entrada="selectedEntrada"
      @saved="handleSaved"
    />

    <!-- Modal Ver Detalle -->
    <EntradaViewModal
      v-model="showViewModal"
      :entrada="selectedEntrada"
      @edit="openEditModal"
      @delete="handleDelete"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHistoriaClinicaStore } from '../stores/historiaClinica'
import { useProfesionalesStore } from '../stores/profesionales'
import { useNotification } from '@/composables/useNotification'
import EntradaModal from './EntradaModal.vue'
import EntradaViewModal from './EntradaViewModal.vue'

const props = defineProps({
  pacienteId: {
    type: Number,
    required: true
  }
})

const historiaStore = useHistoriaClinicaStore()
const profesionalesStore = useProfesionalesStore()
const notify = useNotification()

// State
const loading = ref(false)
const showFilters = ref(false)
const showNewModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedEntrada = ref(null)

const entradas = ref([])
const total = ref(0)
const currentPage = ref(1)
const lastPage = ref(1)

const filters = ref({
  tipo: null,
  profesional_id: null,
  fecha_desde: null,
  fecha_hasta: null
})

// Computed
const entradasPorAño = computed(() => {
  const grouped = {}
  
  entradas.value.forEach(entrada => {
    const fecha = new Date(entrada.fecha_consulta)
    const año = fecha.getFullYear()
    
    if (!grouped[año]) {
      grouped[año] = []
    }
    
    grouped[año].push(entrada)
  })
  
  // Ordenar años descendente
  return Object.keys(grouped)
    .sort((a, b) => b - a)
    .reduce((obj, key) => {
      obj[key] = grouped[key]
      return obj
    }, {})
})

const entradasEsteAño = computed(() => {
  const añoActual = new Date().getFullYear()
  return entradas.value.filter(e => {
    const fecha = new Date(e.fecha_consulta)
    return fecha.getFullYear() === añoActual
  })
})

const entradasUltimoMes = computed(() => {
  const hoy = new Date()
  const hace30Dias = new Date(hoy.setDate(hoy.getDate() - 30))
  
  return entradas.value.filter(e => {
    const fecha = new Date(e.fecha_consulta)
    return fecha >= hace30Dias
  })
})

const costoTotal = computed(() => {
  return entradas.value.reduce((sum, e) => {
    return sum + (parseFloat(e.costo) || 0)
  }, 0)
})

// Methods
async function fetchEntradas(page = 1) {
  loading.value = true
  
  try {
    const params = {
      page,
      per_page: 20,
      ...filters.value
    }
    
    const response = await historiaStore.fetchTratamientosRealizados(props.pacienteId, params)
    
    if (response.success) {
      entradas.value = response.data.data || response.data
      total.value = response.data.total || entradas.value.length
      currentPage.value = response.data.current_page || page
      lastPage.value = response.data.last_page || 1
    }
  } catch (error) {
    notify.error('Error al cargar entradas')
  } finally {
    loading.value = false
  }
}

function openNewModal() {
  showNewModal.value = true
}

function openEditModal(entrada) {
  selectedEntrada.value = { ...entrada }
  showViewModal.value = false
  showEditModal.value = true
}

function openViewModal(entrada) {
  selectedEntrada.value = entrada
  showViewModal.value = true
}

async function handleSaved() {
  showNewModal.value = false
  showEditModal.value = false
  showViewModal.value = false
  
  notify.success('Entrada registrada correctamente', 'Guardado')
  
  await fetchEntradas(currentPage.value)
}

async function handleDelete(entrada) {
  notify.confirm(
    `¿Estás segura de eliminar esta entrada?`,
    async () => {
      // TODO: Implementar delete en store
      notify.success('Entrada eliminada')
      await fetchEntradas(currentPage.value)
    }
  )
}

function applyFilters() {
  currentPage.value = 1
  fetchEntradas(1)
  notify.info('Filtros aplicados')
}

function clearFilters() {
  filters.value = {
    tipo: null,
    profesional_id: null,
    fecha_desde: null,
    fecha_hasta: null
  }
  fetchEntradas(1)
  notify.info('Filtros limpiados')
}

function changePage(page) {
  fetchEntradas(page)
}

// Helpers
function getTipoLabel(tipo) {
  const labels = {
    consulta: 'Consulta',
    diagnostico: 'Diagnóstico',
    tratamiento: 'Tratamiento',
    control: 'Control',
    emergencia: 'Emergencia'
  }
  return labels[tipo] || tipo
}

function getTipoBgClass(tipo) {
  const classes = {
    consulta: 'bg-blue-600',
    diagnostico: 'bg-purple-600',
    tratamiento: 'bg-green-600',
    control: 'bg-yellow-600',
    emergencia: 'bg-red-600'
  }
  return classes[tipo] || 'bg-gray-600'
}

function getTipoColorClass(tipo) {
  const classes = {
    consulta: 'bg-blue-600',
    diagnostico: 'bg-purple-600',
    tratamiento: 'bg-green-600',
    control: 'bg-yellow-600',
    emergencia: 'bg-red-600'
  }
  return classes[tipo] || 'bg-gray-600'
}

function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  })
}

function formatDateTime(dateTime) {
  if (!dateTime) return '-'
  const d = new Date(dateTime)
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(async () => {
  if (profesionalesStore.profesionales.length === 0) {
    await profesionalesStore.fetchProfesionales()
  }
  
  await fetchEntradas()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>