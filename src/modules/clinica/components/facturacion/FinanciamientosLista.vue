<!-- components/facturacion/FinanciamientosLista.vue -->
<template>
  <div>
    
    <!-- Sin financiamientos -->
    <div v-if="!loading && financiamientos.length === 0" class="text-center py-8">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-credit-card text-3xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">No hay financiamientos</h3>
      <p class="text-gray-600">Aún no se han creado planes de financiamiento</p>
    </div>

    <!-- Lista de financiamientos -->
    <div v-else class="space-y-4">
      <div
        v-for="financiamiento in financiamientosLimitados"
        :key="financiamiento.id"
        @click="$emit('ver', financiamiento)"
        class="border border-gray-200 rounded-lg p-4 hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="font-semibold text-gray-900">
              {{ financiamiento.paciente?.nombre }} {{ financiamiento.paciente?.apellido }}
            </p>
            <p class="text-sm text-gray-600">
              {{ financiamiento.numero_cuotas }} cuotas
              · {{ formatFecha(financiamiento.fecha_inicio) }}
            </p>
          </div>
          <span
            class="px-3 py-1 text-xs font-medium rounded-full"
            :class="getEstadoClass(financiamiento.estado)"
          >
            {{ getEstadoLabel(financiamiento.estado) }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="mb-3">
          <div class="flex items-center justify-between text-sm mb-1">
            <span class="text-gray-600">Progreso</span>
            <span class="text-gray-900 font-medium">
              {{ calcularProgreso(financiamiento) }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-purple-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: calcularProgreso(financiamiento) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Montos -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-xs text-gray-600 mb-1">Total</p>
            <p class="text-sm font-bold text-gray-900">
              {{ formatMonto(financiamiento.monto_total) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-600 mb-1">Pagado</p>
            <p class="text-sm font-bold text-green-600">
              {{ formatMonto(financiamiento.monto_pagado || 0) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-600 mb-1">Pendiente</p>
            <p class="text-sm font-bold text-orange-600">
              {{ formatMonto(financiamiento.saldo_pendiente || financiamiento.monto_total) }}
            </p>
          </div>
        </div>

        <!-- Próxima Cuota -->
        <div v-if="getProximaCuota(financiamiento)" class="mt-3 pt-3 border-t border-gray-200">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">
              <i class="fas fa-calendar-alt text-purple-600 mr-1"></i>
              Próxima cuota:
            </span>
            <span class="font-medium text-gray-900">
              {{ formatFecha(getProximaCuota(financiamiento).fecha_vencimiento) }}
              - {{ formatMonto(getProximaCuota(financiamiento).monto) }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFacturacionStore } from '@clinica/stores/facturacion'

const props = defineProps({
  limit: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['ver'])

const facturacionStore = useFacturacionStore()

// Computed
const loading = computed(() => facturacionStore.loading)
const financiamientos = computed(() => facturacionStore.financiamientos)

const financiamientosLimitados = computed(() => {
  if (!props.limit) return financiamientos.value
  return financiamientos.value.slice(0, props.limit)
})

// Methods
function formatMonto(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor || 0)
}

function formatFecha(fecha) {
  if (!fecha) return ''
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getEstadoClass(estado) {
  const classes = {
    activo: 'bg-green-100 text-green-700',
    completado: 'bg-blue-100 text-blue-700',
    vencido: 'bg-red-100 text-red-700',
    cancelado: 'bg-gray-100 text-gray-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

function getEstadoLabel(estado) {
  const labels = {
    activo: 'Activo',
    completado: 'Completado',
    vencido: 'Vencido',
    cancelado: 'Cancelado'
  }
  return labels[estado] || estado
}

function calcularProgreso(financiamiento) {
  if (!financiamiento.cuotas || financiamiento.cuotas.length === 0) return 0
  
  const pagadas = financiamiento.cuotas.filter(c => c.estado === 'pagado').length
  const total = financiamiento.cuotas.length
  
  return Math.round((pagadas / total) * 100)
}

function getProximaCuota(financiamiento) {
  if (!financiamiento.cuotas || financiamiento.cuotas.length === 0) return null
  
  return financiamiento.cuotas.find(c => c.estado === 'pendiente')
}
</script>