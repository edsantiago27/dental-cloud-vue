<!-- src/components/paciente/ReagendarCita.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Reagendar Cita</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        
        <!-- Cita actual -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-900 mb-3">Cita actual:</h3>
          <div class="space-y-2 text-sm text-blue-800">
            <div class="flex items-center gap-2">
              <i class="fas fa-calendar w-5"></i>
              <span>{{ formatFecha(cita.fecha) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-clock w-5"></i>
              <span>{{ formatHora(cita.hora) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-user-md w-5"></i>
              <span>{{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}</span>
            </div>
          </div>
        </div>

        <!-- Nueva fecha y hora -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Selecciona la nueva fecha y hora
          </h3>

          <!-- Nueva Fecha -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nueva fecha <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.fecha"
              type="date"
              :min="fechaMinima"
              required
              @change="cargarHorarios"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>

          <!-- Horarios Disponibles -->
          <div v-if="form.fecha">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nueva hora <span class="text-red-500">*</span>
            </label>

            <div v-if="loadingHorarios" class="text-center py-8">
              <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
              <p class="text-gray-600 mt-2">Cargando horarios disponibles...</p>
            </div>

            <div v-else-if="citasStore.horariosDisponibles.length === 0" class="text-center py-8">
              <i class="fas fa-calendar-times text-4xl text-gray-300 mb-2"></i>
              <p class="text-gray-600">No hay horarios disponibles para esta fecha</p>
              <p class="text-sm text-gray-500 mt-1">Intenta con otra fecha</p>
            </div>

            <div v-else class="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
              <button
                v-for="horario in horariosDisponiblesOrdenados"
                :key="horario.hora"
                @click="form.hora = horario.hora"
                :disabled="!horario.disponible"
                :class="[
                  'py-2 px-3 rounded-lg border-2 transition text-sm font-medium',
                  form.hora === horario.hora
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : horario.disponible
                    ? 'border-gray-300 hover:border-blue-400 text-gray-700'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                ]"
              >
                {{ horario.hora }}
              </button>
            </div>
          </div>
        </div>

        <!-- Resumen del cambio -->
        <div v-if="form.fecha && form.hora" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 class="font-semibold text-green-900 mb-2">Nueva cita:</h4>
          <div class="space-y-1 text-sm text-green-800">
            <div class="flex items-center gap-2">
              <i class="fas fa-calendar w-5"></i>
              <span>{{ formatFecha(form.fecha) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-clock w-5"></i>
              <span>{{ form.hora }}</span>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
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
            Cancelar
          </button>
          <button
            @click="confirmarReagendamiento"
            :disabled="!form.fecha || !form.hora || loading"
            class="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-check-circle mr-2"></i>
            Confirmar Reagendamiento
          </button>
        </div>

        <!-- Info -->
        <p class="text-xs text-gray-500 text-center">
          Se notificará a la clínica sobre el cambio de horario
        </p>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePacienteCitasStore } from '@paciente/stores/citas'

const props = defineProps({
  cita: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const citasStore = usePacienteCitasStore()

// State
const loadingHorarios = ref(false)
const loading = ref(false)
const error = ref(null)
const form = ref({
  fecha: '',
  hora: ''
})

// Computed
const fechaMinima = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const horariosDisponiblesOrdenados = computed(() => {
  return [...citasStore.horariosDisponibles].sort((a, b) => {
    return a.hora.localeCompare(b.hora)
  })
})

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

async function cargarHorarios() {
  if (!form.value.fecha || form.value.fecha.length < 10) return

  // Validar año mínimo razonable (evitar años como 0002 mientras se escribe)
  const year = parseInt(form.value.fecha.split('-')[0])
  if (year < 2024 || year > 2100) return

  loadingHorarios.value = true
  form.value.hora = '' // Reset hora seleccionada

  try {
    await citasStore.fetchHorariosDisponibles(
      props.cita.profesional_id,
      form.value.fecha,
      props.cita.duracion || 30
    )
  } finally {
    loadingHorarios.value = false
  }
}

async function confirmarReagendamiento() {
  if (!form.value.fecha || !form.value.hora) return

  loading.value = true
  error.value = null

  const result = await citasStore.reagendarCita(
    props.cita.id,
    form.value.fecha,
    form.value.hora
  )

  loading.value = false

  if (result.success) {
    emit('success')
  } else {
    error.value = result.message
  }
}
</script>