<!-- components/citas/CitaFormModal.vue -->
<template>
  <!-- Backdrop -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="handleClose"
    ></div>
  </transition>

  <!-- Modal -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div>
              <h3 class="text-xl font-bold text-white">
                {{ isEdit ? 'Editar Cita' : 'Agendar Nueva Cita' }}
              </h3>
              <p class="text-blue-100 text-sm mt-1">
                {{ isEdit ? 'Modifica los datos de la cita' : 'Completa los datos para agendar' }}
              </p>
            </div>
            <button
              @click="handleClose"
              class="text-white hover:text-gray-200 transition"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Paciente -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Paciente <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.paciente_id"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.paciente_id.$error }"
                  @blur="v$.paciente_id.$touch"
                  @change="handlePacienteChange"
                >
                  <option value="">Seleccionar paciente</option>
                  <option 
                    v-for="paciente in pacientesStore.pacientes" 
                    :key="paciente.id" 
                    :value="paciente.id"
                  >
                    {{ paciente.nombre }} {{ paciente.apellido }} - {{ paciente.rut }}
                  </option>
                </select>
                <p v-if="v$.paciente_id.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.paciente_id.$errors[0].$message }}
                </p>
                <p v-if="isPacientePreselected" class="text-xs text-gray-500 mt-1">
          <i class="fas fa-info-circle mr-1"></i>
          Paciente pre-seleccionado desde el perfil
        </p>
              </div>

              <!-- Profesional -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Profesional <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.profesional_id"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.profesional_id.$error }"
                  @blur="v$.profesional_id.$touch"
                  @change="checkDisponibilidad"
                >
                  <option value="">Seleccionar profesional</option>
                  <option 
                    v-for="prof in profesionalesStore.profesionales" 
                    :key="prof.id" 
                    :value="prof.id"
                  >
                    {{ prof.nombre }} {{ prof.apellido }} - {{ prof.especialidad || 'General' }}
                  </option>
                </select>
                <p v-if="v$.profesional_id.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.profesional_id.$errors[0].$message }}
                </p>
              </div>

              <!-- Tratamiento -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tratamiento <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.tratamiento_id"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.tratamiento_id.$error }"
                  @blur="v$.tratamiento_id.$touch"
                  @change="handleTratamientoChange"
                >
                  <option value="">Seleccionar tratamiento</option>
                  <option 
                    v-for="trat in tratamientosStore.tratamientosActivos" 
                    :key="trat.id" 
                    :value="trat.id"
                  >
                    {{ trat.nombre }} - {{ formatPrice(trat.precio) }} - {{ trat.duracion_estimada }}min
                  </option>
                </select>
                <p v-if="v$.tratamiento_id.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.tratamiento_id.$errors[0].$message }}
                </p>
              </div>

              <!-- Fecha -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.fecha"
                  type="date"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.fecha.$error }"
                  :min="minDate"
                  @blur="v$.fecha.$touch"
                  @change="checkDisponibilidad"
                >
                <p v-if="v$.fecha.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.fecha.$errors[0].$message }}
                </p>
              </div>

              <!-- Hora -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Hora <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.hora"
                  type="time"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': v$.hora.$error }"
                  @blur="v$.hora.$touch"
                  @change="checkDisponibilidad"
                >
                <p v-if="v$.hora.$error" class="text-red-500 text-xs mt-1">
                  {{ v$.hora.$errors[0].$message }}
                </p>
              </div>

              <!-- Duración -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos)
                </label>
                <input
                  v-model.number="form.duracion_minutos"
                  type="number"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="30"
                  min="15"
                  step="15"
                  @change="checkDisponibilidad"
                >
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatDuration(form.duracion_minutos) }}
                </p>
              </div>

              <!-- Estado -->
              <div v-if="isEdit">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  v-model="form.estado"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option 
                    v-for="estado in citasStore.estados" 
                    :key="estado.value" 
                    :value="estado.value"
                  >
                    {{ estado.label }}
                  </option>
                </select>
              </div>

              <!-- Notas (Full Width) -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Notas / Observaciones
                </label>
                <textarea
                  v-model="form.notas"
                  rows="3"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notas adicionales sobre la cita..."
                ></textarea>
              </div>

            </div>

            <!-- Disponibilidad Warning -->
            <div v-if="!disponibilidadChecking && !disponible && form.fecha && form.hora && form.profesional_id" 
                 class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p class="text-sm text-yellow-800">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                {{ disponibilidadMessage || 'El horario seleccionado podría tener conflictos' }}
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-sm text-red-700">
                <i class="fas fa-exclamation-circle mr-2"></i>
                {{ errorMessage }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="handleClose"
                :disabled="loading"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading || v$.$invalid"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!loading" class="flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  <span>{{ isEdit ? 'Actualizar' : 'Agendar' }}</span>
                </span>
                <span v-else class="flex items-center gap-2">
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Guardando...</span>
                </span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useCitasStore } from '@/stores/citas'
