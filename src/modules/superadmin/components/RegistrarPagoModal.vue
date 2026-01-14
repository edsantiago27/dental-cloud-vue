<!-- components/superadmin/RegistrarPagoModal.vue -->
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
            <i class="fas fa-dollar-sign text-green-600 mr-2"></i>
            Registrar Pago
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
          
          <!-- Info de la factura -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center gap-3 mb-3">
              <i class="fas fa-file-invoice text-blue-600"></i>
              <div>
                <p class="font-medium text-gray-900">{{ factura.numero }}</p>
                <p class="text-sm text-gray-500">{{ factura.clinica?.nombre }}</p>
              </div>
            </div>
            
            <div class="pt-3 border-t border-blue-200">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Monto Total:</span>
                <span class="text-2xl font-bold text-green-600">{{ formatMoney(factura.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="handleSubmit">
            
            <!-- Método de Pago -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago *
              </label>
              <select
                v-model="form.metodo_pago"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar método...</option>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="efectivo">Efectivo</option>
                <option value="cheque">Cheque</option>
                <option value="webpay">Webpay</option>
                <option value="mercadopago">Mercado Pago</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <!-- Referencia -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Referencia / Comprobante
              </label>
              <input
                v-model="form.referencia"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Número de transferencia, boleta, etc."
              >
            </div>

            <!-- Fecha de Pago -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Pago
              </label>
              <input
                v-model="form.fecha_pago"
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

            <!-- Confirmación visual -->
            <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start gap-3">
                <i class="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <p class="text-sm font-medium text-gray-900 mb-1">
                    Al confirmar:
                  </p>
                  <ul class="text-xs text-gray-600 space-y-1">
                    <li>• La factura se marcará como PAGADA</li>
                    <li>• Se actualizarán las estadísticas</li>
                    <li>• Se enviará confirmación a la clínica</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
            :disabled="loading"
            class="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-check mr-2"></i>
            Registrar Pago
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSuperAdminFacturacionStore } from '@superadmin/stores/superadmin/facturacion'

const props = defineProps({
  factura: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

const facturacionStore = useSuperAdminFacturacionStore()

const form = ref({
  metodo_pago: '',
  referencia: '',
  fecha_pago: new Date().toISOString().split('T')[0],
  notas: ''
})

const loading = ref(false)
const errorMessage = ref('')

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}

async function handleSubmit() {
  if (!form.value.metodo_pago) {
    errorMessage.value = 'Debes seleccionar un método de pago'
    return
  }

  errorMessage.value = ''
  loading.value = true

  try {
    const result = await facturacionStore.registrarPago(props.factura.id, form.value)

    if (result.success) {
      emit('saved')
    } else {
      errorMessage.value = result.message || 'Error al registrar pago'
    }
  } catch (error) {
    console.error('Error registering payment:', error)
    errorMessage.value = 'Error al procesar la solicitud'
  } finally {
    loading.value = false
  }
}
</script>