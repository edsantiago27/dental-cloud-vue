<!-- src/components/paciente/DetalleCuenta.vue -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Detalle de Cuenta</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-6">
        
        <!-- Estado -->
        <div class="flex items-center gap-3">
          <span
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold',
              getEstadoClass(cuenta.estado)
            ]"
          >
            {{ getEstadoLabel(cuenta.estado) }}
          </span>
          <span v-if="cuenta.exonerado" class="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-100 text-purple-700">
            <i class="fas fa-gift mr-2"></i>
            Exonerado
          </span>
        </div>

        <!-- Información Principal -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div class="text-sm text-gray-600 mb-2">Total de la cuenta</div>
          <div class="text-4xl font-bold text-gray-900">
            ${{ formatMonto(cuenta.total) }}
          </div>
          
          <div v-if="!cuenta.exonerado" class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
            <div>
              <div class="text-xs text-gray-600 mb-1">Monto Pagado</div>
              <div class="text-xl font-semibold text-green-600">
                ${{ formatMonto(cuenta.monto_pagado) }}
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-600 mb-1">Saldo Pendiente</div>
              <div class="text-xl font-semibold text-red-600">
                ${{ formatMonto(cuenta.saldo_pendiente) }}
              </div>
            </div>
          </div>

          <div v-if="cuenta.exonerado" class="mt-4 pt-4 border-t border-purple-200">
            <div class="text-sm text-purple-700">
              <i class="fas fa-info-circle mr-2"></i>
              Esta cuenta ha sido exonerada
            </div>
            <div v-if="cuenta.motivo_exoneracion" class="text-sm text-purple-600 mt-1">
              Motivo: {{ cuenta.motivo_exoneracion }}
            </div>
          </div>
        </div>

        <!-- Detalle -->
        <div class="space-y-4">
          <h3 class="font-semibold text-gray-900 text-lg">Detalle del Tratamiento</h3>
          
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Concepto:</span>
              <span class="font-medium text-gray-900">{{ cuenta.concepto }}</span>
            </div>
            
            <div v-if="cuenta.descripcion" class="flex items-start justify-between">
              <span class="text-gray-600">Descripción:</span>
              <span class="font-medium text-gray-900 text-right max-w-xs">{{ cuenta.descripcion }}</span>
            </div>

            <div v-if="cuenta.diente" class="flex items-center justify-between">
              <span class="text-gray-600">Pieza dental:</span>
              <span class="font-medium text-gray-900">{{ cuenta.diente }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-600">Cantidad:</span>
              <span class="font-medium text-gray-900">{{ cuenta.cantidad }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-gray-600">Precio unitario:</span>
              <span class="font-medium text-gray-900">${{ formatMonto(cuenta.precio_unitario) }}</span>
            </div>

            <div v-if="cuenta.descuento > 0" class="flex items-center justify-between text-green-600">
              <span>Descuento:</span>
              <span class="font-medium">-${{ formatMonto(cuenta.descuento) }}</span>
            </div>
          </div>
        </div>

        <!-- Profesional y Fecha -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-xs text-gray-500 mb-2">Profesional</div>
            <div v-if="cuenta.profesional" class="font-medium text-gray-900">
              {{ cuenta.profesional.nombre }} {{ cuenta.profesional.apellido }}
            </div>
            <div v-else class="text-gray-400">No especificado</div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="text-xs text-gray-500 mb-2">Fecha de Tratamiento</div>
            <div class="font-medium text-gray-900">
              {{ formatFecha(cuenta.fecha_tratamiento || cuenta.created_at) }}
            </div>
          </div>
        </div>

        <!-- Pagos realizados -->
        <div v-if="cuenta.pagos && cuenta.pagos.length > 0">
          <h3 class="font-semibold text-gray-900 text-lg mb-4">Pagos Realizados</h3>
          <div class="space-y-3">
            <div
              v-for="pago in cuenta.pagos"
              :key="pago.id"
              class="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <i class="fas fa-check-circle text-green-600"></i>
                    <span class="font-medium text-gray-900">Pago #{{ pago.numero_recibo || pago.id }}</span>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ formatFechaHora(pago.fecha_pago) }}
                  </div>
                  <div class="text-sm text-gray-600">
                    Método: {{ getMetodoPagoLabel(pago.metodo_pago) }}
                  </div>
                  <div v-if="pago.notas" class="text-xs text-gray-500 mt-1">
                    {{ pago.notas }}
                  </div>
                </div>
                <div class="text-xl font-bold text-green-600">
                  ${{ formatMonto(pago.monto) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notas -->
        <div v-if="cuenta.notas" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start gap-2">
            <i class="fas fa-sticky-note text-yellow-600 mt-1"></i>
            <div>
              <div class="text-sm font-medium text-yellow-700 mb-1">Notas</div>
              <div class="text-sm text-yellow-900 whitespace-pre-line">{{ cuenta.notas }}</div>
            </div>
          </div>
        </div>

        <!-- Financiamiento -->
        <div v-if="cuenta.es_financiado" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center gap-2 text-blue-700 mb-2">
            <i class="fas fa-credit-card"></i>
            <span class="font-medium">Cuenta Financiada</span>
          </div>
          <p class="text-sm text-blue-600">
            Esta cuenta tiene un plan de financiamiento activo
          </p>
        </div>

        <!-- Información adicional -->
        <div class="border-t border-gray-200 pt-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-gray-500 mb-1">ID de Cuenta</div>
              <div class="font-mono text-gray-900">#{{ cuenta.id }}</div>
            </div>
            <div>
              <div class="text-gray-500 mb-1">Creada el</div>
              <div class="text-gray-900">
                {{ formatFecha(cuenta.created_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Botón cerrar -->
        <button
          @click="$emit('close')"
          class="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Cerrar
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  cuenta: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Methods
function formatMonto(monto) {
  return new Intl.NumberFormat('es-CL').format(monto)
}

function formatFecha(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatFechaHora(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getEstadoClass(estado) {
  const classes = {
    'pendiente': 'bg-red-100 text-red-700',
    'parcial': 'bg-yellow-100 text-yellow-700',
    'pagado': 'bg-green-100 text-green-700',
    'anulado': 'bg-gray-100 text-gray-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

function getEstadoLabel(estado) {
  const labels = {
    'pendiente': 'Pendiente',
    'parcial': 'Pago Parcial',
    'pagado': 'Pagado',
    'anulado': 'Anulado'
  }
  return labels[estado] || estado
}

function getMetodoPagoLabel(metodo) {
  const labels = {
    'efectivo': 'Efectivo',
    'transferencia': 'Transferencia',
    'tarjeta_debito': 'Tarjeta Débito',
    'tarjeta_credito': 'Tarjeta Crédito',
    'cheque': 'Cheque',
    'webpay': 'Webpay'
  }
  return labels[metodo] || metodo
}
</script>