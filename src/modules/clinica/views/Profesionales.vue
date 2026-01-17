<!-- views/Profesionales-View.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">
          <i class="fas fa-user-md text-blue-600 mr-3"></i>
          Gestión de Profesionales
        </h2>
        <p class="text-gray-600 mt-1">Administra los doctores y especialistas de tu clínica</p>
      </div>
      <button
        @click="handleNuevo"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
      >
        <i class="fas fa-plus"></i>
        Nuevo Profesional
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Profesionales</p>
            <p class="text-3xl font-bold text-gray-900">{{ profesionalesStore.totalProfesionales }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-users text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Activos</p>
            <p class="text-3xl font-bold text-green-600">{{ profesionalesStore.totalActivos }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">En Licencia</p>
            <p class="text-3xl font-bold text-orange-600">{{ profesionalesStore.totalEnLicencia }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-umbrella-beach text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Inactivos</p>
            <p class="text-3xl font-bold text-gray-600">{{ profesionalesStore.totalInactivos }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-times-circle text-gray-600 text-xl"></i>
          </div>
        </div>
      </div>

    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-xl shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <!-- Búsqueda -->
        <div class="md:col-span-2">
          <div class="relative">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="filters.buscar"
              type="text"
              placeholder="Buscar por nombre, especialidad, email..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="handleSearch"
            >
          </div>
        </div>

        <!-- Filtro Estado -->
        <div>
          <select
            v-model="filters.estado"
            @change="handleFilterChange"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="licencia">En Licencia</option>
          </select>
        </div>

      </div>
    </div>

    <!-- Loading State -->
    <div v-if="profesionalesStore.loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando profesionales...</p>
    </div>

    <!-- Grid de Profesionales -->
    <div v-else-if="filteredProfesionales.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProfesionalCard
        v-for="profesional in filteredProfesionales"
        :key="profesional.id"
        :profesional="profesional"
        @click="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl shadow-md p-12 text-center">
      <i class="fas fa-user-md text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay profesionales</h3>
      <p class="text-gray-600 mb-6">
        {{ filters.buscar || filters.estado 
          ? 'No se encontraron profesionales con los filtros aplicados' 
          : 'Comienza agregando tu primer profesional' 
        }}
      </p>
      <button
        v-if="!filters.buscar && !filters.estado"
        @click="handleNuevo"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        <i class="fas fa-plus mr-2"></i>
        Agregar Profesional
      </button>
    </div>

    <!-- Modal Ver Detalles -->
    <ProfesionalViewModal
      v-model="showViewModal"
      :profesional="selectedProfesional"
      @edit="handleEditFromView"
      @estado-changed="handleEstadoChanged"
    />

    <!-- Modal Crear/Editar -->
    <ProfesionalFormModal
      v-model="showFormModal"
      :profesional="editingProfesional"
      @created="handleCreated"
      @updated="handleUpdated"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useNotification } from '@shared/composables/useNotification'
import ProfesionalCard from '@clinica/components/profesionales/ProfesionalCard.vue'
import ProfesionalViewModal from '@clinica/components/profesionales/ProfesionalViewModal.vue'
import ProfesionalFormModal from '@clinica/components/profesionales/ProfesionalFormModal.vue'

const profesionalesStore = useProfesionalesStore()
const notify = useNotification()

// State
const showViewModal = ref(false)
const showFormModal = ref(false)
const selectedProfesional = ref(null)
const editingProfesional = ref(null)

const filters = ref({
  buscar: '',
  estado: ''
})

// Computed
const filteredProfesionales = computed(() => {
  let result = [...profesionalesStore.profesionales]

  // Filtro por búsqueda
  if (filters.value.buscar) {
    const search = filters.value.buscar.toLowerCase()
    result = result.filter(p => 
      p.nombre?.toLowerCase().includes(search) ||
      p.apellido?.toLowerCase().includes(search) ||
      p.especialidad?.toLowerCase().includes(search) ||
      p.email?.toLowerCase().includes(search)
    )
  }

  // Filtro por estado
  if (filters.value.estado) {
    result = result.filter(p => p.estado === filters.value.estado)
  }

  return result
})

// Methods
function handleNuevo() {
  editingProfesional.value = null
  showFormModal.value = true
}

function handleView(profesional) {
  selectedProfesional.value = profesional
  showViewModal.value = true
}

function handleEdit(profesional) {
  editingProfesional.value = profesional
  showFormModal.value = true
}

function handleEditFromView(profesional) {
  showViewModal.value = false
  setTimeout(() => {
    editingProfesional.value = profesional
    showFormModal.value = true
  }, 300)
}

function handleDelete(profesional) {
  notify.confirm(
    `¿Estás seguro que deseas eliminar al Dr. ${profesional.nombre} ${profesional.apellido}?`,
    async () => {
      const result = await profesionalesStore.deleteProfesional(profesional.id)
      
      if (result.success) {
        notify.success('Profesional eliminado correctamente', 'Eliminado')
      } else {
        notify.error(result.message || 'Error al eliminar profesional')
      }
    }
  )
}

async function handleEstadoChanged({ profesional, nuevoEstado }) {
  const result = await profesionalesStore.cambiarEstado(profesional.id, nuevoEstado)
  
  if (result.success) {
    notify.success(`Estado cambiado a: ${nuevoEstado}`, 'Estado actualizado')
    
    // Actualizar profesional seleccionado
    selectedProfesional.value = { ...selectedProfesional.value, estado: nuevoEstado }
  } else {
    notify.error(result.message || 'Error al cambiar el estado')
  }
}

function handleCreated(profesional) {
  notify.success('Profesional creado correctamente', 'Creado')
  // El store ya actualiza la lista
}

function handleUpdated(profesional) {
  notify.success('Profesional actualizado correctamente', 'Actualizado')
  
  // Si está viendo el profesional actualizado, actualizar datos
  if (selectedProfesional.value?.id === profesional.id) {
    selectedProfesional.value = profesional
  }
}

function handleSearch() {
  // Debounce implementado en el @input del template
  // La búsqueda se hace en tiempo real vía computed
}

function handleFilterChange() {
  // Los filtros se aplican automáticamente vía computed
}

// Lifecycle
onMounted(async () => {
  await profesionalesStore.fetchProfesionales()
})
</script>