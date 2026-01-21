<!-- components/facturacion/CuentasLista.vue -->
<template>
  <div>
    
    <!-- Sin cuentas -->
    <div v-if="!loading && cuentas.length === 0" class="text-center py-8">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-file-invoice text-3xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">No hay cuentas</h3>
      <p class="text-gray-600 mb-4">Aún no se han registrado cuentas este mes</p>
      <button
        @click="emit('nueva-cuenta')"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
      >
        <i class="fas fa-plus mr-2"></i>
        Crear Primera Cuenta
      </button>
    </div>

    <!-- Lista de cuentas -->
    <div v-else class="space-y-3">
      <div
        v-for="cuenta in cuentasLimitadas"
        :key="cuenta.id"
        @click="emit('ver-cuenta', cuenta)"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition cursor-pointer"
      >
        <!-- Info -->
        <div class="flex items-center gap-4">
          <!-- Avatar -->
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="fas fa-user text-gray-500"></i>
          </div>

          <!-- Detalles -->
          <div>
            <p class="font-semibold text-gray-900">
              {{ cuenta.paciente?.nombre }} {{ cuenta.paciente?.apellido }}
            </p>
            <p class="text-sm text-gray-600">
              Cuenta #{{ cuenta.numero || cuenta.id }}
              <span v-if="cuenta.fecha_emision">
                · {{ formatFecha(cuenta.fecha_emision) }}
              </span>
            </p>
            <p v-if="cuenta.concepto" class="text-xs text-gray-500 mt-1">
              {{ cuenta.concepto }}
            </p>
            <div v-if="cuenta.dte_estado" class="mt-2 flex items-center gap-1">
              <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-tighter">
                <i class="fas fa-file-invoice mr-1 opacity-70"></i>
                DTE Folio: {{ cuenta.dte_folio }}
              </span>
            </div>
          </div>
        </div>

        <!-- Monto y Estado -->
        <div class="text-right">
          <p class="text-xl font-bold text-gray-900">
            {{ formatMonto(parseFloat(cuenta.saldo || cuenta.total || 0)) }}
          </p>
          <span
            class="inline-block px-3 py-1 text-xs font-medium rounded-full mt-2"
            :class="getEstadoClass(cuenta.estado)"
          >
            {{ getEstadoLabel(cuenta.estado) }}
          </span>
          <p v-if="isVencida(cuenta)" class="text-xs text-red-600 mt-1">
            <i class="fas fa-exclamation-triangle"></i>
            Vencida
          </p>
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

const emit = defineEmits(['nueva-cuenta', 'ver-cuenta'])

const facturacionStore = useFacturacionStore()

// Computed
const loading = computed(() => facturacionStore.loading)
const cuentas = computed(() => facturacionStore.cuentas)

const cuentasLimitadas = computed(() => {
  if (!props.limit) return cuentas.value
  return cuentas.value.slice(0, props.limit)
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

function isVencida(cuenta) {
  if (cuenta.estado !== 'pendiente' && cuenta.estado !== 'parcial') return false
  if (!cuenta.fecha_vencimiento) return false
  
  const hoy = new Date()
  const vencimiento = new Date(cuenta.fecha_vencimiento)
  return vencimiento < hoy
}
</script>