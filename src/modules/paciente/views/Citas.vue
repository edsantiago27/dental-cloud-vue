<!-- src/views/paciente/Citas.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mis Citas</h1>
        <p class="text-gray-600 mt-1">Gestiona tus citas médicas</p>
      </div>
      <button
        @click="mostrarModalAgendar = true"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <i class="fas fa-plus"></i>
        <span>Agendar Cita</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow-sm p-1 inline-flex">
      <button
        @click="tabActivo = 'proximas'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          tabActivo === 'proximas'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Próximas ({{ citasStore.citasProximas.length }})
      </button>
      <button
        @click="tabActivo = 'pasadas'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          tabActivo === 'pasadas'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Historial ({{ citasStore.citasPasadas.length }})
      </button>
    </div>

    <!-- Loading -->
    <div v-if="citasStore.loading" class="flex justify-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Cargando citas...</p>
      </div>
    </div>

    <!-- Lista de Citas Próximas -->
    <div v-else-if="tabActivo === 'proximas'" class="space-y-4">
      <div v-if="citasStore.citasProximas.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <i class="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No tienes citas próximas</h3>
        <p class="text-gray-600 mb-6">Agenda tu próxima cita con nosotros</p>
        <button
          @click="mostrarModalAgendar = true"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <i class="fas fa-plus mr-2"></i>
          Agendar Cita
        </button>
      </div>

      <div
        v-for="cita in citasStore.citasProximas"
        :key="cita.id"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between">
          <div class="flex gap-4 flex-1">
            <!-- Fecha -->
            <div class="flex-shrink-0 w-16 text-center">
              <div class="bg-blue-100 rounded-lg p-3">
                <div class="text-2xl font-bold text-blue-600">
                  {{ formatDia(cita.fecha) }}
                </div>
                <div class="text-xs text-blue-600 font-medium uppercase">
                  {{ formatMes(cita.fecha) }}
                </div>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    getEstadoClass(cita.estado)
                  ]"
                >
                  {{ getEstadoLabel(cita.estado) }}
                </span>
              </div>

              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {{ cita.tratamiento?.nombre || 'Consulta general' }}
              </h3>

              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <i class="fas fa-user-md w-4"></i>
                  <span>{{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="fas fa-clock w-4"></i>
                  <span>{{ formatHora(cita.hora) }}</span>
                </div>
                <div v-if="cita.motivo" class="flex items-center gap-2">
                  <i class="fas fa-comment w-4"></i>
                  <span>{{ cita.motivo }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex flex-col gap-2">
            <button
              @click="verDetalle(cita)"
              class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition text-sm"
            >
              Ver detalle
            </button>
            <button
              v-if="puedeReagendar(cita)"
              @click="abrirModalReagendar(cita)"
              class="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition text-sm"
            >
              Reagendar
            </button>
            <button
              v-if="puedeCancelar(cita)"
              @click="abrirModalCancelar(cita)"
              class="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Citas Pasadas -->
    <div v-else class="space-y-4">
      <div v-if="citasStore.citasPasadas.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <i class="fas fa-history text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay historial de citas</h3>
        <p class="text-gray-600">Aquí aparecerán tus citas completadas y canceladas</p>
      </div>

      <div
        v-for="cita in citasStore.citasPasadas"
        :key="cita.id"
        class="bg-white rounded-lg shadow-sm p-6 opacity-75"
      >
        <div class="flex items-start gap-4">
          <!-- Fecha -->
          <div class="flex-shrink-0 w-16 text-center">
            <div class="bg-gray-100 rounded-lg p-3">
              <div class="text-2xl font-bold text-gray-600">
                {{ formatDia(cita.fecha) }}
              </div>
              <div class="text-xs text-gray-600 font-medium uppercase">
                {{ formatMes(cita.fecha) }}
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getEstadoClass(cita.estado)
                ]"
              >
                {{ getEstadoLabel(cita.estado) }}
              </span>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ cita.tratamiento?.nombre || 'Consulta general' }}
            </h3>

            <div class="space-y-1 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <i class="fas fa-user-md w-4"></i>
                <span>{{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-clock w-4"></i>
                <span>{{ formatHora(cita.hora) }}</span>
              </div>
              <div v-if="cita.motivo_cancelacion" class="flex items-center gap-2 text-red-600">
                <i class="fas fa-exclamation-circle w-4"></i>
                <span>{{ cita.motivo_cancelacion }}</span>
              </div>
            </div>
          </div>

          <!-- Botón ver detalle -->
          <button
            @click="verDetalle(cita)"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Agendar Cita -->
    <AgendarCita
      v-if="mostrarModalAgendar"
      @close="cerrarModalAgendar"
      @success="handleCitaAgendada"
    />

    <!-- Modal Cancelar Cita -->
    <CancelarCita
      v-if="mostrarModalCancelar"
      :cita="citaSeleccionada"
      @close="cerrarModalCancelar"
      @success="handleCitaCancelada"
    />

    <!-- Modal Reagendar Cita -->
    <ReagendarCita
      v-if="mostrarModalReagendar"
      :cita="citaSeleccionada"
      @close="cerrarModalReagendar"
      @success="handleCitaReagendada"
    />

    <!-- Modal Detalle Cita -->
    <DetalleCita
      v-if="mostrarModalDetalle"
      :cita="citaSeleccionada"
      @close="cerrarModalDetalle"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePacienteCitasStore } from '../stores/citas'
import AgendarCita from '../components/paciente/AgendarCita.vue'
import CancelarCita from '../components/CancelarCita.vue'
import ReagendarCita from '../components/ReagendarCita.vue'
import DetalleCita from '../components/DetalleCita.vue'

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
  return new Date(fecha).getDate()
}

function formatMes(fecha) {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return meses[new Date(fecha).getMonth()]
}

function formatHora(hora) {
  return hora.substring(0, 5) // HH:MM
}

function getEstadoClass(estado) {
  const classes = {
    'programada': 'bg-blue-100 text-blue-700',
    'confirmada': 'bg-green-100 text-green-700',
    'completada': 'bg-gray-100 text-gray-700',
    'cancelada': 'bg-red-100 text-red-700',
    'no_asistio': 'bg-yellow-100 text-yellow-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
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
  if (!['programada', 'confirmada'].includes(cita.estado)) return false
  
  // Verificar que falten más de 24 horas
  const fechaCita = new Date(cita.fecha + ' ' + cita.hora)
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

function cerrarModalAgendar() {
  mostrarModalAgendar.value = false
}

function cerrarModalCancelar() {
  mostrarModalCancelar.value = false
  citaSeleccionada.value = null
}

function cerrarModalReagendar() {
  mostrarModalReagendar.value = false
  citaSeleccionada.value = null
}

function cerrarModalDetalle() {
  mostrarModalDetalle.value = false
  citaSeleccionada.value = null
}

function handleCitaAgendada() {
  cerrarModalAgendar()
  citasStore.fetchCitas()
}

function handleCitaCancelada() {
  cerrarModalCancelar()
  citasStore.fetchCitas()
}

function handleCitaReagendada() {
  cerrarModalReagendar()
  citasStore.fetchCitas()
}

// Lifecycle
onMounted(() => {
  citasStore.fetchCitas()
})
</script>