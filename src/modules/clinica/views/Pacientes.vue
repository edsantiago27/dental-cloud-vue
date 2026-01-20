<!-- views/admin/Pacientes.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-violet-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-violet-500/20">Base de Datos</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gestión Integral de Registros</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Pacientes
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Búsqueda avanzada y administración de fichas clínicas</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openNewModal"
          class="flex items-center gap-3 px-8 py-4 bg-violet-600 border border-violet-500 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:shadow-2xl hover:scale-105 transition-all shadow-lg shadow-violet-500/20 group"
        >
          <i class="fas fa-plus group-hover:rotate-90 transition-transform"></i>
          Nuevo Registro
        </button>
      </div>
    </div>

    <!-- Search & Filters Bento -->
    <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
      <!-- Decoración -->
      <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-violet-50 rounded-full blur-3xl opacity-50"></div>

      <div class="relative z-10 flex flex-col lg:flex-row gap-6">
        <!-- Input de Búsqueda -->
        <div class="flex-1 relative group">
          <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors"></i>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="BUSCAR POR NOMBRE, RUT, EMAIL..."
            class="w-full pl-14 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-[1.8rem] text-[11px] font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-4 focus:ring-violet-600/5 focus:border-violet-600/20 transition-all"
          >
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <i class="fas fa-times-circle"></i>
          </button>
        </div>

        <!-- Botones de Acción -->
        <div class="flex items-center gap-4">
          <button
            @click="toggleFilters"
            :class="[
              'px-6 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border',
              showFilters ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
            ]"
          >
            <i class="fas fa-filter text-[12px]"></i>
            Filtros Avanzados
            <span v-if="hasActiveFilters" class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          </button>
        </div>
      </div>

      <!-- Expandible de Filtros -->
      <transition
        enter-active-class="transition duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-[500px] opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="max-h-[500px] opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-show="showFilters" class="mt-8 pt-8 border-t border-gray-100 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Estado</label>
              <select v-model="filters.estado" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-4 focus:ring-violet-600/5 transition-all">
                <option value="">TODOS LOS ESTADOS</option>
                <option value="activo">ACTIVO</option>
                <option value="inactivo">INACTIVO</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Género</label>
              <select v-model="filters.genero" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-4 focus:ring-violet-600/5 transition-all">
                <option value="">TODOS</option>
                <option value="masculino">MASCULINO</option>
                <option value="femenino">FEMENINO</option>
                <option value="otro">OTRO</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Desde</label>
              <input v-model="filters.fechaDesde" type="date" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-4 focus:ring-violet-600/5 transition-all">
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Hasta</label>
              <input v-model="filters.fechaHasta" type="date" class="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:ring-4 focus:ring-violet-600/5 transition-all">
            </div>
          </div>
          <div class="flex gap-4 mt-8">
            <button @click="applyFilters" class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Aplicar Inteligencia</button>
            <button @click="clearFilters" class="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Reiniciar</button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Lista de Pacientes Bento -->
    <PacientesList
      @new="openNewModal"
      @agendar-cita="handleAgendarCita"
      @perfil="openPerfilModal"
    />

    <!-- Modales (Manteniendo lógica original) -->
    <PacienteFormModal v-model="showFormModal" :paciente="null" @saved="handleSaved" />
    <PacienteFormModal v-model="showEditModal" :paciente="selectedPaciente" @saved="handleSaved" />
    <PacienteViewModal v-model="showPerfilModal" :paciente="selectedPaciente" @edit="openEditModal" />
    <PacienteViewModal v-model="showPacienteViewModal" :paciente="selectedPaciente" @edit="handleEditPaciente" @agendar="handleAgendarCita" />
    <CitaFormModal v-model="showCitaFormModal" :cita="editingCita" :initialData="citaFormData" @created="handleCitaCreated" @updated="handleCitaUpdated" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePacientesStore } from '@clinica/stores'
import { useNotification } from '@shared/composables/useNotification'
import PacientesList from '@clinica/components/pacientes/PacientesList.vue'
import PacienteFormModal from '@clinica/components/pacientes/PacienteFormModal.vue'
import PacienteViewModal from '@clinica/components/pacientes/PacienteViewModal.vue'
import CitaFormModal from '@clinica/components/citas/CitaFormModal.vue'

const pacientesStore = usePacientesStore()
const notify = useNotification()
const router = useRouter() 

const searchQuery = ref('')
const showFilters = ref(false)
const showFormModal = ref(false)
const showPerfilModal = ref(false)
const showEditModal = ref(false)
const showPacienteViewModal = ref(false)
const selectedPaciente = ref(null)
const showCitaFormModal = ref(false)
const citaFormData = ref({})
const editingCita = ref(null)

const filters = ref({ estado: '', genero: '', fechaDesde: '', fechaHasta: '' })

const hasActiveFilters = computed(() => filters.value.estado || filters.value.genero || filters.value.fechaDesde || filters.value.fechaHasta)

const fechaActual = computed(() => new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }))

function toggleFilters() { showFilters.value = !showFilters.value }

let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { pacientesStore.searchPacientes(searchQuery.value) }, 500)
}

function clearSearch() { searchQuery.value = ''; pacientesStore.searchPacientes('') }

function applyFilters() { pacientesStore.applyFilters(filters.value); notify.info('Inteligencia de filtros aplicada') }

function clearFilters() {
  filters.value = { estado: '', genero: '', fechaDesde: '', fechaHasta: '' }
  pacientesStore.clearFilters()
  notify.info('Parámetros reiniciados')
}

function openNewModal() { selectedPaciente.value = null; showFormModal.value = true }

function openPerfilModal(paciente) { selectedPaciente.value = paciente; showPerfilModal.value = true }

function openEditModal(paciente) { selectedPaciente.value = { ...paciente }; showPerfilModal.value = false; showEditModal.value = true }

function handleAgendarCita(paciente) {
  showPacienteViewModal.value = false
  citaFormData.value = { paciente_id: paciente.id, fecha: '', hora: '', profesional_id: null, tratamiento_id: null, duracion: 30, motivo: '', notas: '' }
  editingCita.value = null
  showCitaFormModal.value = true
}

function handleCitaCreated() { notify.success('Turno agendado exitosamente'); showCitaFormModal.value = false }
function handleCitaUpdated() { notify.success('Turno actualizado'); showCitaFormModal.value = false }
function handleEditPaciente(paciente) { openEditModal(paciente) }
function handleSaved() { showFormModal.value = false; showEditModal.value = false; showPerfilModal.value = false; notify.success('Ficha guardada correctamente') }

onMounted(() => { pacientesStore.fetchPacientes() })
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>