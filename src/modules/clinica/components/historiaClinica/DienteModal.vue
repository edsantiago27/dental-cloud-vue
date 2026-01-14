<!-- components/historiaClinica/DienteModal.vue -->
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
      v-if="modelValue && diente"
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
      v-if="modelValue && diente"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-white">
                  <i class="fas fa-tooth mr-2"></i>
                  Pieza Dental {{ form.numero }}
                </h3>
                <p class="text-blue-100 text-sm mt-1">
                  {{ getNombreDiente(form.numero) }}
                </p>
              </div>
              <button
                @click="handleClose"
                class="text-white hover:text-gray-200 transition"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <form @submit.prevent="handleSave" class="p-6">
            
            <!-- Estado Actual -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Estado del Diente
              </label>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div
                  v-for="estado in historiaStore.estadosDiente"
                  :key="estado.value"
                  class="relative cursor-pointer"
                  @click="form.estado = estado.value"
                >
                  <input
                    type="radio"
                    :id="estado.value"
                    :value="estado.value"
                    v-model="form.estado"
                    class="hidden"
                  >
                  <label
                    :for="estado.value"
                    class="flex flex-col items-center p-3 border-2 rounded-lg transition-all cursor-pointer"
                    :class="form.estado === estado.value 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'"
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      :style="{ backgroundColor: estado.color }"
                    >
                      <i :class="estado.icon" class="text-lg"></i>
                    </div>
                    <span class="text-xs font-medium text-center">{{ estado.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Notas -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notas / Observaciones
              </label>
              <textarea
                v-model="form.notas"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Caries oclusal profunda, requiere endodoncia..."
              ></textarea>
            </div>

            <!-- Información del Estado Seleccionado -->
            <div v-if="estadoSeleccionadoInfo" class="mb-6 p-4 bg-blue-50 rounded-lg">
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: estadoSeleccionadoInfo.color }"
                >
                  <i :class="estadoSeleccionadoInfo.icon" class="text-lg"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ estadoSeleccionadoInfo.label }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ getDescripcionEstado(form.estado) }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="handleClose"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <i class="fas fa-save mr-2"></i>
                Guardar
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
import { useHistoriaClinicaStore } from '../stores/historiaClinica'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  diente: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const historiaStore = useHistoriaClinicaStore()

const form = ref({
  numero: null,
  estado: 'sano',
  notas: ''
})

// Computed
const estadoSeleccionadoInfo = computed(() => {
  return historiaStore.estadosDiente.find(e => e.value === form.value.estado)
})

// Methods
function handleClose() {
  emit('update:modelValue', false)
}

function handleSave() {
  console.group('💾 DienteModal - Guardar')
  console.log('Form completo:', form.value)
  console.log('Estado (tipo):', typeof form.value.estado)
  console.log('Estado (valor):', form.value.estado)
  console.groupEnd()
  
  // Asegurar que estado sea string
  const dataToSave = {
    numero: form.value.numero,
    estado: String(form.value.estado),  // Forzar string
    notas: form.value.notas || ''
  }
  
  console.log('🚀 Emitiendo save con:', dataToSave)
  emit('save', dataToSave)
  handleClose()
}

function loadDiente() {
  if (props.diente) {
    form.value = {
      numero: props.diente.numero,
      estado: props.diente.estado || 'sano',
      notas: props.diente.notas || ''
    }
  }
}

function getNombreDiente(numero) {
  const nombres = {
    // Superior Derecha
    18: 'Tercer Molar Superior Derecho',
    17: 'Segundo Molar Superior Derecho',
    16: 'Primer Molar Superior Derecho',
    15: 'Segundo Premolar Superior Derecho',
    14: 'Primer Premolar Superior Derecho',
    13: 'Canino Superior Derecho',
    12: 'Incisivo Lateral Superior Derecho',
    11: 'Incisivo Central Superior Derecho',
    // Superior Izquierda
    21: 'Incisivo Central Superior Izquierdo',
    22: 'Incisivo Lateral Superior Izquierdo',
    23: 'Canino Superior Izquierdo',
    24: 'Primer Premolar Superior Izquierdo',
    25: 'Segundo Premolar Superior Izquierdo',
    26: 'Primer Molar Superior Izquierdo',
    27: 'Segundo Molar Superior Izquierdo',
    28: 'Tercer Molar Superior Izquierdo',
    // Inferior Derecha
    48: 'Tercer Molar Inferior Derecho',
    47: 'Segundo Molar Inferior Derecho',
    46: 'Primer Molar Inferior Derecho',
    45: 'Segundo Premolar Inferior Derecho',
    44: 'Primer Premolar Inferior Derecho',
    43: 'Canino Inferior Derecho',
    42: 'Incisivo Lateral Inferior Derecho',
    41: 'Incisivo Central Inferior Derecho',
    // Inferior Izquierda
    31: 'Incisivo Central Inferior Izquierdo',
    32: 'Incisivo Lateral Inferior Izquierdo',
    33: 'Canino Inferior Izquierdo',
    34: 'Primer Premolar Inferior Izquierdo',
    35: 'Segundo Premolar Inferior Izquierdo',
    36: 'Primer Molar Inferior Izquierdo',
    37: 'Segundo Molar Inferior Izquierdo',
    38: 'Tercer Molar Inferior Izquierdo'
  }
  
  return nombres[numero] || `Pieza ${numero}`
}

function getDescripcionEstado(estado) {
  const descripciones = {
    sano: 'Diente en buen estado, sin tratamientos ni problemas aparentes.',
    caries: 'Deterioro del esmalte dental causado por ácidos bacterianos.',
    obturacion: 'Diente restaurado con material de relleno (amalgama, resina, etc.).',
    endodoncia: 'Tratamiento de conducto radicular realizado.',
    corona: 'Diente cubierto con prótesis fija (corona dental).',
    puente: 'Diente conectado a otros mediante prótesis fija.',
    implante: 'Raíz artificial de titanio con corona protésica.',
    ausente: 'Diente faltante o extraído.',
    fractura: 'Diente con rotura o fisura estructural.',
    protesis: 'Diente artificial removible.'
  }
  
  return descripciones[estado] || ''
}

// Watch
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadDiente()
  }
})

watch(() => props.diente, () => {
  if (props.modelValue) {
    loadDiente()
  }
})
</script>