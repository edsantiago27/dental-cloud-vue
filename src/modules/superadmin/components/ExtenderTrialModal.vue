<!-- components/superadmin/ExtenderTrialModal.vue -->
<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            <i class="fas fa-clock text-blue-600 mr-2"></i>
            Extender Trial
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
          
          <!-- Info de la clínica -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center gap-3 mb-2">
              <i class="fas fa-hospital text-blue-600"></i>
              <div>
                <p class="font-medium text-gray-900">{{ suscripcion.clinica?.nombre }}</p>
                <p class="text-sm text-gray-500">{{ suscripcion.plan?.nombre }}</p>
              </div>
            </div>
            
            <div class="mt-3 pt-3 border-t border-blue-200 space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Fecha inicio:</span>
                <span class="font-medium">{{ formatDate(suscripcion.fecha_inicio) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Fecha fin actual:</span>
                <span class="font-medium">{{ formatDate(suscripcion.fecha_fin) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Días restantes:</span>
                <span class="font-medium text-orange-600">{{ suscripcion.dias_restantes || 0 }} días</span>
              </div>
            </div>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="handleSubmit">
            
            <!-- Selector de días -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Días a extender *
              </label>
              
              <!-- Opciones rápidas -->
              <div class="grid grid-cols-4 gap-2 mb-3">
                <button
                  v-for="opcion in [3, 7, 14, 30]"
                  :key="opcion"
                  type="button"
                  @click="diasExtender = opcion"
                  class="px-3 py-2 border rounded-lg transition text-sm font-medium"
                  :class="diasExtender === opcion
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:border-blue-400'
                  "
                >
                  {{ opcion }}d
                </button>
              </div>

              <!-- Input personalizado -->
              <div class="relative">
                <input
                  v-model.number="diasExtender"
                  type="number"
                  min="1"
                  max="90"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="O ingresa días personalizados"
                >
                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">días</span>
              </div>

              <p class="mt-2 text-xs text-gray-500">
                <i class="fas fa-info-circle mr-1"></i>
                Máximo 90 días por extensión
              </p>
            </div>

            <!-- Vista previa de nueva fecha -->
            <div v-if="diasExtender > 0" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start gap-3">
                <i class="fas fa-calendar-check text-green-600 mt-1"></i>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 mb-1">Nueva fecha de vencimiento:</p>
                  <p class="text-lg font-bold text-green-600">{{ calcularNuevaFecha() }}</p>
                  <p class="text-xs text-gray-600 mt-1">
                    Total: {{ (suscripcion.dias_restantes || 0) + diasExtender }} días de trial
                  </p>
                </div>
              </div>
            </div>

            <!-- Motivo (opcional) -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Motivo (opcional)
              </label>
              <textarea
                v-model="motivo"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Cliente solicitó más tiempo para evaluar..."
              ></textarea>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center gap-2 text-red-800">
                <i class="fas fa-exclamation-circle"></i>
                <span class="text-sm">{{ errorMessage }}</span>
              </div>
            </div>

          </form>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            @click="handleSubmit"
            :disabled="loading || diasExtender <= 0"
            class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-clock mr-2"></i>
            Extender Trial
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSuperAdminSuscripcionesStore } from '@superadmin/stores/suscripciones'

const props = defineProps({
  suscripcion: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

const suscripcionesStore = useSuperAdminSuscripcionesStore()

const diasExtender = ref(7) // Default 7 días
const motivo = ref('')
const loading = ref(false)
const errorMessage = ref('')

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function calcularNuevaFecha() {
  if (!props.suscripcion.fecha_fin || diasExtender.value <= 0) return '-'
  
  const fechaActual = new Date(props.suscripcion.fecha_fin)
  const nuevaFecha = new Date(fechaActual.getTime() + diasExtender.value * 24 * 60 * 60 * 1000)
  
  return formatDate(nuevaFecha)
}

async function handleSubmit() {
  if (diasExtender.value <= 0) {
    errorMessage.value = 'Debes ingresar al menos 1 día'
    return
  }

  if (diasExtender.value > 90) {
    errorMessage.value = 'El máximo es 90 días por extensión'
    return
  }

  errorMessage.value = ''
  loading.value = true

  try {
    const result = await suscripcionesStore.extenderTrial(props.suscripcion.id, diasExtender.value)

    if (result.success) {
      emit('saved')
    } else {
      errorMessage.value = result.message || 'Error al extender trial'
    }
  } catch (error) {
    console.error('Error extending trial:', error)
    errorMessage.value = 'Error al procesar la solicitud'
  } finally {
    loading.value = false
  }
}
</script>