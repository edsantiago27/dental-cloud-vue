<!-- components/facturacion/CrearCuentaModal.vue -->
<template>
  <!-- Backdrop -->
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="handleClose"
    ></div>
  </transition>

  <!-- Modal -->
  <transition name="slide-up">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">
                <i class="fas fa-file-invoice mr-2"></i>
                Nueva Cuenta por Cobrar
              </h3>
              <button
                @click="handleClose"
                :disabled="saving"
                class="text-white hover:text-gray-200 transition disabled:opacity-50"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="p-6">
            
            <!-- Paciente -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Paciente <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.paciente_id"
                required
                :disabled="saving || pacienteIdProp"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Seleccionar paciente...</option>
                <option v-for="paciente in pacientes" :key="paciente.id" :value="paciente.id">
                  {{ paciente.nombre }} {{ paciente.apellido }}
                </option>
              </select>
            </div>

            <!-- Concepto -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Concepto <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.concepto"
                type="text"
                required
                :disabled="saving"
                placeholder="Ej: Tratamiento de ortodoncia"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
            </div>

            <!-- Tratamiento (Opcional) -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tratamiento
                <span class="text-xs text-gray-500">(Opcional)</span>
              </label>
              <select
                v-model="form.tratamiento_id"
                :disabled="saving"
                @change="onTratamientoChange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option :value="null">Sin tratamiento específico</option>
                <option v-for="tratamiento in tratamientos" :key="tratamiento.id" :value="tratamiento.id">
                  {{ tratamiento.nombre }} - {{ formatMonto(tratamiento.precio) }}
                </option>
              </select>
              <p v-if="tratamientoSeleccionado" class="text-xs text-green-600 mt-1">
                <i class="fas fa-check-circle mr-1"></i>
                Precio del tratamiento: {{ formatMonto(tratamientoSeleccionado.precio) }}
              </p>
            </div>

            <!-- Monto -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Monto Total <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-2.5 text-gray-500">$</span>
                <input
                  v-model.number="form.total"
                  type="number"
                  required
                  min="0"
                  step="1"
                  :disabled="saving"
                  placeholder="0"
                  class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ formatMonto(form.total) }}</p>
            </div>

            <!-- Fecha Tratamiento -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Tratamiento
              </label>
              <input
                v-model="form.fecha_tratamiento"
                type="date"
                :disabled="saving"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
            </div>

            <!-- Notas -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                v-model="form.notas"
                rows="3"
                :disabled="saving"
                placeholder="Detalles del tratamiento, observaciones..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>

            <!-- Vincular con Cita (Opcional) -->
            <div v-if="citaId" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="fas fa-calendar-check text-blue-600"></i>
                <p class="text-sm text-blue-800">
                  <strong>Vinculado a cita:</strong> {{ citaInfo }}
                </p>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-800 font-semibold mb-2">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Error al crear cuenta
              </p>
              <pre class="text-xs text-red-700 whitespace-pre-wrap font-mono">{{ errorMessage }}</pre>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="handleClose"
                :disabled="saving"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="!isFormValid || saving"
                class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
              >
                <span v-if="!saving" class="flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  <span>Crear Cuenta</span>
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
import { useFacturacionStore } from '@clinica/stores/facturacion'
import { usePacientesStore } from '@clinica/stores/pacientes'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  pacienteId: {
    type: Number,
    default: null
  },
  citaId: {
    type: Number,
    default: null
  },
  citaInfo: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'created'])

const facturacionStore = useFacturacionStore()
const pacientesStore = usePacientesStore()

// Importar store de tratamientos
import { useTratamientosStore } from '@clinica/stores/tratamientos'
const tratamientosStore = useTratamientosStore()

// State
const saving = ref(false)
const errorMessage = ref('')
const pacientes = ref([])
const tratamientos = ref([])

const form = ref({
  paciente_id: props.pacienteId || '',
  concepto: '',
  descripcion: '',
  diente: '',
  total: 0,
  tratamiento_id: null,
  profesional_id: null,
  fecha_tratamiento: new Date().toISOString().split('T')[0],
  notas: ''
})

// Computed
const pacienteIdProp = computed(() => props.pacienteId)

const tratamientoSeleccionado = computed(() => {
  if (!form.value.tratamiento_id) return null
  return tratamientos.value.find(t => t.id === form.value.tratamiento_id)
})

const isFormValid = computed(() => {
  return form.value.paciente_id &&
         form.value.concepto &&
         form.value.total > 0
})

