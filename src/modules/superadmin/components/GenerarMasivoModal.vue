<!-- components/superadmin/GenerarMasivoModal.vue -->
<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">
            <i class="fas fa-layer-group text-purple-600 mr-2"></i>
            Generar Facturas Masivas
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
          
          <!-- Info -->
          <div class="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div class="flex items-start gap-3">
              <i class="fas fa-info-circle text-purple-600 mt-1"></i>
              <div>
                <p class="text-sm font-medium text-gray-900 mb-2">
                  ¿Qué hace esta acción?
                </p>
                <ul class="text-xs text-gray-600 space-y-1">
                  <li>• Genera facturas para <strong>TODAS</strong> las suscripciones activas</li>
                  <li>• Solo para suscripciones que no tienen factura pendiente</li>
                  <li>• Fecha de vencimiento: +15 días desde hoy</li>
                  <li>• Se envía email automático a cada clínica</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Confirmación -->
          <div v-if="!generando && !resultado" class="space-y-4">
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-start gap-3">
                <i class="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
                <div>
                  <p class="text-sm font-medium text-gray-900 mb-1">
                    Advertencia
                  </p>
                  <p class="text-xs text-gray-600">
                    Esta acción generará facturas para múltiples clínicas. 
                    Asegúrate de que todas las suscripciones estén actualizadas antes de continuar.
                  </p>
                </div>
              </div>
            </div>

            <label class="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                v-model="confirmado"
                type="checkbox"
                class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              >
              <span class="text-sm text-gray-700">
                Confirmo que quiero generar facturas masivas para todas las suscripciones activas
              </span>
            </label>
          </div>

          <!-- Loading -->
          <div v-if="generando" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
            <p class="text-lg font-medium text-gray-900">Generando facturas...</p>
            <p class="text-sm text-gray-500 mt-1">Esto puede tomar unos segundos</p>
          </div>

          <!-- Resultado -->
          <div v-if="resultado" class="space-y-4">
            <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start gap-3">
                <i class="fas fa-check-circle text-green-600 text-2xl"></i>
                <div class="flex-1">
                  <p class="text-lg font-medium text-gray-900 mb-2">
                    ¡Facturas generadas exitosamente!
                  </p>
                  <div class="space-y-2 text-sm text-gray-600">
                    <div class="flex justify-between">
                      <span>Facturas generadas:</span>
                      <span class="font-bold text-green-600">{{ resultado.generadas || 0 }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Monto total:</span>
                      <span class="font-bold text-green-600">{{ formatMoney(resultado.monto_total || 0) }}</span>
                    </div>
                    <div v-if="resultado.omitidas" class="flex justify-between">
                      <span>Omitidas (ya tienen factura):</span>
                      <span class="font-medium text-gray-500">{{ resultado.omitidas }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-xs text-gray-600">
                <i class="fas fa-info-circle text-blue-600 mr-1"></i>
                Los emails de notificación se están enviando en segundo plano. 
                Las clínicas recibirán sus facturas por correo electrónico.
              </p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center gap-2 text-red-800">
              <i class="fas fa-exclamation-circle"></i>
              <span class="text-sm">{{ errorMessage }}</span>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            v-if="!resultado"
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          
          <button
            v-if="!generando && !resultado"
            @click="handleSubmit"
            :disabled="!confirmado"
            class="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-layer-group mr-2"></i>
            Generar Facturas
          </button>

          <button
            v-if="resultado"
            @click="$emit('saved')"
            class="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            <i class="fas fa-check mr-2"></i>
            Cerrar
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSuperAdminFacturacionStore } from '@superadmin/stores/facturacion'

const emit = defineEmits(['close', 'saved'])

const facturacionStore = useSuperAdminFacturacionStore()

const confirmado = ref(false)
const generando = ref(false)
const resultado = ref(null)
const errorMessage = ref('')

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}

async function handleSubmit() {
  if (!confirmado.value) {
    errorMessage.value = 'Debes confirmar la acción'
    return
  }

  errorMessage.value = ''
  generando.value = true

  try {
    const result = await facturacionStore.generarMasivo()

    if (result.success) {
      resultado.value = result.data
    } else {
      errorMessage.value = result.message || 'Error al generar facturas'
      generando.value = false
    }
  } catch (error) {
    console.error('Error generating bulk invoices:', error)
    errorMessage.value = 'Error al procesar la solicitud'
    generando.value = false
  }
}
</script>