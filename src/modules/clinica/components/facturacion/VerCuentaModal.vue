<!-- components/facturacion/VerCuentaModal.vue -->
<template>
  <!-- Backdrop -->
  <transition name="fade">
    <div
      v-if="modelValue && cuenta"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="handleClose"
    ></div>
  </transition>

  <!-- Modal -->
  <transition name="slide-up">
    <div
      v-if="modelValue && cuenta"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-xl sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-white">
                  Cuenta #{{ cuenta.numero || cuenta.id }}
                </h3>
                <p class="text-purple-100 text-sm mt-1">
                  {{ cuenta.paciente?.nombre }} {{ cuenta.paciente?.apellido }}
                </p>
              </div>
              <button
                @click="handleClose"
                class="text-white hover:text-gray-200 transition"
              >
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            
            <!-- Resumen -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Total</p>
                <p class="text-2xl font-bold text-blue-600">{{ formatMonto(cuenta.total) }}</p>
              </div>
              <div class="bg-green-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Pagado</p>
                <p class="text-2xl font-bold text-green-600">{{ formatMonto(cuenta.monto_pagado || 0) }}</p>
              </div>
              <div class="bg-orange-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Saldo</p>
                <p class="text-2xl font-bold text-orange-600">{{ formatMonto(cuenta.saldo) }}</p>
              </div>
            </div>

            <!-- Estado -->
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600 mb-1">Estado</p>
                  <span
                    class="inline-block px-4 py-2 text-sm font-medium rounded-lg"
                    :class="getEstadoClass(cuenta.estado)"
                  >
                    {{ getEstadoLabel(cuenta.estado) }}
                  </span>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-600 mb-1">Progreso de Pago</p>
                  <div class="w-48">
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div
                        class="bg-green-600 h-3 rounded-full transition-all"
                        :style="{ width: calcularProgreso() + '%' }"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-600 mt-1 text-center">{{ calcularProgreso() }}%</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalles -->
            <div class="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Concepto</p>
                <p class="text-gray-900">{{ cuenta.concepto }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Fecha de Emisión</p>
                <p class="text-gray-900">{{ formatFecha(cuenta.fecha_emision) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Fecha de Vencimiento</p>
                <p class="text-gray-900" :class="isVencida() ? 'text-red-600 font-semibold' : ''">
                  {{ formatFecha(cuenta.fecha_vencimiento) }}
                  <span v-if="isVencida()" class="ml-2">
                    <i class="fas fa-exclamation-triangle"></i>
                    Vencida
                  </span>
                </p>
              </div>
              <div v-if="cuenta.notas">
                <p class="text-sm font-medium text-gray-500 mb-1">Notas</p>
                <p class="text-gray-900">{{ cuenta.notas }}</p>
              </div>
            </div>

            <!-- Historial de Pagos -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-800 mb-3">
                <i class="fas fa-history text-blue-600 mr-2"></i>
                Historial de Pagos
              </h4>
              
              <div v-if="cuenta.pagos && cuenta.pagos.length > 0" class="space-y-2">
                <div
                  v-for="pago in cuenta.pagos"
                  :key="pago.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center"
                      :class="getMetodoColor(pago.metodo_pago)"
                    >
                      <i :class="getMetodoIcon(pago.metodo_pago)"></i>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ formatMonto(pago.monto) }}</p>
                      <p class="text-sm text-gray-600">
                        {{ formatFechaHora(pago.created_at) }}
                        · {{ getMetodoLabel(pago.metodo_pago) }}
                      </p>
                      <p v-if="pago.referencia" class="text-xs text-gray-500">
                        Ref: {{ pago.referencia }}
                      </p>
                    </div>
                  </div>
                  <span
                    v-if="pago.estado === 'anulado'"
                    class="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"
                  >
                    Anulado
                  </span>
                </div>
              </div>
              
              <div v-else class="text-center py-6 bg-gray-50 rounded-lg">
                <i class="fas fa-money-bill-wave text-3xl text-gray-400 mb-2"></i>
                <p class="text-gray-600">No hay pagos registrados</p>
              </div>
            </div>

          </div>

          <!-- Footer con Actions -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                v-if="cuenta.estado === 'pendiente' || cuenta.estado === 'parcial'"
                @click="emit('anular', cuenta)"
                class="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <i class="fas fa-ban mr-2"></i>
                Anular
              </button>
              <button
                v-if="cuenta.estado === 'pendiente' || cuenta.estado === 'parcial'"
                @click="emit('exonerar', cuenta)"
                class="px-4 py-2 border border-purple-300 text-purple-600 hover:bg-purple-50 rounded-lg transition"
              >
                <i class="fas fa-gift mr-2"></i>
                Exonerar
              </button>
            </div>
            <div class="flex items-center gap-3">
              <button
                @click="handleClose"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cerrar
              </button>
              <button
                v-if="cuenta.estado === 'pendiente' || cuenta.estado === 'parcial'"
                @click="emit('registrar-pago', cuenta)"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <i class="fas fa-money-bill-wave mr-2"></i>
                Registrar Pago
              </button>
              <button
                v-if="puedeFinanciar"
                @click="emit('financiar', cuenta)"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                <i class="fas fa-credit-card mr-2"></i>
                Financiar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  cuenta: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'registrar-pago', 'anular', 'exonerar', 'financiar'])

