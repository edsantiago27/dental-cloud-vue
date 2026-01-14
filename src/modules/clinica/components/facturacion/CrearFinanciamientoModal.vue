<!-- components/facturacion/CrearFinanciamientoModal.vue -->
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
          class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 class="text-xl font-bold text-gray-800">
                <i class="fas fa-credit-card text-blue-600 mr-2"></i>
                Crear Financiamiento
              </h2>
              <p class="text-sm text-gray-600 mt-1">Dividir el pago en cuotas mensuales</p>
            </div>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition"
              :disabled="saving"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            
            <!-- Información de la Cuenta -->
            <div v-if="cuenta" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p class="text-sm font-medium text-gray-700">Paciente</p>
                  <p class="text-lg font-bold text-gray-900">
                    {{ cuenta.paciente?.nombre }} {{ cuenta.paciente?.apellido }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-700">Monto a Financiar</p>
                  <p class="text-2xl font-bold text-blue-600">
                    {{ formatMonto(montoFinanciar) }}
                  </p>
                </div>
              </div>
              <div class="text-sm text-gray-600">
                <p><strong>Concepto:</strong> {{ cuenta.concepto }}</p>
                <p v-if="cuenta.tratamiento"><strong>Tratamiento:</strong> {{ cuenta.tratamiento.nombre }}</p>
              </div>
            </div>

            <form @submit.prevent="handleSubmit">
              
              <!-- Número de Cuotas -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Número de Cuotas <span class="text-red-500">*</span>
                </label>
                <select
                  v-model.number="form.cuotas"
                  required
                  :disabled="saving"
                  @change="calcularSimulacion"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  <option v-for="n in opcionesCuotas" :key="n" :value="n">
                    {{ n }} cuotas mensuales
                  </option>
                </select>
              </div>

              <!-- Día de Vencimiento -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Día de Vencimiento
                </label>
                <select
                  v-model.number="form.dia_vencimiento"
                  :disabled="saving"
                  @change="calcularSimulacion"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option v-for="dia in 28" :key="dia" :value="dia">
                    Día {{ dia }} de cada mes
                  </option>
                </select>
                <p class="text-xs text-gray-500 mt-1">
                  Primer vencimiento: {{ primeraFechaVencimiento }}
                </p>
              </div>

              <!-- Interés -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tasa de Interés (%)
                </label>
                <input
                  v-model.number="form.interes"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  :disabled="saving"
                  @input="calcularSimulacion"
                  placeholder="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                <p class="text-xs text-gray-500 mt-1">
                  Dejar en 0 para financiamiento sin interés
                </p>
              </div>

              <!-- Simulación de Cuotas -->
              <div v-if="simulacion.cuota_mensual > 0" class="mb-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <i class="fas fa-calculator text-green-600"></i>
                  Simulación del Financiamiento
                </h3>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-xs text-gray-600">Cuota Mensual</p>
                    <p class="text-2xl font-bold text-green-600">
                      {{ formatMonto(simulacion.cuota_mensual) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-600">Total a Pagar</p>
                    <p class="text-lg font-bold text-gray-800">
                      {{ formatMonto(simulacion.total_pagar) }}
                    </p>
                  </div>
                </div>

                <div v-if="simulacion.interes_total > 0" class="text-sm text-gray-600">
                  <p><strong>Interés Total:</strong> {{ formatMonto(simulacion.interes_total) }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    ({{ simulacion.interes_porcentaje }}% sobre el monto original)
                  </p>
                </div>

                <!-- Detalle de Cuotas -->
                <div class="mt-4">
                  <button
                    type="button"
                    @click="mostrarDetalleCuotas = !mostrarDetalleCuotas"
                    class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                  >
                    <i :class="['fas', mostrarDetalleCuotas ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
                    {{ mostrarDetalleCuotas ? 'Ocultar' : 'Ver' }} detalle de cuotas
                  </button>
                  
                  <div v-if="mostrarDetalleCuotas" class="mt-3 max-h-48 overflow-y-auto">
                    <div
                      v-for="(cuota, index) in simulacion.detalle_cuotas"
                      :key="index"
                      class="flex items-center justify-between py-2 px-3 hover:bg-white rounded text-sm"
                    >
                      <span class="text-gray-700">Cuota {{ cuota.numero }}</span>
                      <div class="text-right">
                        <span class="font-medium text-gray-900">{{ formatMonto(cuota.monto) }}</span>
                        <span class="text-xs text-gray-500 ml-2">Vence: {{ cuota.fecha_vencimiento }}</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                  class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <i v-if="saving" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-check"></i>
                  {{ saving ? 'Creando...' : 'Crear Financiamiento' }}
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
import { ref, computed, watch } from 'vue'
import { useFacturacionStore } from '@clinica/stores/facturacion'

const props = defineProps({
  modelValue: Boolean,
  cuenta: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'created'])

const facturacionStore = useFacturacionStore()

// State
const saving = ref(false)
const errorMessage = ref('')
const mostrarDetalleCuotas = ref(false)

const form = ref({
  cuotas: '',
  dia_vencimiento: 5,
  interes: 0
})

const simulacion = ref({
  cuota_mensual: 0,
  total_pagar: 0,
  interes_total: 0,
  interes_porcentaje: 0,
  detalle_cuotas: []
})

// Computed
const opcionesCuotas = computed(() => {
  // 2 a 24 cuotas
  return Array.from({ length: 23 }, (_, i) => i + 2)
})

const montoFinanciar = computed(() => {
  if (!props.cuenta) return 0
  return parseFloat(props.cuenta.saldo || props.cuenta.total || 0)
})

const primeraFechaVencimiento = computed(() => {
  const fecha = new Date()
  fecha.setMonth(fecha.getMonth() + 1)
  fecha.setDate(form.value.dia_vencimiento)
  return fecha.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
})

const isFormValid = computed(() => {
  return form.value.cuotas >= 2 && 
         form.value.cuotas <= 24 &&
         montoFinanciar.value > 0
})

// Methods
function calcularSimulacion() {
  if (!isFormValid.value) {
    simulacion.value = {
      cuota_mensual: 0,
      total_pagar: 0,
      interes_total: 0,
      interes_porcentaje: 0,
      detalle_cuotas: []
    }
    return
  }

  const monto = montoFinanciar.value
  const cuotas = form.value.cuotas
  const tasaMensual = (form.value.interes || 0) / 100 / 12

  let cuotaMensual = 0
  let totalPagar = 0

  if (tasaMensual > 0) {
    // Fórmula de cuota con interés compuesto
    cuotaMensual = monto * (tasaMensual * Math.pow(1 + tasaMensual, cuotas)) / 
                   (Math.pow(1 + tasaMensual, cuotas) - 1)
    totalPagar = cuotaMensual * cuotas
  } else {
    // Sin interés
    cuotaMensual = monto / cuotas
    totalPagar = monto
  }

  const interesTotal = totalPagar - monto
  const interesPorcentaje = (interesTotal / monto) * 100

  // Generar detalle de cuotas
  const detalleCuotas = []
  const fechaBase = new Date()
  
  for (let i = 1; i <= cuotas; i++) {
    const fechaVencimiento = new Date(fechaBase)
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i)
    fechaVencimiento.setDate(form.value.dia_vencimiento)
    
    detalleCuotas.push({
      numero: i,
      monto: Math.round(cuotaMensual),
      fecha_vencimiento: fechaVencimiento.toLocaleDateString('es-CL')
    })
  }

  simulacion.value = {
    cuota_mensual: Math.round(cuotaMensual),
    total_pagar: Math.round(totalPagar),
    interes_total: Math.round(interesTotal),
    interes_porcentaje: interesPorcentaje.toFixed(2),
    detalle_cuotas: detalleCuotas
  }
}

async function handleSubmit() {
  if (!isFormValid.value || !props.cuenta) return

  saving.value = true
  errorMessage.value = ''

  try {
    const payload = {
      cuenta_id: props.cuenta.id,
      cuotas: form.value.cuotas,
      dia_vencimiento: form.value.dia_vencimiento,
      interes: form.value.interes || 0
    }

    const response = await facturacionStore.crearFinanciamiento(payload)

    if (response.success) {
      emit('created', response.data)
      handleClose()
      resetForm()
    } else {
      errorMessage.value = response.message || 'Error al crear financiamiento'
    }
  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = error.message || 'Error al crear financiamiento'
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
      mostrarDetalleCuotas.value = false
    }, 300)
  }
}

function resetForm() {
  form.value = {
    cuotas: '',
    dia_vencimiento: 5,
    interes: 0
  }
  simulacion.value = {
    cuota_mensual: 0,
    total_pagar: 0,
    interes_total: 0,
    interes_porcentaje: 0,
    detalle_cuotas: []
  }
}

function formatMonto(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor || 0)
}

// Watch
watch(() => props.cuenta, () => {
  if (props.cuenta) {
    calcularSimulacion()
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