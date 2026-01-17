<!-- components/historiaClinica/EntradaModal.vue -->
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
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">
                <i class="fas fa-file-medical mr-2"></i>
                {{ isEdit ? 'Editar Entrada' : 'Nueva Entrada Clínica' }}
              </h3>
              <button
                @click="handleClose"
                class="text-white hover:text-gray-200 transition"
                type="button"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <form @submit.prevent="handleSubmit" class="p-6">

            <!-- Sección 1: Información Básica -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-info-circle text-blue-600 mr-2"></i>
                Información Básica
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Tipo -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tipo <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="form.tipo"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar...</option>
                    <option
                      v-for="(tipo, key) in TIPOS_ENTRADA"
                      :key="key"
                      :value="key"
                    >
                      {{ tipo.icon }} {{ tipo.label }}
                    </option>
                  </select>
                </div>

                <!-- Título (Opcional) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Título (Opcional)
                  </label>
                  <input
                    v-model="form.titulo"
                    type="text"
                    placeholder="Ej: Control post operatorio"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <!-- Profesional -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Profesional
                  </label>
                  <select
                    v-model="form.profesional_id"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option :value="null">Sin asignar</option>
                    <option
                      v-for="prof in profesionalesStore.profesionales"
                      :key="prof.id"
                      :value="prof.id"
                    >
                      Dr. {{ prof.nombre }} {{ prof.apellido }}
                    </option>
                  </select>
                </div>

                <!-- Tratamiento -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tratamiento
                  </label>
                  <select
                    v-model="form.tratamiento_id"
                    @change="handleTratamientoChange"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option :value="null">Sin asignar</option>
                    <option
                      v-for="trat in tratamientosStore.tratamientos"
                      :key="trat.id"
                      :value="trat.id"
                    >
                      {{ trat.nombre }} - ${{ formatearMoneda(trat.precio) }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Costo -->
              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Costo del Procedimiento
                </label>
                <div class="relative max-w-xs">
                  <span class="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    v-model="form.costo"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
              </div>
            </div>

            <!-- Sección 2: Dientes Tratados -->
            <div class="mb-8" v-if="form.tipo === 'tratamiento' || form.tipo === 'procedimiento'">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-tooth text-blue-600 mr-2"></i>
                Dientes Tratados
              </h3>
              
              <SelectorDientes
                v-model="form.dientes_tratados"
                :multiple="true"
              />
            </div>

            <!-- Sección 3: Detalles Clínicos -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i class="fas fa-file-medical-alt text-blue-600 mr-2"></i>
                Detalles Clínicos
              </h3>

              <!-- Descripción (REQUERIDO) -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Descripción <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="form.descripcion"
                  rows="3"
                  required
                  placeholder="Descripción general de la consulta/procedimiento (REQUERIDO)..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <!-- Hallazgos -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Hallazgos
                </label>
                <textarea
                  v-model="form.hallazgos"
                  rows="2"
                  placeholder="Hallazgos encontrados durante la revisión..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <!-- Diagnóstico -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Diagnóstico
                </label>
                <textarea
                  v-model="form.diagnostico"
                  rows="2"
                  placeholder="Diagnóstico clínico..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <!-- Tratamiento Realizado -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tratamiento Realizado
                </label>
                <textarea
                  v-model="form.tratamiento_realizado"
                  rows="3"
                  placeholder="Descripción detallada del procedimiento realizado..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <!-- Indicaciones -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Indicaciones
                </label>
                <textarea
                  v-model="form.indicaciones"
                  rows="2"
                  placeholder="Indicaciones post-tratamiento, cuidados, recomendaciones..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start">
                <i class="fas fa-exclamation-circle text-red-500 mt-0.5 mr-2"></i>
                <p class="text-sm text-red-600">{{ errorMessage }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
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
                :disabled="loading"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-save"></i>
                <span>{{ isEdit ? 'Guardar Cambios' : 'Registrar Entrada' }}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useHistoriaClinicaStore } from '@clinica/stores/historiaClinica'
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useTratamientosStore } from '@clinica/stores/tratamientos'
import { useNotification } from '@shared/composables/useNotification'
import SelectorDientes from './SelectorDientes.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  pacienteId: {
    type: [Number, String],
    required: true
  },
  entrada: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

