<!-- components/facturacion/PagarCuotaModal.vue -->
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
          class="bg-white rounded-lg shadow-xl max-w-xl w-full"
          @click.stop
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-lg">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <i class="fas fa-dollar-sign"></i>
              Pagar Cuota #{{ cuotaData?.cuota?.numero_cuota }}
            </h2>
            <p v-if="cuotaData?.financiamiento" class="text-green-100 text-sm mt-1">
              Contrato: {{ cuotaData.financiamiento.numero_contrato }}
            </p>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            
            <!-- Info de la Cuota -->
            <div v-if="cuotaData" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p class="text-sm text-gray-600">Paciente</p>
                  <p class="font-semibold text-gray-900">
                    {{ cuotaData.financiamiento?.paciente?.nombre }}
                    {{ cuotaData.financiamiento?.paciente?.apellido }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600">Monto de la Cuota</p>
                  <p class="text-2xl font-bold text-green-600">
                    {{ formatMonto(cuotaData.cuota?.monto) }}
                  </p>
                </div>
              </div>
              <div class="text-sm text-gray-600">
                <p><strong>Vencimiento:</strong> {{ formatFecha(cuotaData.cuota?.fecha_vencimiento) }}</p>
                <p v-if="esCuotaVencida" class="text-red-600 font-medium mt-1">
                  <i class="fas fa-exclamation-triangle mr-1"></i>
                  Esta cuota está vencida
                </p>
              </div>
            </div>

            <form @submit.prevent="handleSubmit">
              
              <!-- Método de Pago -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="metodo in metodosPago"
                    :key="metodo.value"
                    type="button"
                    @click="form.metodo_pago = metodo.value"
                    :disabled="saving"
                    :class="[
                      'p-4 border-2 rounded-lg transition text-left',
                      form.metodo_pago === metodo.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <div class="flex items-center gap-3">
                      <i :class="[metodo.icon, 'text-2xl', metodo.color]"></i>
                      <div>
                        <p class="font-medium text-gray-900">{{ metodo.label }}</p>
                        <p class="text-xs text-gray-500">{{ metodo.descripcion }}</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Referencia -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Número de Referencia
                </label>
                <input
                  v-model="form.referencia"
                  type="text"
                  :disabled="saving"
                  placeholder="Número de transacción, cheque, etc."
                  maxlength="100"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                <p class="text-xs text-gray-500 mt-1">Opcional</p>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-800">
                  <i class="fas fa-exclamation-triangle mr-2"></i>
                  {{ errorMessage }}
                </p>
              </div>

              <!-- Botones -->
              <div class="flex items-center justify-end gap-3">
                <button
                  type="button"
                  @click="handleClose"
                  :disabled="saving"
                  class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="saving || !isFormValid"
                  class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <i v-if="saving" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-check"></i>
                  {{ saving ? 'Procesando...' : 'Confirmar Pago' }}
                </button>
              </div>

            </form>

          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFacturacionStore } from '../stores/facturacion'

const props = defineProps({
  modelValue: Boolean,
  cuotaData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'pagado'])

const facturacionStore = useFacturacionStore()

// State
const saving = ref(false)
const errorMessage = ref('')

const form = ref({
  metodo_pago: '',
  referencia: ''
})

// Métodos de pago
const metodosPago = [
  {
    value: 'efectivo',
    label: 'Efectivo',
    descripcion: 'Pago en efectivo',
    icon: 'fas fa-money-bill-wave',
    color: 'text-green-600'
  },
  {
    value: 'tarjeta_debito',
    label: 'Débito',
    descripcion: 'Tarjeta de débito',
    icon: 'fas fa-credit-card',
    color: 'text-blue-600'
  },
  {
    value: 'tarjeta_credito',
    label: 'Crédito',
    descripcion: 'Tarjeta de crédito',
    icon: 'fas fa-credit-card',
    color: 'text-purple-600'
  },
  {
    value: 'transferencia',
    label: 'Transferencia',
    descripcion: 'Transferencia bancaria',
    icon: 'fas fa-exchange-alt',
    color: 'text-indigo-600'
  },
  {
    value: 'cheque',
    label: 'Cheque',
    descripcion: 'Pago con cheque',
    icon: 'fas fa-file-invoice',
    color: 'text-orange-600'
  }
]

// Computed
const isFormValid = computed(() => {
  return form.value.metodo_pago !== ''
})

const esCuotaVencida = computed(() => {
  if (!props.cuotaData?.cuota?.fecha_vencimiento) return false
  return new Date(props.cuotaData.cuota.fecha_vencimiento) < new Date()
})

// Methods
async function handleSubmit() {
  if (!isFormValid.value || !props.cuotaData) return

  saving.value = true
  errorMessage.value = ''

  try {
    const payload = {
      metodo_pago: form.value.metodo_pago,
      referencia: form.value.referencia || null
    }

    const response = await facturacionStore.pagarCuota(
      props.cuotaData.financiamiento.id,
      props.cuotaData.cuota.numero_cuota,
      payload
    )

    if (response.success) {
      emit('pagado', response.data)
      handleClose()
      resetForm()
    } else {
      errorMessage.value = response.message || 'Error al registrar pago'
    }
  } catch (error) {
    console.error('Error:', error)
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
    }, 300)
  }
}

function resetForm() {
  form.value = {
    metodo_pago: '',
    referencia: ''
  }
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
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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