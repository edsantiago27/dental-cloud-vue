<!-- views/admin/Citas.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Master Agenda -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-emerald-500/20">Sincronización Activa</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Master Agenda Global</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Gestión de Citas
        </h1>
        <div class="flex items-center gap-6 mt-4">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-violet-600"></span>
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ citasStore.citasDelDia.length }} HOY</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-orange-500"></span>
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ citasStore.citasPendientes.length }} PENDIENTES</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ citasStore.citasConfirmadas.length }} CONFIRMADAS</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openNewModal"
          class="flex items-center gap-3 px-8 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-xl group"
        >
          <i class="fas fa-plus text-emerald-400"></i>
          Nueva Reserva
        </button>
      </div>
    </div>

    <!-- Master Layout: List + Calendar -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Bloque Izquierdo: Filtros y Mini Info (Bento Style) -->
      <div class="lg:col-span-3 space-y-8">
        <!-- Selector de Especialistas (Premium) -->
        <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-violet-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <h3 class="text-[10px] font-black text-gray-900 uppercase tracking-[0.3em] mb-8 relative z-10 flex items-center justify-between">
            Especialistas
            <i class="fas fa-user-md text-violet-400"></i>
          </h3>

          <div class="space-y-3 relative z-10">
            <button 
              @click="filters.profesional_id = null; applyFilters()"
              :class="[
                'w-full p-4 rounded-2xl flex items-center gap-4 transition-all border text-left',
                filters.profesional_id === null ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-white hover:border-gray-100'
              ]"
            >
              <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xs">
                <i class="fas fa-th-large"></i>
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest">Todos</span>
            </button>

            <button 
              v-for="prof in profesionalesStore.profesionales"
              :key="prof.id"
              @click="filters.profesional_id = prof.id; applyFilters()"
              :class="[
                'w-full p-4 rounded-2xl flex items-center gap-4 transition-all border text-left',
                filters.profesional_id === prof.id ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-white hover:border-gray-100'
              ]"
            >
              <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xs font-black">
                {{ prof.nombre[0] }}{{ prof.apellido[0] }}
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[10px] font-black uppercase tracking-tight truncate">{{ prof.nombre }} {{ prof.apellido }}</span>
                <span class="text-[8px] font-bold uppercase tracking-widest opacity-60">Dental Staff</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Filtros Rápidos de Estado -->
        <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
           <h3 class="text-[10px] font-black uppercase tracking-[0.3em] mb-6 relative z-10">Estados de Cita</h3>
           <div class="grid grid-cols-2 gap-4 relative z-10">
              <button 
                v-for="estado in citasStore.estados" 
                :key="estado.value"
                @click="filters.estado = estado.value; applyFilters()"
                :class="[
                  'p-4 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all text-center',
                  filters.estado === estado.value ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                ]"
              >
                {{ estado.label }}
              </button>
           </div>
           <button 
            @click="clearFilters" 
            class="w-full mt-6 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all"
           >
             Reiniciar Vistas
           </button>
        </div>
      </div>

      <!-- Bloque Derecho: El Calendario (Bento King) -->
      <div class="lg:col-span-9">
        <div class="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden min-h-[800px]">
           <CitasCalendar
             ref="calendarRef"
             @event-click="handleEventClick"
             @date-click="handleDateClick"
             @event-update="handleEventUpdate"
           />
        </div>
      </div>
    </div>

    <!-- Modales (Consistencia Visual) -->
    <CitaFormModal v-model="showFormModal" :cita="null" :paciente-preseleccionado="pacientePreseleccionado" :fecha-preseleccionada="fechaPreseleccionada" :hora-preseleccionada="horaPreseleccionada" @saved="handleSaved" />
    <CitaFormModal v-model="showEditModal" :cita="selectedCita" @saved="handleSaved" />
    <CitaViewModal v-model="showViewModal" :cita="selectedCita" @edit="openEditModal" @estado-changed="handleEstadoChanged" @cancelar="handleCancelar" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCitasStore } from '@clinica/stores/citas'
import { usePacientesStore } from '@clinica/stores/pacientes'
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useTratamientosStore } from '@clinica/stores/tratamientos'
import { useNotification } from '@shared/composables/useNotification'
import CitasCalendar from '@clinica/components/citas/CitasCalendar-v2.vue'
import CitaFormModal from '@clinica/components/citas/CitaFormModal.vue'
import CitaViewModal from '@clinica/components/citas/CitaViewModal.vue'

const citasStore = useCitasStore()
const pacientesStore = usePacientesStore()
const profesionalesStore = useProfesionalesStore()
const tratamientosStore = useTratamientosStore()
const notify = useNotification()

const calendarRef = ref(null)
const showFormModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedCita = ref(null)
const pacientePreseleccionado = ref(null)
const fechaPreseleccionada = ref(null)
const horaPreseleccionada = ref(null)

const filters = ref({ profesional_id: null, estado: null, fecha_inicio: null, fecha_fin: null })

function applyFilters() { citasStore.applyFilters(filters.value); if (calendarRef.value) calendarRef.value.refetch() }
function clearFilters() { filters.value = { profesional_id: null, estado: null, fecha_inicio: null, fecha_fin: null }; citasStore.clearFilters(); if (calendarRef.value) calendarRef.value.refetch() }

function openNewModal() { pacientePreseleccionado.value = null; fechaPreseleccionada.value = null; horaPreseleccionada.value = null; showFormModal.value = true }
function openEditModal(cita) { selectedCita.value = { ...cita }; showViewModal.value = false; showEditModal.value = true }
function handleEventClick(cita) { selectedCita.value = cita; showViewModal.value = true }
function handleDateClick(info) { fechaPreseleccionada.value = info.date; horaPreseleccionada.value = info.time || '09:00'; showFormModal.value = true }

async function handleEventUpdate(updatedData) {
  const { id, ...data } = updatedData
  const result = await citasStore.updateCita(id, data)
  if (result.success) notify.success('Cita reagendada correctamente', 'Agenda Actualizada')
  else { notify.error(result.message || 'Error al reagendar'); if (calendarRef.value) calendarRef.value.refetch() }
}

function handleSaved() { showFormModal.value = false; showEditModal.value = false; showViewModal.value = false; notify.success('Los cambios se han guardado exitosamente'); if (calendarRef.value) calendarRef.value.refetch() }

async function handleEstadoChanged({ cita, nuevoEstado }) {
  const result = await citasStore.updateEstado(cita.id, nuevoEstado)
  if (result.success) { notify.success(`Estado actualizado: ${nuevoEstado}`); selectedCita.value = { ...selectedCita.value, estado: nuevoEstado }; if (calendarRef.value) calendarRef.value.refetch() }
  else notify.error(result.message || 'Error al actualizar estado')
}

function handleCancelar(cita) {
  notify.confirm(`¿Estás seguro que deseas cancelar esta cita de ${cita.paciente?.nombre}?`, async () => {
    const result = await citasStore.cancelarCita(cita.id)
    if (result.success) { notify.success('Cita cancelada correctamente'); showViewModal.value = false; if (calendarRef.value) calendarRef.value.refetch() }
    else notify.error(result.message || 'Error al cancelar')
  })
}

onMounted(async () => {
  if (pacientesStore.pacientes.length === 0) await pacientesStore.fetchPacientes()
  if (profesionalesStore.profesionales.length === 0) await profesionalesStore.fetchProfesionales()
  if (tratamientosStore.tratamientos.length === 0) await tratamientosStore.fetchTratamientos()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>