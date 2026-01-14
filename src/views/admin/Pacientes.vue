<!-- views/admin/Pacientes.vue -->
<template>
  <div>
    
    <!-- Header con búsqueda y botón nuevo -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <!-- Búsqueda -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Buscar por nombre, RUT, email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            
            <!-- Clear button -->
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex items-center gap-3">
          <!-- Filtros -->
          <button
            @click="toggleFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <i class="fas fa-filter mr-2"></i>
            Filtros
            <span v-if="hasActiveFilters" class="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
          </button>

          <!-- Nuevo Paciente -->
          <button
            @click="openNewModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
          >
            <i class="fas fa-plus"></i>
            <span>Nuevo Paciente</span>
          </button>
        </div>

      </div>

      <!-- Filtros (expandible) -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showFilters" class="mt-6 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                v-model="filters.estado"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <!-- Género -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select
                v-model="filters.genero"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <!-- Fecha Desde -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Registrado Desde</label>
              <input
                v-model="filters.fechaDesde"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <!-- Fecha Hasta -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Registrado Hasta</label>
              <input
                v-model="filters.fechaHasta"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

          </div>

          <!-- Botones de filtros -->
          <div class="flex items-center gap-3 mt-4">
            <button
              @click="applyFilters"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
            >
              Aplicar Filtros
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

    </div>

    <!-- Lista de Pacientes -->
    <PacientesList
      @new="openNewModal"
      @agendar-cita="handleAgendarCita"
      @perfil="openPerfilModal"
      @historial="openHistorialModal"
    />

    <!-- Modal Formulario Nuevo Paciente -->
    <PacienteFormModal
      v-model="showFormModal"
      :paciente="null"
      @saved="handleSaved"
    />

    <!-- Modal Editar Paciente -->
    <PacienteFormModal
      v-model="showEditModal"
      :paciente="selectedPaciente"
      @saved="handleSaved"
    />

    <!-- Modal Perfil del Paciente -->
    <PacienteViewModal
      v-model="showPerfilModal"
      :paciente="selectedPaciente"
      @edit="openEditModal"
    />
<!-- Modal Ver Paciente -->
    <PacienteViewModal
      v-model="showPacienteViewModal"
      :paciente="selectedPaciente"
      @edit="handleEditPaciente"
      @agendar="handleAgendarCita"
    />

    <!-- Modal Crear/Editar Cita -->
    <CitaFormModal
      v-model="showCitaFormModal"
      :cita="editingCita"
      :initialData="citaFormData"
      @created="handleCitaCreated"
      @updated="handleCitaUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePacientesStore } from '@/stores/pacientes'
import { useNotification } from '@/composables/useNotification'
import PacientesList from '@/components/pacientes/PacientesList.vue'
import PacienteFormModal from '@/components/pacientes/PacienteFormModal.vue'
import PacienteViewModal from '@/components/pacientes/PacienteViewModal.vue'
import CitaFormModal from '@/components/citas/CitaFormModal.vue'

const pacientesStore = usePacientesStore()
const notify = useNotification()

// State
const searchQuery = ref('')
const showFilters = ref(false)
const showFormModal = ref(false)
const showPerfilModal = ref(false)
const showEditModal = ref(false)
// Estados para modales de paciente
const showPacienteViewModal = ref(false)
const selectedPaciente = ref(null)

// Estados para modal de cita
const showCitaFormModal = ref(false)
const citaFormData = ref({})
const editingCita = ref(null)

const filters = ref({
  estado: '',
  genero: '',
  fechaDesde: '',
  fechaHasta: ''
})

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.estado || 
         filters.value.genero || 
         filters.value.fechaDesde || 
         filters.value.fechaHasta
})

// Methods
function toggleFilters() {
  showFilters.value = !showFilters.value
}

let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pacientesStore.searchPacientes(searchQuery.value)
  }, 500)
}

function clearSearch() {
  searchQuery.value = ''
  pacientesStore.searchPacientes('')
}

function applyFilters() {
  pacientesStore.applyFilters(filters.value)
  notify.info('Filtros aplicados correctamente')
}

function clearFilters() {
  filters.value = {
    estado: '',
    genero: '',
    fechaDesde: '',
    fechaHasta: ''
  }
  pacientesStore.clearFilters()
  notify.info('Filtros limpiados')
}

function openNewModal() {
  selectedPaciente.value = null
  showFormModal.value = true
}

function openPerfilModal(paciente) {
  selectedPaciente.value = paciente
  showPerfilModal.value = true
}

function openEditModal(paciente) {
  selectedPaciente.value = { ...paciente }
  showPerfilModal.value = false
  showEditModal.value = true
}

function handleAgendarCita(paciente) {
  console.log('📅 Agendar cita para:', paciente.nombre, paciente.apellido)
  
  // Cerrar modal de paciente
  showPacienteViewModal.value = false
  
  // Pre-llenar formulario
  citaFormData.value = {
    paciente_id: paciente.id,
    fecha: '',
    hora: '',
    profesional_id: null,
    tratamiento_id: null,
    duracion: 30,
    motivo: '',
    notas: ''
  }
  
  editingCita.value = null
  showCitaFormModal.value = true
}

// Callbacks
function handleCitaCreated(cita) {
  notify.success(
    `Cita agendada para ${selectedPaciente.value?.nombre}`,
    'Cita creada'
  )
  showCitaFormModal.value = false
}
function handleCitaUpdated(cita) {
  notify.success('La cita ha sido actualizada', 'Cita actualizada')
  showCitaFormModal.value = false
}

function handleEditPaciente(paciente) {
  // Tu lógica existente para editar paciente
  console.log('Editar paciente:', paciente)
}
function openHistorialModal(paciente) {
  // TODO: Implementar cuando tengas el módulo de Historial Clínico
  selectedPaciente.value = paciente
  notify.info(
    `Esta funcionalidad estará disponible cuando implementemos el módulo de Historial Clínico.`,
    `Historial Clínico de: ${paciente.nombre} ${paciente.apellido}`
  )
  // Luego será:
  // router.push({ name: 'historial-clinico', params: { pacienteId: paciente.id } })
}

function handleSaved() {
  // Cerrar todos los modales
  showFormModal.value = false
  showEditModal.value = false
  showPerfilModal.value = false
  
  // Notificación de éxito
  notify.success('Los datos del paciente se han guardado correctamente', 'Paciente guardado')
}

// Lifecycle
onMounted(() => {
  pacientesStore.fetchPacientes()
})
</script>