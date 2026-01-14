<!-- src/components/paciente/CancelarCita.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-md w-full">
      
      <!-- Header -->
      <div class="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Cancelar Cita</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6">
        
        <!-- Warning -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div class="flex items-start gap-3">
            <i class="fas fa-exclamation-triangle text-yellow-600 text-xl mt-0.5"></i>
            <div class="text-sm text-yellow-800">
              <p class="font-medium mb-1">¿Estás seguro de cancelar esta cita?</p>
              <p>Esta acción no se puede deshacer. Te recomendamos reagendar en lugar de cancelar.</p>
            </div>
          </div>
        </div>

        <!-- Información de la cita -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-gray-900 mb-3">Detalle de la cita:</h3>
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-gray-700">
              <i class="fas fa-calendar w-5"></i>
              <span>{{ formatFecha(cita.fecha) }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-700">
              <i class="fas fa-clock w-5"></i>
              <span>{{ formatHora(cita.hora) }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-700">
              <i class="fas fa-user-md w-5"></i>
              <span>{{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-700">
              <i class="fas fa-tooth w-5"></i>
              <span>{{ cita.tratamiento?.nombre || 'Consulta general' }}</span>
            </div>
          </div>
        </div>

        <!-- Motivo de cancelación -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Motivo de la cancelación <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="motivo"
            rows="4"
            required
            placeholder="Por favor indica el motivo de la cancelación..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Este mensaje será enviado a la clínica
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <i class="fas fa-exclamation-circle mr-2"></i>
          {{ error }}
        </div>

        <!-- Botones -->
        <div class="flex gap-3">
          <button
            @click="$emit('close')"
            :disabled="loading"
            class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
          >
            Volver
          </button>
          <button
            @click="confirmarCancelacion"
            :disabled="!motivo.trim() || loading"
            class="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-times-circle mr-2"></i>
            Confirmar Cancelación
          </button>
        </div>

        <!-- Info adicional -->
        <p class="text-xs text-gray-500 text-center mt-4">
          Recuerda que las cancelaciones con menos de 24 horas de anticipación no están permitidas.
        </p>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePacienteCitasStore } from '../stores/citas'

const props = defineProps({
  cita: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const citasStore = usePacienteCitasStore()

// State
const motivo = ref('')
const loading = ref(false)
const error = ref(null)

// Methods
function formatFecha(fecha) {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatHora(hora) {
  return hora.substring(0, 5) // HH:MM
}

async function confirmarCancelacion() {
  if (!motivo.value.trim()) {
    error.value = 'Debes indicar un motivo para la cancelación'
    return
  }

  loading.value = true
  error.value = null

  const result = await citasStore.cancelarCita(props.cita.id, motivo.value)

  loading.value = false

  if (result.success) {
    emit('success')
  } else {
    error.value = result.message
  }
}
</script>