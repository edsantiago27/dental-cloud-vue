<!-- components/facturacion/RegistrarPagoModal.vue -->
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
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-xl">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">
                <i class="fas fa-money-bill-wave mr-2"></i>
                Registrar Pago
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
            
            <!-- Info de la Cuenta -->
            <div v-if="cuenta" class="mb-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <p class="font-semibold text-gray-900">
                  {{ cuenta.paciente?.nombre }} {{ cuenta.paciente?.apellido }}
                </p>
                <span class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                  Saldo: {{ formatMonto(parseFloat(cuenta.saldo || cuenta.total || 0)) }}
                </span>
              </div>
              <p class="text-sm text-gray-600">
                {{ cuenta.concepto }}
              </p>
              <div class="mt-2 text-xs text-gray-500">
                <span>Total: {{ formatMonto(cuenta.total) }}</span>
                <span v-if="cuenta.monto_pagado" class="ml-3">
                  Pagado: {{ formatMonto(cuenta.monto_pagado) }}
                </span>
              </div>
            </div>

            <!-- Monto a Pagar -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Monto a Pagar <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-4 top-2.5 text-gray-500">$</span>
                <input
                  v-model.number="form.monto"
                  type="number"
                  required
                  min="1"
                  :max="parseFloat(cuenta?.saldo || cuenta?.total || 0)"
                  step="1"
                  :disabled="saving"
                  placeholder="0"
                  class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  @input="calcularSaldoRestante"
                >
              </div>
              <div class="flex items-center justify-between mt-2">
                <p class="text-sm text-gray-600">{{ formatMonto(form.monto) }}</p>
                <button
                  type="button"
                  @click="pagarTotal"
                  class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Pagar total
                </button>
              </div>
              <p v-if="saldoRestante !== null" class="text-sm mt-2" :class="saldoRestante === 0 ? 'text-green-600' : 'text-gray-600'">
                <i class="fas fa-info-circle mr-1"></i>
                Saldo restante: {{ formatMonto(saldoRestante) }}
              </p>
            </div>

            <!-- Método de Pago -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.metodo_pago"
                required
                :disabled="saving"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value="efectivo">💵 Efectivo</option>
                <option value="tarjeta_debito">💳 Tarjeta de Débito</option>
                <option value="tarjeta_credito">💳 Tarjeta de Crédito</option>
                <option value="transferencia">🏦 Transferencia</option>
                <option value="cheque">📝 Cheque</option>
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
                :disabled="saving"
                placeholder="N° de transacción, cheque, etc."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <!-- Fecha del Pago -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha del Pago
              </label>
              <input
                v-model="form.fecha_pago"
                type="date"
                :disabled="saving"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>

            <!-- Notas -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                v-model="form.notas"
                rows="2"
                :disabled="saving"
                placeholder="Observaciones sobre el pago..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errorMessage }}</p>
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
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                <span v-if="!saving" class="flex items-center gap-2">
                  <i class="fas fa-check"></i>
                  <span>Registrar Pago</span>
                </span>
                <span v-else class="flex items-center gap-2">
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Registrando...</span>
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
import { useFacturacionStore } from '../stores/facturacion'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  cuenta: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'registered'])

const facturacionStore = useFacturacionStore()

// State
const saving = ref(false)
const errorMessage = ref('')
const saldoRestante = ref(null)

const form = ref({
  cuenta_id: props.cuenta?.id,
  monto: 0,
  metodo_pago: '',
  referencia: '',
  fecha_pago: new Date().toISOString().split('T')[0],
  notas: ''
})

// Computed
const isFormValid = computed(() => {
  const maxMonto = props.cuenta?.saldo || props.cuenta?.total || 0
  return form.value.monto > 0 &&
         form.value.monto <= maxMonto &&
         form.value.metodo_pago
})

// Methods
function calcularSaldoRestante() {
  if (props.cuenta && form.value.monto) {
    const saldoActual = parseFloat(props.cuenta.saldo || props.cuenta.total || 0)
    saldoRestante.value = saldoActual - parseFloat(form.value.monto)
  } else {
    saldoRestante.value = null
  }
}

function pagarTotal() {
  if (props.cuenta) {
    const saldoActual = parseFloat(props.cuenta.saldo || props.cuenta.total || 0)
    form.value.monto = saldoActual
    calcularSaldoRestante()
  }
}

async function handleSubmit() {
  if (!isFormValid.value) return

  saving.value = true
  errorMessage.value = ''

  try {
    const response = await facturacionStore.registrarPago(form.value)

    if (response.success) {
      emit('registered', response.data)
      handleClose()
      resetForm()
    } else {
      errorMessage.value = response.message || 'Error al registrar pago'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al registrar pago'
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
      saldoRestante.value = null
    }, 300)
  }
}

function resetForm() {
  form.value = {
    cuenta_id: props.cuenta?.id,
    monto: 0,
    metodo_pago: '',
    referencia: '',
    fecha_pago: new Date().toISOString().split('T')[0],
    notas: ''
  }
}

function formatMonto(valor) {
  if (!valor && valor !== 0) return '$0'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor)
}

// Watch
watch(() => props.cuenta, (newVal) => {
  if (newVal) {
    console.log('Cuenta recibida:', newVal)
    form.value.cuenta_id = newVal.id
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    console.log('Modal abierto con cuenta:', props.cuenta)
    if (props.cuenta) {
      form.value.cuenta_id = props.cuenta.id
      saldoRestante.value = null
    }
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