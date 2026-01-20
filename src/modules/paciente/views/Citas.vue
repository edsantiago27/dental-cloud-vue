<template>
  <div class="space-y-8 animate-fade-in-up">
    
    <!-- Large Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
      <div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tight">Mis Citas</h1>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Gestiona tu agenda de salud dental</p>
      </div>
      <button
        @click="mostrarModalAgendar = true"
        class="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center gap-3"
      >
        <i class="fas fa-plus text-xs"></i>
        Agendar Nueva Cita
      </button>
    </div>

    <!-- Modern Tabs -->
    <div class="flex gap-4">
      <button
        @click="tabActivo = 'proximas'"
        :class="[
          tabActivo === 'proximas'
            ? 'bg-gray-900 text-white shadow-xl shadow-gray-200'
            : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100',
          'px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all'
        ]"
      >
        Próximas <span class="opacity-50 ml-1">({{ citasStore.citasProximas.length }})</span>
      </button>
      <button
        @click="tabActivo = 'pasadas'"
        :class="[
          tabActivo === 'pasadas'
            ? 'bg-gray-900 text-white shadow-xl shadow-gray-200'
            : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100',
          'px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all'
        ]"
      >
        Historial <span class="opacity-50 ml-1">({{ citasStore.citasPasadas.length }})</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="citasStore.loading" class="flex flex-col items-center justify-center py-20 animate-pulse">
      <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
      </div>
      <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Sincronizando tus citas...</p>
    </div>

    <!-- Appointments List -->
    <div v-else class="space-y-6">
      
      <!-- Empty State -->
      <div v-if="(tabActivo === 'proximas' && citasStore.citasProximas.length === 0) || (tabActivo === 'pasadas' && citasStore.citasPasadas.length === 0)" 
           class="bg-white rounded-[2.5rem] p-16 text-center border border-gray-100 shadow-xl shadow-gray-100/50">
        <div class="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-gray-100">
          <i class="fas fa-calendar-alt text-4xl text-gray-200"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Sin citas para mostrar</h3>
        <p class="text-gray-400 font-medium max-w-xs mx-auto mb-10">Aquí aparecerá el registro de tus consultas médicas de {{ tabActivo === 'proximas' ? 'próximas citas' : 'completadas o canceladas' }}.</p>
        <button v-if="tabActivo === 'proximas'" @click="mostrarModalAgendar = true" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-50">
          Agendar ahora
        </button>
      </div>

      <!-- Bento-style List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div
          v-for="cita in (tabActivo === 'proximas' ? citasStore.citasProximas : citasStore.citasPasadas)"
          :key="cita.id"
          class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/30 hover:shadow-blue-100/50 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between"
          :class="{ 'opacity-80': tabActivo === 'pasadas' }"
        >
          <!-- Accent blur -->
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
          
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-8">
              <div class="flex items-center gap-4">
                <div class="bg-blue-50 w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-sm border border-blue-100">
                  <span class="text-2xl font-black text-blue-600 leading-none">{{ formatDia(cita.fecha) }}</span>
                  <span class="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">{{ formatMes(cita.fecha) }}</span>
                </div>
                <div>
                  <span :class="['px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border', getEstadoClass(cita.estado).replace('bg-', 'bg-').replace('text-', 'text-')]">
                    {{ getEstadoLabel(cita.estado) }}
                  </span>
                  <h3 class="text-xl font-bold text-gray-900 mt-2 tracking-tight">{{ cita.tratamiento?.nombre || 'Consulta General' }}</h3>
                </div>
              </div>
              <button @click="verDetalle(cita)" class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                <i class="fas fa-chevron-right text-xs"></i>
              </button>
            </div>

            <div class="space-y-4 pt-6 border-t border-gray-50">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <i class="fas fa-user-md"></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profesional</p>
                  <p class="font-bold text-gray-700">{{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <i class="fas fa-clock"></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hora</p>
                  <p class="font-bold text-gray-700">{{ formatHora(cita.hora) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="tabActivo === 'proximas'" class="relative z-10 flex gap-3 mt-10">
            <button
              v-if="puedeReagendar(cita)"
              @click="abrirModalReagendar(cita)"
              class="flex-1 py-4 bg-orange-50 text-orange-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-orange-100 transition-all active:scale-[0.98]"
            >
              Reagendar
            </button>
            <button
              v-if="puedeCancelar(cita)"
              @click="abrirModalCancelar(cita)"
              class="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-[0.98]"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals (Functional, but themed) -->
    <AgendarCita v-if="mostrarModalAgendar" @close="cerrarModalAgendar" @success="handleCitaAgendada" />
    <CancelarCita v-if="mostrarModalCancelar" :cita="citaSeleccionada" @close="cerrarModalCancelar" @success="handleCitaCancelada" />
    <ReagendarCita v-if="mostrarModalReagendar" :cita="citaSeleccionada" @close="cerrarModalReagendar" @success="handleCitaReagendada" />
    <DetalleCita v-if="mostrarModalDetalle" :cita="citaSeleccionada" @close="cerrarModalDetalle" />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePacienteCitasStore } from '@paciente/stores/citas'
import AgendarCita from '@paciente/components/AgendarCita.vue'
import CancelarCita from '@paciente/components/CancelarCita.vue'
import ReagendarCita from '@paciente/components/ReagendarCita.vue'
import DetalleCita from '@paciente/components/DetalleCita.vue'

const citasStore = usePacienteCitasStore()

// State
const tabActivo = ref('proximas')
const mostrarModalAgendar = ref(false)
const mostrarModalCancelar = ref(false)
const mostrarModalReagendar = ref(false)
const mostrarModalDetalle = ref(false)
const citaSeleccionada = ref(null)

// Methods
function formatDia(fecha) {
  if (!fecha) return ''
  const [year, month, day] = fecha.substring(0, 10).split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getDate()
}

function formatMes(fecha) {
  if (!fecha) return ''
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const [year, month, day] = fecha.substring(0, 10).split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return meses[date.getMonth()]
}

function formatHora(hora) {
  if (!hora) return ''
  return hora.substring(0, 5) // HH:MM
}

function getEstadoClass(estado) {
  const classes = {
    'programada': 'border-blue-100 bg-blue-50 text-blue-600',
    'confirmada': 'border-green-100 bg-green-50 text-green-600',
    'completada': 'border-gray-100 bg-gray-50 text-gray-500',
    'cancelada': 'border-red-100 bg-red-50 text-red-600',
    'no_asistio': 'border-yellow-100 bg-yellow-50 text-yellow-600'
  }
  return classes[estado] || 'border-gray-100 bg-gray-50 text-gray-500'
}

function getEstadoLabel(estado) {
  const labels = {
    'programada': 'Programada',
    'confirmada': 'Confirmada',
    'completada': 'Completada',
    'cancelada': 'Cancelada',
    'no_asistio': 'No asistió'
  }
  return labels[estado] || estado
}

function puedeCancelar(cita) {
  if (!cita || !['programada', 'confirmada'].includes(cita.estado)) return false
  const [year, month, day] = cita.fecha.substring(0, 10).split('-').map(Number)
  const [hours, minutes] = cita.hora.split(':').map(Number)
  const fechaCita = new Date(year, month - 1, day, hours, minutes)
  const ahora = new Date()
  const horasHasta = (fechaCita - ahora) / (1000 * 60 * 60)
  return horasHasta >= 24
}

function puedeReagendar(cita) {
  return puedeCancelar(cita)
}

function verDetalle(cita) {
  citaSeleccionada.value = cita
  mostrarModalDetalle.value = true
}

function abrirModalCancelar(cita) {
  citaSeleccionada.value = cita
  mostrarModalCancelar.value = true
}

function abrirModalReagendar(cita) {
  citaSeleccionada.value = cita
  mostrarModalReagendar.value = true
}

function cerrarModalAgendar() { mostrarModalAgendar.value = false }
function cerrarModalCancelar() { mostrarModalCancelar.value = false; citaSeleccionada.value = null }
function cerrarModalReagendar() { mostrarModalReagendar.value = false; citaSeleccionada.value = null }
function cerrarModalDetalle() { mostrarModalDetalle.value = false; citaSeleccionada.value = null }

function handleCitaAgendada() { cerrarModalAgendar(); citasStore.fetchCitas() }
function handleCitaCancelada() { cerrarModalCancelar(); citasStore.fetchCitas() }
function handleCitaReagendada() { cerrarModalReagendar(); citasStore.fetchCitas() }

onMounted(() => {
  citasStore.fetchCitas()
})
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>