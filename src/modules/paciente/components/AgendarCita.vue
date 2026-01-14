<!-- src/components/paciente/AgendarCita.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Agendar Nueva Cita</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        
        <!-- Paso 1: Seleccionar Profesional y Tratamiento -->
        <div v-if="paso === 1">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            1. Selecciona el profesional y tipo de consulta
          </h3>

          <!-- Profesional -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Profesional <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.profesional_id"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar profesional...</option>
              <option
                v-for="prof in citasStore.profesionales"
                :key="prof.id"
                :value="prof.id"
              >
                {{ prof.nombre }} {{ prof.apellido }} - {{ prof.especialidad }}
              </option>
            </select>
          </div>

          <!-- Tratamiento -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de consulta <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.tratamiento_id"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo...</option>
              <option
                v-for="trat in citasStore.tratamientos"
                :key="trat.id"
                :value="trat.id"
              >
                {{ trat.nombre }} 
                <span v-if="trat.duracion_minutos">
                  ({{ trat.duracion_minutos }} min)
                </span>
              </option>
            </select>
          </div>

          <!-- Motivo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Motivo de la consulta (opcional)
            </label>
            <textarea
              v-model="form.motivo"
              rows="3"
              placeholder="Describe brevemente el motivo de tu consulta..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <button
            @click="irAPaso2"
            :disabled="!form.profesional_id || !form.tratamiento_id"
            class="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Continuar →
          </button>
        </div>

        <!-- Paso 2: Seleccionar Fecha y Hora -->
        <div v-else-if="paso === 2">
          <button
            @click="paso = 1"
            class="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            <i class="fas fa-arrow-left"></i>
            Volver
          </button>

          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            2. Selecciona fecha y hora
          </h3>

          <!-- Fecha -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha <span class="text-red-500">*</span>
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
              Hora disponible <span class="text-red-500">*</span>
            </label>

            <div v-if="loadingHorarios" class="text-center py-8">
              <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
              <p class="text-gray-600 mt-2">Cargando horarios...</p>
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

          <!-- Error Message -->
          <div v-if="citasStore.error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            <i class="fas fa-exclamation-circle mr-2"></i>
            {{ citasStore.error }}
          </div>

          <!-- Botones -->
          <div class="flex gap-3 mt-6">
            <button
              @click="paso = 1"
              class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Volver
            </button>
            <button
              @click="confirmarCita"
              :disabled="!form.fecha || !form.hora || citasStore.loading"
              class="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <i v-if="citasStore.loading" class="fas fa-spinner fa-spin mr-2"></i>
              Confirmar Cita
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePacienteCitasStore } from '@paciente/stores/citas'

const emit = defineEmits(['close', 'success'])

const citasStore = usePacienteCitasStore()

// State
const paso = ref(1)
const loadingHorarios = ref(false)
const form = ref({
  profesional_id: '',
  tratamiento_id: '',
  fecha: '',
  hora: '',
  motivo: ''
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
async function irAPaso2() {
  if (!form.value.profesional_id || !form.value.tratamiento_id) return
  paso.value = 2
}

async function cargarHorarios() {
  if (!form.value.fecha || !form.value.profesional_id) return

  loadingHorarios.value = true
  form.value.hora = '' // Reset hora seleccionada

  try {
    await citasStore.fetchHorariosDisponibles(
      form.value.profesional_id,
      form.value.fecha,
      30 // Duración por defecto
    )
  } finally {
    loadingHorarios.value = false
  }
}

async function confirmarCita() {
  citasStore.clearError()

  const result = await citasStore.agendarCita({
    profesional_id: form.value.profesional_id,
    tratamiento_id: form.value.tratamiento_id || null,
    fecha: form.value.fecha,
    hora: form.value.hora,
    motivo: form.value.motivo || null
  })

  if (result.success) {
    emit('success')
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    citasStore.fetchProfesionales(),
    citasStore.fetchTratamientos()
  ])
})
</script>