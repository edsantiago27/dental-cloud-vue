<!-- views/admin/Tratamientos.vue -->
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
              placeholder="Buscar por código, nombre..."
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

          <!-- Nuevo Tratamiento -->
          <button
            @click="openNewModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
          >
            <i class="fas fa-plus"></i>
            <span>Nuevo Tratamiento</span>
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Categoría -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                v-model="filters.categoria"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                <option 
                  v-for="cat in tratamientosStore.categorias" 
                  :key="cat.value" 
                  :value="cat.value"
                >
                  {{ cat.label }}
                </option>
              </select>
            </div>

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

    <!-- Lista de Tratamientos -->
    <TratamientosList
      @new="openNewModal"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <!-- Modal Formulario Nuevo Tratamiento -->
    <TratamientoFormModal
      v-model="showFormModal"
      :tratamiento="null"
      @saved="handleSaved"
    />

    <!-- Modal Editar Tratamiento -->
    <TratamientoFormModal
      v-model="showEditModal"
      :tratamiento="selectedTratamiento"
      @saved="handleSaved"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTratamientosStore } from '../stores/tratamientos'
import { useNotification } from '@/composables/useNotification'
import TratamientosList from '../components/tratamientos/TratamientosList.vue'
import TratamientoFormModal from '../components/tratamientos/TratamientoFormModal.vue'

const tratamientosStore = useTratamientosStore()
const notify = useNotification()

// State
const searchQuery = ref('')
const showFilters = ref(false)
const showFormModal = ref(false)
const showEditModal = ref(false)
const selectedTratamiento = ref(null)

const filters = ref({
  categoria: '',
  estado: '' // Mostrar todos por defecto
})

// Computed
const hasActiveFilters = computed(() => {
  return filters.value.categoria || filters.value.estado
})

// Methods
function toggleFilters() {
  showFilters.value = !showFilters.value
}

let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    tratamientosStore.searchTratamientos(searchQuery.value)
  }, 500)
}

function clearSearch() {
  searchQuery.value = ''
  tratamientosStore.searchTratamientos('')
}

function applyFilters() {
  tratamientosStore.applyFilters(filters.value)
  notify.info('Filtros aplicados correctamente')
}

function clearFilters() {
  filters.value = {
    categoria: '',
    estado: '' // Mostrar todos
  }
  tratamientosStore.clearFilters()
  notify.info('Filtros limpiados')
}

function openNewModal() {
  selectedTratamiento.value = null
  showFormModal.value = true
}

function openEditModal(tratamiento) {
  selectedTratamiento.value = { ...tratamiento }
  showEditModal.value = true
}

function confirmDelete(tratamiento) {
  notify.confirm(
    `¿Estás seguro que deseas eliminar el tratamiento "${tratamiento.nombre}"?`,
    async () => {
      const result = await tratamientosStore.deleteTratamiento(tratamiento.id)
      
      if (result.success) {
        notify.success('El tratamiento ha sido eliminado correctamente', 'Tratamiento eliminado')
      } else {
        notify.error(result.message || 'Error al eliminar el tratamiento')
      }
    }
  )
}

function handleSaved() {
  // Cerrar todos los modales
  showFormModal.value = false
  showEditModal.value = false
  
  // Notificación de éxito
  notify.success('Los datos del tratamiento se han guardado correctamente', 'Tratamiento guardado')
}

// Lifecycle
onMounted(() => {
  tratamientosStore.fetchTratamientos()
})
</script>