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
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          
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
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <form @submit.prevent="handleSubmit" class="p-6">
            
            <!-- Tipo y Fecha -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <!-- Tipo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Entrada <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.tipo"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option value="consulta">Consulta</option>
                  <option value="diagnostico">Diagnóstico</option>
                  <option value="tratamiento">Tratamiento</option>
                  <option value="control">Control</option>
                  <option value="emergencia">Emergencia</option>
                </select>
              </div>

              <!-- Fecha -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.fecha_consulta"
                  type="date"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
            </div>

            <!-- Título (Opcional) -->
            <div class="mb-6">
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

            <!-- Profesional y Tratamiento -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <!-- Profesional -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Profesional <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.profesional_id"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option 
                    v-for="prof in profesionalesStore.profesionales" 
                    :key="prof.id" 
                    :value="prof.id"
                  >
                    {{ prof.nombre }} {{ prof.apellido }}
                  </option>
                </select>
              </div>

              <!-- Tratamiento (Opcional) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tratamiento
                </label>
                <select
                  v-model="form.tratamiento_id"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option :value="null">Ninguno</option>
                  <option 
                    v-for="trat in tratamientosStore.tratamientos" 
                    :key="trat.id" 
                    :value="trat.id"
                  >
                    {{ trat.nombre }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Dientes Relacionados -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dientes/Piezas Relacionadas
              </label>
              <input
                v-model="dientesInput"
                type="text"
                placeholder="Ej: 16, 17, 18 (separados por coma)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <p class="text-xs text-gray-500 mt-1">Números de dientes separados por comas</p>
            </div>

            <!-- Diagnóstico -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Diagnóstico / Motivo
              </label>
              <textarea
                v-model="form.diagnostico"
                rows="3"
                placeholder="Descripción del diagnóstico o motivo de la consulta..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- Tratamiento Realizado -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Procedimiento / Tratamiento Realizado
              </label>
              <textarea
                v-model="form.tratamiento_realizado"
                rows="4"
                placeholder="Detalle del procedimiento realizado..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- Observaciones -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                v-model="form.observaciones"
                rows="3"
                placeholder="Observaciones adicionales, indicaciones, etc..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- Costo -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Costo del Procedimiento
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">$</span>
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

            <!-- Próxima Cita -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Próxima Cita Sugerida
              </label>
              <input
                v-model="form.proxima_cita"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errorMessage }}</p>
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
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                <span v-if="!loading" class="flex items-center gap-2">
                  <i class="fas fa-save"></i>
                  <span>{{ isEdit ? 'Actualizar' : 'Guardar' }}</span>
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
import { ref, computed, watch } from 'vue'
import { useHistoriaClinicaStore } from '@clinica/stores/historiaClinica'
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useTratamientosStore } from '@clinica/stores/tratamientos'
import historiaClinicaService from '@clinica/services/historiaClinicaService'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  pacienteId: {
    type: Number,
    required: true
  },
  entrada: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const historiaStore = useHistoriaClinicaStore()
const profesionalesStore = useProfesionalesStore()
const tratamientosStore = useTratamientosStore()

const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  tipo: '',
  fecha_consulta: new Date().toISOString().split('T')[0],
  titulo: '',
  profesional_id: '',
  tratamiento_id: null,
  dientes_relacionados: [],
  diagnostico: '',
  tratamiento_realizado: '',
  observaciones: '',
  costo: null,
  proxima_cita: null
})

const dientesInput = ref('')

// Computed
const isEdit = computed(() => !!props.entrada)

// Methods
function handleClose() {
  if (!loading.value) {
    emit('update:modelValue', false)
    resetForm()
  }
}

function resetForm() {
  form.value = {
    tipo: '',
    fecha_consulta: new Date().toISOString().split('T')[0],
    titulo: '',
    profesional_id: '',
    tratamiento_id: null,
    dientes_relacionados: [],
    diagnostico: '',
    tratamiento_realizado: '',
    observaciones: '',
    costo: null,
    proxima_cita: null
  }
  dientesInput.value = ''
  errorMessage.value = ''
}

function loadEntrada() {
  if (props.entrada) {
    form.value = {
      tipo: props.entrada.tipo || '',
      fecha_consulta: props.entrada.fecha_consulta || '',
      titulo: props.entrada.titulo || '',
      profesional_id: props.entrada.profesional_id || '',
      tratamiento_id: props.entrada.tratamiento_id || null,
      dientes_relacionados: props.entrada.dientes_relacionados || [],
      diagnostico: props.entrada.diagnostico || '',
      tratamiento_realizado: props.entrada.tratamiento_realizado || '',
      observaciones: props.entrada.observaciones || '',
      costo: props.entrada.costo || null,
      proxima_cita: props.entrada.proxima_cita || null
    }
    
    if (props.entrada.dientes_relacionados) {
      dientesInput.value = props.entrada.dientes_relacionados.join(', ')
    }
  }
}

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    // Procesar dientes
    if (dientesInput.value) {
      form.value.dientes_relacionados = dientesInput.value
        .split(',')
        .map(d => parseInt(d.trim()))
        .filter(d => !isNaN(d))
    } else {
      form.value.dientes_relacionados = []
    }

    let response

    if (isEdit.value) {
      // Actualizar
      response = await historiaClinicaService.updateEntrada(
        props.pacienteId,
        props.entrada.id,
        form.value
      )
    } else {
      // Crear
      response = await historiaClinicaService.storeEntrada(
        props.pacienteId,
        form.value
      )
    }

    if (response.success) {
      emit('saved', response.data)
      handleClose()
    } else {
      errorMessage.value = response.message || 'Error al guardar entrada'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al guardar entrada'
  } finally {
    loading.value = false
  }
}

// Watch
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadEntrada()
  }
})

watch(() => props.entrada, () => {
  if (props.modelValue) {
    loadEntrada()
  }
})
</script>