// Computed para verificar si puede financiar
const puedeFinanciar = computed(() => {
  if (!props.cuenta) return false
  
  const estado = props.cuenta.estado
  const saldo = parseFloat(props.cuenta.saldo || props.cuenta.total || 0)
  const tieneSaldo = saldo > 1000 // Mínimo $1,000
  
  const puede = (estado === 'pendiente' || estado === 'parcial') && tieneSaldo
  
  console.group('🔍 DEBUG: Puede Financiar?')
  console.log('Estado:', estado)
  console.log('Saldo:', saldo)
  console.log('Tiene saldo > $1,000:', tieneSaldo)
  console.log('Resultado:', puede ? '✅ SÍ' : '❌ NO')
  console.groupEnd()
  
  return puede
})

// Watch para debug cuando se abre el modal
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.cuenta) {
    console.group('👁️ Ver Cuenta Modal Abierto')
    console.log('Cuenta completa:', props.cuenta)
    console.log('Estado:', props.cuenta.estado)
    console.log('Saldo:', props.cuenta.saldo)
    console.log('Total:', props.cuenta.total)
    console.log('¿Puede financiar?', puedeFinanciar.value)
    console.groupEnd()
  }
})

function handleClose() {
  emit('update:modelValue', false)
}

function formatMonto(valor) {
  if (!valor && valor !== 0) return '$0'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor)
}

function formatFecha(fecha) {
  if (!fecha) return '-'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatFechaHora(fecha) {
  if (!fecha) return ''
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getEstadoClass(estado) {
  const classes = {
    pendiente: 'bg-orange-100 text-orange-700',
    pagado: 'bg-green-100 text-green-700',
    parcial: 'bg-blue-100 text-blue-700',
    anulado: 'bg-gray-100 text-gray-700',
    exonerado: 'bg-purple-100 text-purple-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

function getEstadoLabel(estado) {
  const labels = {
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    parcial: 'Pago Parcial',
    anulado: 'Anulado',
    exonerado: 'Exonerado'
  }
  return labels[estado] || estado
}

function calcularProgreso() {
  if (!props.cuenta) return 0
  const total = parseFloat(props.cuenta.total) || 0
  const pagado = parseFloat(props.cuenta.monto_pagado) || 0
  if (total === 0) return 0
  return Math.round((pagado / total) * 100)
}

function isVencida() {
  if (!props.cuenta) return false
  if (props.cuenta.estado === 'pagado' || props.cuenta.estado === 'anulado' || props.cuenta.estado === 'exonerado') {
    return false
  }
  if (!props.cuenta.fecha_vencimiento) return false
  
  const hoy = new Date()
  const vencimiento = new Date(props.cuenta.fecha_vencimiento)
  return vencimiento < hoy
}

function getMetodoIcon(metodo) {
  const iconos = {
    efectivo: 'fas fa-money-bill-wave',
    tarjeta_debito: 'fas fa-credit-card',
    tarjeta_credito: 'fas fa-credit-card',
    transferencia: 'fas fa-exchange-alt',
    cheque: 'fas fa-money-check'
  }
  return iconos[metodo] || 'fas fa-dollar-sign'
}

function getMetodoColor(metodo) {
  const colores = {
    efectivo: 'bg-green-100 text-green-600',
    tarjeta_debito: 'bg-blue-100 text-blue-600',
    tarjeta_credito: 'bg-purple-100 text-purple-600',
    transferencia: 'bg-indigo-100 text-indigo-600',
    cheque: 'bg-orange-100 text-orange-600'
  }
  return colores[metodo] || 'bg-gray-100 text-gray-600'
}

function getMetodoLabel(metodo) {
  const labels = {
    efectivo: 'Efectivo',
    tarjeta_debito: 'Tarjeta Débito',
    tarjeta_credito: 'Tarjeta Crédito',
    transferencia: 'Transferencia',
    cheque: 'Cheque'
  }
  return labels[metodo] || metodo
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