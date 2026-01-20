<!-- views/admin/CitasLista.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-emerald-500/20">Registro de Atenciones</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Listado Maestro de Citas</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Historial de Turnos
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Administración cronológica y gestión de estados</p>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          to="/calendario"
          class="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all group"
        >
          <i class="fas fa-calendar-alt group-hover:rotate-12 transition-transform"></i>
          Ver Calendario
        </router-link>
        <button
          @click="openNewModal"
          class="flex items-center gap-3 px-8 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-xl group"
        >
          <i class="fas fa-plus text-emerald-400"></i>
          Agendar Nueva
        </button>
      </div>
    </div>

    <!-- Search & Filters Bento -->
    <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
      <div class="relative z-10 flex flex-col lg:flex-row gap-6">
        <div class="flex-1 flex items-center gap-4">
           <button
            @click="toggleFilters"
            :class="[
              'px-8 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 border flex-1 lg:flex-none justify-center',
              showFilters ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-white'
            ]"
          >
            <i class="fas fa-filter text-[12px]"></i>
            {{ showFilters ? 'Ocultar Filtros' : 'Filtros Inteligentes' }}
            <span v-if="hasActiveFilters" class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          </button>
          <div class="hidden lg:flex items-center gap-6 px-10 text-[9px] font-black text-gray-400 uppercase tracking-widest">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Pendientes: {{ citasStore.citasPendientes.length }}
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hoy: {{ citasStore.citasDelDia.length }}
            </div>
          </div>
        </div>
      </div>

      <!-- Expandible de Filtros -->
      <transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-[500px] opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="max-h-[500px] opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-show="showFilters" class="mt-8 pt-8 border-t border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Profesional</label>
              <select v-model="filters.profesional_id" class="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all">
                <option :value="null">Todos los Especialistas</option>
                <option v-for="prof in profesionalesStore.profesionales" :key="prof.id" :value="prof.id">{{ prof.nombre }} {{ prof.apellido }}</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Estado</label>
              <select v-model="filters.estado" class="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all">
                <option :value="null">Todos los Estados</option>
                <option v-for="estado in citasStore.estados" :key="estado.value" :value="estado.value">{{ estado.label }}</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Desde</label>
              <input v-model="filters.fecha_inicio" type="date" class="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all">
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">Hasta</label>
              <input v-model="filters.fecha_fin" type="date" class="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all">
            </div>
          </div>
          <div class="flex gap-4 mt-8">
            <button @click="applyFilters" class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Filtrar Base de Datos</button>
            <button @click="clearFilters" class="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Reiniciar</button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Lista Overhaul -->
    <CitasCalendarSimple @event-click="handleEventClick" @reagendar="openEditModal" />

    <!-- Modales -->
    <CitaFormModal v-model="showFormModal" :cita="null" @saved="handleSaved" />
    <CitaFormModal v-model="showEditModal" :cita="selectedCita" @saved="handleSaved" />
    <CitaViewModal v-model="showViewModal" :cita="selectedCita" @edit="openEditModal" @estado-changed="handleEstadoChanged" @cancelar="handleCancelar" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCitasStore } from '@clinica/stores/citas'
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useNotification } from '@shared/composables/useNotification'
import CitasCalendarSimple from '@clinica/components/citas/CitasCalendarSimple.vue'
import CitaFormModal from '@clinica/components/citas/CitaFormModal.vue'
import CitaViewModal from '@clinica/components/citas/CitaViewModal.vue'

const citasStore = useCitasStore()
const profesionalesStore = useProfesionalesStore()
const notify = useNotification()

const showFilters = ref(false)
const showFormModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedCita = ref(null)

const filters = ref({ profesional_id: null, estado: null, fecha_inicio: null, fecha_fin: null })

const hasActiveFilters = computed(() => !!(filters.value.profesional_id || filters.value.estado || filters.value.fecha_inicio || filters.value.fecha_fin))

function toggleFilters() { showFilters.value = !showFilters.value }
function applyFilters() { citasStore.applyFilters(filters.value); notify.info('Filtros aplicados') }
function clearFilters() { filters.value = { profesional_id: null, estado: null, fecha_inicio: null, fecha_fin: null }; citasStore.clearFilters(); notify.info('Filtros reiniciados') }
function openNewModal() { showFormModal.value = true }
function openEditModal(cita) { selectedCita.value = { ...cita }; showViewModal.value = false; showEditModal.value = true }
function handleEventClick(cita) { selectedCita.value = cita; showViewModal.value = true }
function handleSaved() { showFormModal.value = false; showEditModal.value = false; showViewModal.value = false; notify.success('Operación exitosa') }

async function handleEstadoChanged({ cita, nuevoEstado }) {
  const result = await citasStore.updateEstado(cita.id, nuevoEstado)
  if (result.success) { notify.success(`Estado: ${nuevoEstado}`); selectedCita.value = { ...selectedCita.value, estado: nuevoEstado } }
  else notify.error(result.message || 'Error al actualizar')
}

function handleCancelar(cita) {
  notify.confirm(`¿Seguro que desea cancelar la cita de ${cita.paciente?.nombre}?`, async () => {
    const result = await citasStore.cancelarCita(cita.id)
    if (result.success) { notify.success('Cita cancelada'); showViewModal.value = false }
    else notify.error(result.message || 'Error al cancelar')
  })
}

onMounted(async () => {
  if (profesionalesStore.profesionales.length === 0) await profesionalesStore.fetchProfesionales()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>