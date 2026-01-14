<!-- components/facturacion/VerFinanciamientoModal.vue -->
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
          class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 class="text-xl font-bold text-gray-800">
                <i class="fas fa-credit-card text-blue-600 mr-2"></i>
                Detalle del Financiamiento
              </h2>
              <p v-if="financiamiento" class="text-sm text-gray-600 mt-1">
                Contrato: {{ financiamiento.numero_contrato }}
              </p>
            </div>
            <button
              @click="handleClose"
              class="text-gray-400 hover:text-gray-600 transition"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <!-- Contenido -->
          <div v-if="financiamiento" class="p-6">
            
            <!-- Info del Paciente y Cuenta -->
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-700">Paciente</p>
                  <p class="text-lg font-bold text-gray-900">
                    {{ financiamiento.paciente?.nombre }} {{ financiamiento.paciente?.apellido }}
                  </p>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ financiamiento.cuenta?.concepto }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-700">Estado</p>
                  <span
                    :class="[
                      'inline-block px-3 py-1 rounded-full text-sm font-medium',
                      estadoBadgeClass(financiamiento.estado)
                    ]"
                  >
                    {{ estadoLabel(financiamiento.estado) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Resumen Financiero -->
            <div class="grid grid-cols-4 gap-4 mb-6">
              <!-- Monto Original -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-xs text-gray-600 mb-1">Monto Original</p>
                <p class="text-xl font-bold text-gray-900">
                  {{ formatMonto(financiamiento.monto_original) }}
                </p>
              </div>

              <!-- Total con Interés -->
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-xs text-gray-600 mb-1">Total a Pagar</p>
                <p class="text-xl font-bold text-blue-600">
                  {{ formatMonto(financiamiento.monto_total) }}
                </p>
              </div>

              <!-- Pagado -->
              <div class="bg-green-50 p-4 rounded-lg">
                <p class="text-xs text-gray-600 mb-1">Pagado</p>
                <p class="text-xl font-bold text-green-600">
                  {{ formatMonto(financiamiento.monto_pagado) }}
                </p>
              </div>

              <!-- Saldo -->
              <div class="bg-orange-50 p-4 rounded-lg">
                <p class="text-xs text-gray-600 mb-1">Saldo Pendiente</p>
                <p class="text-xl font-bold text-orange-600">
                  {{ formatMonto(financiamiento.saldo_pendiente) }}
                </p>
              </div>
            </div>

            <!-- Detalles del Financiamiento -->
            <div class="mb-6 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg text-sm">
              <div>
                <p class="text-gray-600">Número de Cuotas</p>
                <p class="font-semibold">{{ financiamiento.numero_cuotas }}</p>
              </div>
              <div>
                <p class="text-gray-600">Cuota Mensual</p>
                <p class="font-semibold">{{ formatMonto(financiamiento.cuota_mensual) }}</p>
              </div>
              <div>
                <p class="text-gray-600">Tasa de Interés</p>
                <p class="font-semibold">{{ financiamiento.tasa_interes }}%</p>
              </div>
              <div>
                <p class="text-gray-600">Día de Vencimiento</p>
                <p class="font-semibold">Día {{ financiamiento.dia_vencimiento }}</p>
              </div>
              <div>
                <p class="text-gray-600">Fecha de Creación</p>
                <p class="font-semibold">{{ formatFecha(financiamiento.created_at) }}</p>
              </div>
              <div>
                <p class="text-gray-600">Cuotas Pendientes</p>
                <p class="font-semibold">{{ cuotasPendientes.length }}</p>
              </div>
            </div>

            <!-- Barra de Progreso -->
            <div class="mb-6">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-600">Progreso de Pago</span>
                <span class="font-semibold text-gray-900">{{ progresoPago }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  class="h-3 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                  :style="{ width: progresoPago + '%' }"
                ></div>
              </div>
            </div>

            <!-- Lista de Cuotas -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i class="fas fa-list text-blue-600"></i>
                Detalle de Cuotas
              </h3>

              <!-- Sin cuotas -->
              <div v-if="!financiamiento.cuotas || financiamiento.cuotas.length === 0" class="text-center py-8">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-calendar-times text-3xl text-gray-400"></i>
                </div>
                <p class="text-gray-600">No hay cuotas disponibles</p>
                <p class="text-sm text-gray-500 mt-2">
                  ID Financiamiento: {{ financiamiento.id }}
                </p>
              </div>

              <!-- Con cuotas -->
              <div v-else class="space-y-3 max-h-[400px] overflow-y-auto">
                <div
                  v-for="cuota in financiamiento.cuotas"
                  :key="cuota.id"
                  :class="[
                    'p-4 border-2 rounded-lg transition',
                    cuotaBorderClass(cuota)
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <!-- Info de la cuota -->
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <span class="text-lg font-bold text-gray-900">
                          Cuota {{ cuota.numero_cuota }}
                        </span>
                        <span
                          :class="[
                            'px-2 py-1 rounded-full text-xs font-medium',
                            cuotaEstadoBadge(cuota)
                          ]"
                        >
                          {{ cuotaEstadoLabel(cuota.estado) }}
                        </span>
                        <span
                          v-if="esCuotaVencida(cuota)"
                          class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                        >
                          <i class="fas fa-exclamation-triangle mr-1"></i>
                          Vencida
                        </span>
                      </div>

                      <div class="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p class="text-gray-600">Monto</p>
                          <p class="font-semibold">{{ formatMonto(cuota.monto) }}</p>
                        </div>
                        <div>
                          <p class="text-gray-600">Vencimiento</p>
                          <p class="font-semibold">{{ formatFecha(cuota.fecha_vencimiento) }}</p>
                        </div>
                        <div v-if="cuota.fecha_pago">
                          <p class="text-gray-600">Fecha de Pago</p>
                          <p class="font-semibold text-green-600">{{ formatFecha(cuota.fecha_pago) }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Botón Pagar -->
                    <button
                      v-if="cuota.estado === 'pendiente' && financiamiento.estado === 'activo'"
                      @click="pagarCuota(cuota)"
                      class="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                    >
                      <i class="fas fa-dollar-sign"></i>
                      Pagar
                    </button>

                    <!-- Icono Pagado -->
                    <div
                      v-else-if="cuota.estado === 'pagada'"
                      class="ml-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      <i class="fas fa-check text-2xl text-green-600"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer con Acciones -->
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            <button
              @click="handleClose"
              class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
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
import { ref, computed, watch } from 'vue'
import { useFacturacionStore } from '@/stores/facturacion'
import { useNotification } from '@/composables/useNotification'

const props = defineProps({
  modelValue: Boolean,
  financiamiento: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'pagar-cuota', 'refresh'])

const facturacionStore = useFacturacionStore()
const notify = useNotification()

// Watch para debug
watch(() => props.financiamiento, (newVal) => {
  if (newVal) {
    console.group('🔍 DEBUG: Financiamiento Recibido')
    console.log('Financiamiento completo:', newVal)
    console.log('ID:', newVal.id)
    console.log('Número de cuotas:', newVal.numero_cuotas)
    console.log('Array cuotas:', newVal.cuotas)
    console.log('Cantidad de cuotas en array:', newVal.cuotas?.length || 0)
    console.groupEnd()
  }
}, { immediate: true, deep: true })

// Computed
const cuotasPendientes = computed(() => {
  if (!props.financiamiento?.cuotas) return []
  return props.financiamiento.cuotas.filter(c => c.estado === 'pendiente')
})

const progresoPago = computed(() => {
  if (!props.financiamiento) return 0
  const pagado = parseFloat(props.financiamiento.monto_pagado || 0)
  const total = parseFloat(props.financiamiento.monto_total || 1)
  return Math.round((pagado / total) * 100)
})

// Methods
function estadoBadgeClass(estado) {
  const classes = {
    'activo': 'bg-green-100 text-green-700',
    'completado': 'bg-blue-100 text-blue-700',
    'cancelado': 'bg-gray-100 text-gray-700',
    'suspendido': 'bg-red-100 text-red-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

function estadoLabel(estado) {
  const labels = {
    'activo': 'Activo',
    'completado': 'Completado',
    'cancelado': 'Cancelado',
    'suspendido': 'Suspendido'
  }
  return labels[estado] || estado
}

function cuotaBorderClass(cuota) {
  if (cuota.estado === 'pagada') return 'border-green-200 bg-green-50'
  if (esCuotaVencida(cuota)) return 'border-red-200 bg-red-50'
  return 'border-gray-200 bg-white'
}

function cuotaEstadoBadge(cuota) {
  if (cuota.estado === 'pagada') return 'bg-green-100 text-green-700'
  if (cuota.estado === 'atrasada') return 'bg-red-100 text-red-700'
  return 'bg-orange-100 text-orange-700'
}

function cuotaEstadoLabel(estado) {
  const labels = {
    'pendiente': 'Pendiente',
    'pagada': 'Pagada',
    'atrasada': 'Atrasada'
  }
  return labels[estado] || estado
}

function esCuotaVencida(cuota) {
  if (cuota.estado === 'pagada') return false
  if (!cuota.fecha_vencimiento) return false
  return new Date(cuota.fecha_vencimiento) < new Date()
}

function pagarCuota(cuota) {
  emit('pagar-cuota', {
    financiamiento: props.financiamiento,
    cuota: cuota
  })
}

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