// Stores
const historiaStore = useHistoriaClinicaStore()
const profesionalesStore = useProfesionalesStore()
const tratamientosStore = useTratamientosStore()
const notify = useNotification()

// State
const loading = ref(false)
const errorMessage = ref('')

// Constantes - Tipos válidos según backend
const TIPOS_ENTRADA = {
  consulta: { label: 'Consulta', icon: '🩺' },
  diagnostico: { label: 'Diagnóstico', icon: '🔍' },
  tratamiento: { label: 'Tratamiento', icon: '🦷' },
  procedimiento: { label: 'Procedimiento', icon: '⚕️' },
  evolucion: { label: 'Evolución', icon: '📈' },
  receta: { label: 'Receta', icon: '💊' },
  interconsulta: { label: 'Interconsulta', icon: '🤝' },
  urgencia: { label: 'Urgencia', icon: '🚨' },
  control: { label: 'Control', icon: '📋' },
  otro: { label: 'Otro', icon: '📝' }
}

// Form - Campos que espera el backend
const form = ref({
  tipo: 'consulta',
  titulo: '',
  descripcion: '', // REQUERIDO
  profesional_id: null,
  tratamiento_id: null,
  hallazgos: '',
  diagnostico: '',
  tratamiento_realizado: '',
  indicaciones: '',
  dientes_tratados: [],
  costo: null
})

// Computed
const isEdit = computed(() => !!props.entrada)

// Methods
function formatearMoneda(valor) {
  if (!valor) return '0'
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0
  }).format(valor)
}

function handleTratamientoChange() {
  const tratamiento = tratamientosStore.tratamientos.find(
    t => t.id === form.value.tratamiento_id
  )
  if (tratamiento && !form.value.costo) {
    form.value.costo = tratamiento.precio
  }
}

function handleClose() {
  if (!loading.value) {
    emit('update:modelValue', false)
    resetForm()
  }
}

function resetForm() {
  form.value = {
    tipo: 'consulta',
    titulo: '',
    descripcion: '',
    profesional_id: null,
    tratamiento_id: null,
    hallazgos: '',
    diagnostico: '',
    tratamiento_realizado: '',
    indicaciones: '',
    dientes_tratados: [],
    costo: null
  }
  errorMessage.value = ''
}

function loadEntrada() {
  if (props.entrada) {
    form.value = {
      tipo: props.entrada.tipo || 'consulta',
      titulo: props.entrada.titulo || '',
      descripcion: props.entrada.descripcion || '',
      profesional_id: props.entrada.profesional_id || null,
      tratamiento_id: props.entrada.tratamiento_id || null,
      hallazgos: props.entrada.hallazgos || '',
      diagnostico: props.entrada.diagnostico || '',
      tratamiento_realizado: props.entrada.tratamiento_realizado || '',
      indicaciones: props.entrada.indicaciones || '',
      dientes_tratados: props.entrada.dientes_tratados || [],
      costo: props.entrada.costo || null
    }
  }
}

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    let response

    if (isEdit.value) {
      response = await historiaStore.updateTratamiento(
        props.pacienteId,
        props.entrada.id,
        form.value
      )
    } else {
      response = await historiaStore.registrarTratamiento(
        props.pacienteId,
        form.value
      )
    }

    if (response.success) {
      notify.success(isEdit.value ? 'Entrada actualizada correctamente' : 'Entrada registrada correctamente')
      emit('saved', response.data)
      handleClose()
    } else {
      errorMessage.value = response.message || 'Error al guardar entrada'
      notify.error(errorMessage.value)
    }
  } catch (error) {
    console.error('Error al guardar entrada:', error)
    errorMessage.value = error.message || 'Error inesperado al guardar'
    notify.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadEntrada()
    
    // Cargar profesionales y tratamientos si no están cargados
    if (profesionalesStore.profesionales.length === 0) {
      profesionalesStore.fetchProfesionales()
    }
    if (tratamientosStore.tratamientos.length === 0) {
      tratamientosStore.fetchTratamientos()
    }
  }
})

watch(() => props.entrada, () => {
  if (props.modelValue) {
    loadEntrada()
  }
})
</script>