import { usePacientesStore } from '@/stores/pacientes'
import { useProfesionalesStore } from '@/stores/profesionales'
import { useTratamientosStore } from '@/stores/tratamientos'

const citasStore = useCitasStore()
const pacientesStore = usePacientesStore()
const profesionalesStore = useProfesionalesStore()
const tratamientosStore = useTratamientosStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  cita: {
    type: Object,
    default: null
  },
  pacientePreseleccionado: {
    type: Object,
    default: null
  },
  fechaPreseleccionada: {
    type: String,
    default: null
  },
  horaPreseleccionada: {
    type: String,
    default: null
  },
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

// State
const loading = ref(false)
const errorMessage = ref('')
const disponible = ref(true)
const disponibilidadChecking = ref(false)
const disponibilidadMessage = ref('')

const form = ref({
  paciente_id: '',
  profesional_id: '',
  tratamiento_id: '',
  fecha: '',
  hora: '',
  duracion_minutos: 30,
  notas: '',
  estado: 'pendiente'
})

// Computed
const isEdit = computed(() => !!props.cita)

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})
// ✅ NUEVO: Computed para saber si paciente viene pre-seleccionado
const isPacientePreselected = computed(() => {
  return props.initialData?.paciente_id != null
})
// Validation rules
const rules = {
  paciente_id: { required },
  profesional_id: { required },
  tratamiento_id: { required },
  fecha: { required },
  hora: { required }
}

const v$ = useVuelidate(rules, form)

// Methods
function formatPrice(price) {
  return '$' + new Intl.NumberFormat('es-CL').format(price)
}

