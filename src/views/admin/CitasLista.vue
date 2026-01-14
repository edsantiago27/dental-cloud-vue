<!-- views/admin/CitasLista.vue -->
<template>
  <div>
    
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Lista de Citas</h1>
          <p class="text-gray-600 mt-1">Vista de lista de todas las citas</p>
        </div>

        <!-- Botones -->
        <div class="flex items-center gap-3">
          <!-- Link a Calendario -->
          <router-link
            to="/calendario"
            class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
          >
            <i class="fas fa-calendar-alt"></i>
            <span>Ver Calendario</span>
          </router-link>

          <!-- Filtros -->
          <button
            @click="toggleFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <i class="fas fa-filter mr-2"></i>
            Filtros
            <span v-if="hasActiveFilters" class="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
          </button>

          <!-- Nueva Cita -->
          <button
            @click="openNewModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
          >
            <i class="fas fa-plus"></i>
            <span>Nueva Cita</span>
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

            <!-- Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                v-model="filters.estado"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option :value="null">Todos</option>
                <option 
                  v-for="estado in citasStore.estados" 
                  :key="estado.value" 
                  :value="estado.value"
                >
                  {{ estado.label }}
                </option>
              </select>
            </div>

            <!-- Fecha Inicio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
              <input
                v-model="filters.fecha_inicio"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <!-- Fecha Fin -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
              <input
                v-model="filters.fecha_fin"
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

    <!-- Lista Simple -->
    <CitasCalendarSimple @event-click="handleEventClick" />

    <!-- Modal Nueva Cita -->
    <CitaFormModal
      v-model="showFormModal"
      :cita="null"
      @saved="handleSaved"
    />

    <!-- Modal Editar Cita -->
    <CitaFormModal
      v-model="showEditModal"
      :cita="selectedCita"
      @saved="handleSaved"
    />

    <!-- Modal Ver Detalle -->
    <CitaViewModal
      v-model="showViewModal"
      :cita="selectedCita"
      @edit="openEditModal"
      @estado-changed="handleEstadoChanged"
      @cancelar="handleCancelar"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCitasStore } from '@/stores/citas'
import { useProfesionalesStore } from '@/stores/profesionales'
import { useNotification } from '@/composables/useNotification'
import CitasCalendarSimple from '@/components/citas/CitasCalendarSimple.vue'
import CitaFormModal from '@/components/citas/CitaFormModal.vue'
import CitaViewModal from '@/components/citas/CitaViewModal.vue'

const citasStore = useCitasStore()
const profesionalesStore = useProfesionalesStore()
const notify = useNotification()

// Refs
const showFilters = ref(false)
const showFormModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedCita = ref(null)

const filters = ref({
  profesional_id: null,
  estado: null,
  fecha_inicio: null,
  fecha_fin: null
})

// Computed
const hasActiveFilters = computed(() => {
  return !!(filters.value.profesional_id || 
         filters.value.estado || 
         filters.value.fecha_inicio || 
         filters.value.fecha_fin)
})

// Methods
function toggleFilters() {
  showFilters.value = !showFilters.value
}

function applyFilters() {
  citasStore.applyFilters(filters.value)
  notify.info('Filtros aplicados correctamente')
}

function clearFilters() {
  filters.value = {
    profesional_id: null,
    estado: null,
    fecha_inicio: null,
    fecha_fin: null
  }
  citasStore.clearFilters()
  notify.info('Filtros limpiados')
}

function openNewModal() {
  showFormModal.value = true
}

function openEditModal(cita) {
  selectedCita.value = { ...cita }
  showViewModal.value = false
  showEditModal.value = true
}

function handleEventClick(cita) {
  selectedCita.value = cita
  showViewModal.value = true
}

function handleSaved() {
  showFormModal.value = false
  showEditModal.value = false
  showViewModal.value = false
  
  notify.success('La cita ha sido guardada correctamente', 'Cita guardada')
}

async function handleEstadoChanged({ cita, nuevoEstado }) {
  const result = await citasStore.updateEstado(cita.id, nuevoEstado)
  
  if (result.success) {
    notify.success(`Estado cambiado a: ${nuevoEstado}`, 'Estado actualizado')
    selectedCita.value = { ...selectedCita.value, estado: nuevoEstado }
  } else {
    notify.error(result.message || 'Error al cambiar el estado')
  }
}

function handleCancelar(cita) {
  notify.confirm(
    `¿Estás seguro que deseas cancelar esta cita?`,
    async () => {
      const result = await citasStore.cancelarCita(cita.id)
      
      if (result.success) {
        notify.success('La cita ha sido cancelada', 'Cita cancelada')
        showViewModal.value = false
      } else {
        notify.error(result.message || 'Error al cancelar la cita')
      }
    }
  )
}

// Lifecycle
onMounted(async () => {
  if (profesionalesStore.profesionales.length === 0) {
    await profesionalesStore.fetchProfesionales()
  }
})
</script>