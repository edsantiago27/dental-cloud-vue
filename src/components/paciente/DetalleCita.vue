<!-- src/components/paciente/DetalleCita.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Detalle de la Cita</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        
        <!-- Estado -->
        <div class="flex items-center justify-center">
          <span
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold',
              getEstadoClass(cita.estado)
            ]"
          >
            <i :class="getEstadoIcon(cita.estado)" class="mr-2"></i>
            {{ getEstadoLabel(cita.estado) }}
          </span>
        </div>

        <!-- Fecha y Hora -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
          <div class="text-sm text-gray-600 mb-2">Fecha y hora</div>
          <div class="text-2xl font-bold text-gray-900">
            {{ formatFechaCompleta(cita.fecha) }}
          </div>
          <div class="text-xl font-semibold text-blue-600 mt-2">
            {{ formatHora(cita.hora) }}
          </div>
          <div v-if="cita.duracion" class="text-sm text-gray-600 mt-2">
            Duración estimada: {{ cita.duracion }} minutos
          </div>
        </div>

        <!-- Información Principal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Profesional -->
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-user-md text-blue-600 text-xl"></i>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1">Profesional</div>
                <div class="font-semibold text-gray-900">
                  {{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}
                </div>
                <div v-if="cita.profesional?.especialidad" class="text-sm text-gray-600 mt-1">
                  {{ cita.profesional.especialidad }}
                </div>
              </div>
            </div>
          </div>

          <!-- Tratamiento -->
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="fas fa-tooth text-green-600 text-xl"></i>
              </div>
              <div>
                <div class="text-xs text-gray-500 mb-1">Tipo de consulta</div>
                <div class="font-semibold text-gray-900">
                  {{ cita.tratamiento?.nombre || 'Consulta general' }}
                </div>
                <div v-if="cita.tratamiento?.descripcion" class="text-sm text-gray-600 mt-1">
                  {{ cita.tratamiento.descripcion }}
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Motivo -->
        <div v-if="cita.motivo" class="bg-gray-50 rounded-lg p-4">
          <div class="text-sm font-medium text-gray-700 mb-2">
            <i class="fas fa-comment-medical mr-2"></i>
            Motivo de la consulta
          </div>
          <p class="text-gray-900">{{ cita.motivo }}</p>
        </div>

        <!-- Motivo cancelación -->
        <div v-if="cita.motivo_cancelacion" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="text-sm font-medium text-red-700 mb-2">
            <i class="fas fa-exclamation-circle mr-2"></i>
            Motivo de cancelación
          </div>
          <p class="text-red-900">{{ cita.motivo_cancelacion }}</p>
        </div>

        <!-- Notas adicionales -->
        <div v-if="cita.notas" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="text-sm font-medium text-yellow-700 mb-2">
            <i class="fas fa-sticky-note mr-2"></i>
            Notas adicionales
          </div>
          <p class="text-yellow-900 text-sm">{{ cita.notas }}</p>
        </div>

        <!-- Información adicional -->
        <div class="border-t border-gray-200 pt-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-gray-500 mb-1">ID de Cita</div>
              <div class="font-mono text-gray-900">#{{ cita.id }}</div>
            </div>
            <div>
              <div class="text-gray-500 mb-1">Creada el</div>
              <div class="text-gray-900">
                {{ formatFechaCorta(cita.created_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div v-if="puedeModificar" class="flex gap-3 pt-4 border-t border-gray-200">
          <button
            v-if="puedeReagendar"
            @click="$emit('reagendar', cita)"
            class="flex-1 py-3 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition font-medium"
          >
            <i class="fas fa-calendar-alt mr-2"></i>
            Reagendar
          </button>
          <button
            v-if="puedeCancelar"
            @click="$emit('cancelar', cita)"
            class="flex-1 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition font-medium"
          >
            <i class="fas fa-times-circle mr-2"></i>
            Cancelar
          </button>
        </div>

        <!-- Botón cerrar -->
        <button
          @click="$emit('close')"
          class="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Cerrar
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cita: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'cancelar', 'reagendar'])

// Computed
const puedeModificar = computed(() => {
  return ['programada', 'confirmada'].includes(props.cita.estado)
})

const puedeCancelar = computed(() => {
  if (!puedeModificar.value) return false
  
  const fechaCita = new Date(props.cita.fecha + ' ' + props.cita.hora)
  const ahora = new Date()
  const horasHasta = (fechaCita - ahora) / (1000 * 60 * 60)
  
  return horasHasta >= 24
})

const puedeReagendar = computed(() => {
  return puedeCancelar.value
})

// Methods
function formatFechaCompleta(fecha) {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatFechaCorta(fecha) {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
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

function getEstadoIcon(estado) {
  const icons = {
    'programada': 'fas fa-calendar-check',
    'confirmada': 'fas fa-check-circle',
    'completada': 'fas fa-check-double',
    'cancelada': 'fas fa-times-circle',
    'no_asistio': 'fas fa-exclamation-circle'
  }
  return icons[estado] || 'fas fa-info-circle'
}
</script>