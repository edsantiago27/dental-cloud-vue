<!-- components/facturacion/VerPagoModal.vue -->
<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="handleClose"
    >
      <Transition name="slide-up">
        <div
          v-if="modelValue"
          class="bg-white rounded-lg shadow-xl max-w-2xl w-full"
          @click.stop
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-lg">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <i class="fas fa-receipt"></i>
              Detalle del Pago
            </h2>
            <p v-if="pago" class="text-green-100 text-sm mt-1">
              {{ formatFechaCompleta(pago.fecha_pago || pago.created_at) }}
            </p>
          </div>

          <!-- Contenido -->
          <div v-if="pago" class="p-6">
            
            <!-- Info del Paciente -->
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Paciente</p>
                  <p class="text-lg font-bold text-gray-900">
                    {{ pago.paciente?.nombre }} {{ pago.paciente?.apellido }}
                  </p>
                  <p v-if="pago.paciente?.rut" class="text-sm text-gray-600 mt-1">
                    RUT: {{ pago.paciente.rut }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">Monto Pagado</p>
                  <p class="text-3xl font-bold text-green-600">
                    {{ formatMonto(pago.monto) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Información del Pago -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <!-- Método de Pago -->
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Método de Pago</p>
                <div class="flex items-center gap-2">
                  <i :class="getMetodoPagoIcon(pago.metodo_pago)" class="text-2xl text-gray-700"></i>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ getMetodoPagoLabel(pago.metodo_pago) }}
                  </p>
                </div>
              </div>

              <!-- Tipo de Pago -->
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Tipo de Pago</p>
                <span
                  class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                  :class="getTipoPagoClass(pago.tipo_pago)"
                >
                  {{ getTipoPagoLabel(pago.tipo_pago) }}
                </span>
              </div>
            </div>

            <!-- Referencia -->
            <div v-if="pago.referencia" class="mb-6 p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600 mb-1">Referencia / Número de Transacción</p>
              <p class="text-lg font-mono text-gray-900">{{ pago.referencia }}</p>
            </div>

            <!-- Información de la Cuenta -->
            <div v-if="pago.cuenta" class="mb-6 p-4 border border-gray-200 rounded-lg">
              <p class="text-sm font-medium text-gray-700 mb-2">Información de la Cuenta</p>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Cuenta #</span>
                  <span class="font-semibold">{{ pago.cuenta.numero || pago.cuenta.id }}</span>
                </div>
                <div v-if="pago.cuenta.concepto" class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Concepto</span>
                  <span class="font-semibold">{{ pago.cuenta.concepto }}</span>
                </div>
                <div v-if="pago.cuenta.total" class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Total Cuenta</span>
                  <span class="font-semibold">{{ formatMonto(pago.cuenta.total) }}</span>
                </div>
              </div>
            </div>

            <!-- Información de Cuota (si aplica) -->
            <div v-if="pago.cuota_financiamiento" class="mb-6 p-4 border border-purple-200 bg-purple-50 rounded-lg">
              <p class="text-sm font-medium text-purple-700 mb-2">
                <i class="fas fa-credit-card mr-1"></i>
                Pago de Cuota de Financiamiento
              </p>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Cuota #</span>
                  <span class="font-semibold">{{ pago.cuota_financiamiento.numero_cuota }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Vencimiento</span>
                  <span class="font-semibold">{{ formatFecha(pago.cuota_financiamiento.fecha_vencimiento) }}</span>
                </div>
              </div>
            </div>

            <!-- Notas -->
            <div v-if="pago.notas" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-sm font-medium text-yellow-800 mb-1">Notas</p>
              <p class="text-sm text-gray-700">{{ pago.notas }}</p>
            </div>

            <!-- Información de Registro -->
            <div class="text-xs text-gray-500 p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <span class="font-medium">Registrado por:</span>
                  {{ pago.usuario?.nombre || 'Sistema' }}
                </div>
                <div>
                  <span class="font-medium">Fecha de registro:</span>
                  {{ formatFechaCompleta(pago.created_at) }}
                </div>
                <div>
                  <span class="font-medium">ID Pago:</span>
                  {{ pago.id }}
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 rounded-b-lg">
            <button
              @click="handleClose"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  pago: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

function handleClose() {
  emit('update:modelValue', false)
}

function formatMonto(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor || 0)
}

function formatFecha(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function formatFechaCompleta(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getMetodoPagoLabel(metodo) {
  const labels = {
    efectivo: 'Efectivo',
    tarjeta_debito: 'Tarjeta de Débito',
    tarjeta_credito: 'Tarjeta de Crédito',
    transferencia: 'Transferencia Bancaria',
    cheque: 'Cheque',
    otro: 'Otro'
  }
  return labels[metodo] || metodo
}

function getMetodoPagoIcon(metodo) {
  const icons = {
    efectivo: 'fas fa-money-bill-wave',
    tarjeta_debito: 'fas fa-credit-card',
    tarjeta_credito: 'fas fa-credit-card',
    transferencia: 'fas fa-exchange-alt',
    cheque: 'fas fa-money-check',
    otro: 'fas fa-ellipsis-h'
  }
  return icons[metodo] || 'fas fa-dollar-sign'
}

function getTipoPagoClass(tipo) {
  const classes = {
    cuenta: 'bg-blue-100 text-blue-700',
    cuota: 'bg-purple-100 text-purple-700',
    abono: 'bg-green-100 text-green-700'
  }
  return classes[tipo] || 'bg-gray-100 text-gray-700'
}

function getTipoPagoLabel(tipo) {
  const labels = {
    cuenta: 'Pago de Cuenta',
    cuota: 'Pago de Cuota',
    abono: 'Abono'
  }
  return labels[tipo] || tipo
}
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