// Methods
async function loadPacientes() {
  try {
    const response = await pacientesStore.fetchPacientes()
    
    // Manejar diferentes formatos de respuesta
    if (response.success) {
      // Si viene paginado
      if (response.data?.data) {
        pacientes.value = response.data.data
      } 
      // Si viene directo
      else if (Array.isArray(response.data)) {
        pacientes.value = response.data
      }
      // Si viene en el store directamente
      else if (pacientesStore.pacientes) {
        pacientes.value = pacientesStore.pacientes
      }
    }
    // Si no hay success pero hay datos en el store
    else if (pacientesStore.pacientes && pacientesStore.pacientes.length > 0) {
      pacientes.value = pacientesStore.pacientes
    }
    
    console.log('Pacientes cargados:', pacientes.value.length)
  } catch (error) {
    console.error('Error al cargar pacientes:', error)
    errorMessage.value = 'Error al cargar lista de pacientes'
  }
}

async function loadTratamientos() {
  try {
    const response = await tratamientosStore.fetchTratamientos()
    
    if (response.success) {
      if (response.data?.data) {
        tratamientos.value = response.data.data
      } else if (Array.isArray(response.data)) {
        tratamientos.value = response.data
      } else if (tratamientosStore.tratamientos) {
        tratamientos.value = tratamientosStore.tratamientos
      }
    } else if (tratamientosStore.tratamientos && tratamientosStore.tratamientos.length > 0) {
      tratamientos.value = tratamientosStore.tratamientos
    }
    
    console.log('Tratamientos cargados:', tratamientos.value.length)
  } catch (error) {
    console.error('Error al cargar tratamientos:', error)
    // No es crítico, continuar sin tratamientos
  }
}

function onTratamientoChange() {
  if (tratamientoSeleccionado.value) {
    // Auto-llenar concepto y precio desde tratamiento
    if (!form.value.concepto) {
      form.value.concepto = tratamientoSeleccionado.value.nombre
    }
    form.value.total = parseFloat(tratamientoSeleccionado.value.precio || 0)
    
    console.log('Tratamiento seleccionado:', tratamientoSeleccionado.value.nombre)
    console.log('Precio auto-llenado:', form.value.total)
  }
}

async function handleSubmit() {
  if (!isFormValid.value) return

  saving.value = true
  errorMessage.value = ''

  try {
    // Preparar datos según backend real
    const payload = {
      paciente_id: form.value.paciente_id,
      concepto: form.value.concepto,
      descripcion: form.value.descripcion || null,
      diente: form.value.diente || null,
      cantidad: 1,
      precio_unitario: form.value.total,
      descuento: 0,
      tratamiento_id: form.value.tratamiento_id || null,
      profesional_id: form.value.profesional_id || null,
      fecha_tratamiento: form.value.fecha_tratamiento || new Date().toISOString().split('T')[0],
      notas: form.value.notas || null
    }

    console.group('📤 CREAR CUENTA - PAYLOAD')
    console.log('Payload completo:', payload)
    console.groupEnd()

    const response = await facturacionStore.crearCuenta(payload)

    console.group('📥 RESPUESTA DEL SERVIDOR')
    console.log('Response completo:', response)
    console.log('Success:', response.success)
    console.log('Message:', response.message)
    console.log('Errors:', response.errors)
    console.groupEnd()

    if (response.success) {
      emit('created', response.data)
      handleClose()
      resetForm()
    } else {
      // Mostrar errores específicos del backend
      if (response.errors) {
        const errores = Object.entries(response.errors)
          .map(([campo, mensajes]) => `• ${campo}: ${mensajes.join(', ')}`)
          .join('\n')
        errorMessage.value = errores
        console.error('❌ Errores de validación:', response.errors)
      } else {
        errorMessage.value = response.message || 'Error al crear cuenta'
      }
    }
  } catch (error) {
    console.error('❌ Error completo:', error)
    console.error('❌ Error response:', error.response?.data)
    
    if (error.response?.data?.errors) {
      const errores = Object.entries(error.response.data.errors)
        .map(([campo, mensajes]) => `${campo}: ${mensajes.join(', ')}`)
        .join('\n')
      errorMessage.value = `Errores:\n${errores}`
    } else {
      errorMessage.value = error.response?.data?.message || error.message || 'Error al crear cuenta'
    }
  } finally {
    saving.value = false
  }
}

function handleClose() {
  if (!saving.value) {
    emit('update:modelValue', false)
    setTimeout(() => {
      resetForm()
      errorMessage.value = ''
    }, 300)
  }
}

function resetForm() {
  form.value = {
    paciente_id: props.pacienteId || '',
    concepto: '',
    descripcion: '',
    diente: '',
    total: 0,
    tratamiento_id: null,
    profesional_id: null,
    fecha_tratamiento: new Date().toISOString().split('T')[0],
    notas: ''
  }
}

function formatMonto(valor) {
  if (!valor) return '$0'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor)
}

// Watch
watch(() => props.modelValue, (newVal) => {
  if (newVal && pacientes.value.length === 0) {
    loadPacientes()
    loadTratamientos()
  }
})

watch(() => props.pacienteId, (newVal) => {
  if (newVal) {
    form.value.paciente_id = newVal
  }
})

// Lifecycle
onMounted(() => {
  if (props.modelValue) {
    loadPacientes()
    loadTratamientos()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>