function formatDuration(minutes) {
  if (!minutes) return ''
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${mins}m`
  }
}

function handlePacienteChange() {
  // Podrías cargar historial del paciente aquí
}

function handleTratamientoChange() {
  const tratamiento = tratamientosStore.tratamientos.find(t => t.id == form.value.tratamiento_id)
  if (tratamiento && tratamiento.duracion_estimada) {
    form.value.duracion_minutos = tratamiento.duracion_estimada
  }
  checkDisponibilidad()
}

let checkTimeout = null
async function checkDisponibilidad() {
  if (!form.value.fecha || !form.value.hora || !form.value.profesional_id) {
    return
  }

  clearTimeout(checkTimeout)
  checkTimeout = setTimeout(async () => {
    disponibilidadChecking.value = true
    
    const result = await citasStore.checkAvailability(
      form.value.fecha,
      form.value.hora,
      form.value.profesional_id,
      form.value.duracion_minutos,
      props.cita?.id
    )

    disponible.value = result.disponible || false
    disponibilidadMessage.value = result.message || ''
    disponibilidadChecking.value = false
  }, 500)
}

function handleClose() {
  if (!loading.value) {
    emit('update:modelValue', false)
    resetForm()
  }
}

function resetForm() {
  form.value = {
    paciente_id: '',
    profesional_id: '',
    tratamiento_id: '',
    fecha: '',
    hora: '',
    duracion_minutos: 30,
    notas: '',
    estado: 'pendiente'
  }
  errorMessage.value = ''
  disponible.value = true
  disponibilidadMessage.value = ''
  v$.value.$reset()
}

function loadCita() {
  if (props.cita) {
    // Limpiar fecha: extraer solo YYYY-MM-DD
    const fechaLimpia = props.cita.fecha ? props.cita.fecha.split('T')[0] : ''
    
    // Limpiar hora: extraer solo HH:MM
    const horaLimpia = props.cita.hora ? props.cita.hora.substring(0, 5) : ''
    
    form.value = {
      paciente_id: props.cita.paciente_id || '',
      profesional_id: props.cita.profesional_id || '',
      tratamiento_id: props.cita.tratamiento_id || '',
      fecha: fechaLimpia,
      hora: horaLimpia,
      duracion_minutos: props.cita.duracion_minutos || 30,
      notas: props.cita.notas || '',
      estado: props.cita.estado || 'pendiente'
    }
  } else {
    // Preseleccionar datos si vienen del calendario
    if (props.pacientePreseleccionado) {
      form.value.paciente_id = props.pacientePreseleccionado.id
    }
    if (props.fechaPreseleccionada) {
      form.value.fecha = props.fechaPreseleccionada
    }
    if (props.horaPreseleccionada) {
      form.value.hora = props.horaPreseleccionada
    }
  }
}

async function handleSubmit() {
  const isValid = await v$.value.$validate()
  if (!isValid) {
    errorMessage.value = 'Por favor completa todos los campos requeridos'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    let result

    if (isEdit.value) {
      result = await citasStore.updateCita(props.cita.id, form.value)
    } else {
      result = await citasStore.createCita(form.value)
    }

    if (result.success) {
      emit('saved')
      handleClose()
    } else {
      errorMessage.value = result.message || 'Error al guardar la cita'
    }
  } catch (error) {
    errorMessage.value = 'Error inesperado al guardar la cita'
  } finally {
    loading.value = false
  }
}

// Watch for modal open/close
// ✅ MODIFICAR: Watch para aplicar initialData
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.cita) {
      // Modo edición - cargar datos de la cita
      form.value = {
        paciente_id: props.cita.paciente_id,
        profesional_id: props.cita.profesional_id,
        tratamiento_id: props.cita.tratamiento_id,
        fecha: props.cita.fecha,
        hora: props.cita.hora,
        duracion: props.cita.duracion || 30,
        motivo: props.cita.motivo || '',
        notas: props.cita.notas || ''
      }
    } else if (props.initialData) {
      // ✅ NUEVO: Modo creación con datos iniciales
      form.value = {
        paciente_id: props.initialData.paciente_id || null,
        profesional_id: props.initialData.profesional_id || null,
        tratamiento_id: props.initialData.tratamiento_id || null,
        fecha: props.initialData.fecha || '',
        hora: props.initialData.hora || '',
        duracion: props.initialData.duracion || 30,
        motivo: props.initialData.motivo || '',
        notas: props.initialData.notas || ''
      }
    } else {
      // Modo creación - limpiar formulario
      form.value = {
        paciente_id: null,
        profesional_id: null,
        tratamiento_id: null,
        fecha: '',
        hora: '',
        duracion: 30,
        motivo: '',
        notas: ''
      }
    }
  }
})

// Load initial data
onMounted(async () => {
  if (pacientesStore.pacientes.length === 0) {
    await pacientesStore.fetchPacientes()
  }
  if (profesionalesStore.profesionales.length === 0) {
    await profesionalesStore.fetchProfesionales()
  }
  if (tratamientosStore.tratamientos.length === 0) {
    await tratamientosStore.fetchTratamientos()
  }
})

if (props.modelValue && (props.cita || props.pacientePreseleccionado)) {
  loadCita()
}
</script>