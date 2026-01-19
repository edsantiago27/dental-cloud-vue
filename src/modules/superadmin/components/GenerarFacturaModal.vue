<!-- components/superadmin/GenerarFacturaModal.vue -->
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
            <i class="fas fa-file-invoice text-blue-600 mr-2"></i>
            Generar Factura
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
          
          <form @submit.prevent="handleSubmit">
            
            <!-- Suscripción -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Suscripción *
              </label>
              <select
                v-model="form.suscripcion_id"
                required
                @change="cargarDatosSuscripcion"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar suscripción...</option>
                <option v-for="suscripcion in suscripcionesActivas" :key="suscripcion.id" :value="suscripcion.id">
                  {{ suscripcion.clinica?.nombre }} - {{ suscripcion.plan?.nombre }}
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                Solo se muestran suscripciones activas
              </p>
            </div>

            <!-- Info de la suscripción seleccionada -->
            <div v-if="suscripcionSeleccionada" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Plan:</span>
                  <span class="font-medium">{{ suscripcionSeleccionada.plan?.nombre }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Tipo:</span>
                  <span class="font-medium capitalize">{{ suscripcionSeleccionada.tipo }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Monto:</span>
                  <span class="font-bold text-blue-600">{{ formatMoney(suscripcionSeleccionada.monto) }}</span>
                </div>
              </div>
            </div>

            <!-- Fecha de Emisión -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Emisión
              </label>
              <input
                v-model="form.fecha_emision"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Fecha de Vencimiento -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento
              </label>
              <input
                v-model="form.fecha_vencimiento"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <!-- Notas -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                v-model="form.notas"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observaciones adicionales..."
              ></textarea>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
            :disabled="loading || !form.suscripcion_id"
            class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-file-invoice mr-2"></i>
            Generar Factura
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSuperAdminFacturacionStore } from '@superadmin/stores/facturacion'
import { suscripcionesService } from '@superadmin/services'

const emit = defineEmits(['close', 'saved'])

const facturacionStore = useSuperAdminFacturacionStore()

const form = ref({
  suscripcion_id: '',
  fecha_emision: new Date().toISOString().split('T')[0],
  fecha_vencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +15 días
  notas: ''
})

const suscripcionesActivas = ref([])
const suscripcionSeleccionada = ref(null)
const loading = ref(false)
const errorMessage = ref('')

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}

async function cargarSuscripcionesActivas() {
  try {
    const response = await suscripcionesService.getSuscripciones({ estado: 'activa' })
    if (response.success && response.data) {
      suscripcionesActivas.value = response.data.data || response.data
    }
  } catch (error) {
    console.error('Error loading suscripciones:', error)
  }
}

function cargarDatosSuscripcion() {
  const suscripcion = suscripcionesActivas.value.find(s => s.id == form.value.suscripcion_id)
  if (suscripcion) {
    suscripcionSeleccionada.value = suscripcion
  }
}

async function handleSubmit() {
  if (!form.value.suscripcion_id) {
    errorMessage.value = 'Debes seleccionar una suscripción'
    return
  }

  errorMessage.value = ''
  loading.value = true

  try {
    const result = await facturacionStore.generarFactura(form.value)

    if (result.success) {
      emit('saved')
    } else {
      errorMessage.value = result.message || 'Error al generar factura'
    }
  } catch (error) {
    console.error('Error generating factura:', error)
    errorMessage.value = 'Error al procesar la solicitud'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarSuscripcionesActivas()
})
</script>