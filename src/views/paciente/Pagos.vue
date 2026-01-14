<!-- src/views/paciente/Pagos.vue -->
<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Mis Pagos</h1>
      <p class="text-gray-600 mt-1">Gestiona tus facturas y pagos</p>
    </div>

    <!-- Resumen Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Saldo Pendiente</p>
            <p class="text-3xl font-bold text-red-600 mt-2">
              ${{ formatMonto(pagosStore.resumen.total_pendiente) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-exclamation-circle text-2xl text-red-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Pagado</p>
            <p class="text-3xl font-bold text-green-600 mt-2">
              ${{ formatMonto(pagosStore.resumen.total_pagado) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-check-circle text-2xl text-green-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Cuentas Pendientes</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">
              {{ pagosStore.resumen.cuentas_pendientes }}
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-file-invoice text-2xl text-orange-600"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Último Pago</p>
            <p v-if="pagosStore.resumen.ultimo_pago" class="text-xl font-bold text-gray-900 mt-2">
              ${{ formatMonto(pagosStore.resumen.ultimo_pago.monto) }}
            </p>
            <p v-else class="text-xl font-bold text-gray-400 mt-2">
              N/A
            </p>
            <p v-if="pagosStore.resumen.ultimo_pago" class="text-xs text-gray-500 mt-1">
              {{ formatFecha(pagosStore.resumen.ultimo_pago.fecha) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-history text-2xl text-blue-600"></i>
          </div>
        </div>
      </div>

    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow-sm p-1 inline-flex">
      <button
        @click="tabActivo = 'cuentas'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          tabActivo === 'cuentas'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Cuentas por Pagar
      </button>
      <button
        @click="tabActivo = 'historial'"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          tabActivo === 'historial'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        Historial de Pagos
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pagosStore.loading" class="flex justify-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p class="text-gray-600">Cargando información...</p>
      </div>
    </div>

    <!-- Cuentas por Pagar -->
    <div v-else-if="tabActivo === 'cuentas'" class="space-y-4">
      
      <!-- Filtro -->
      <div class="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
        <label class="text-sm font-medium text-gray-700">Filtrar:</label>
        <select
          v-model="filtroCuentas"
          @change="cargarCuentas"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="pagado">Pagadas</option>
        </select>
      </div>

      <div v-if="pagosStore.cuentas.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <i class="fas fa-file-invoice-dollar text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay cuentas</h3>
        <p class="text-gray-600">No tienes cuentas registradas</p>
      </div>

      <div
        v-for="cuenta in pagosStore.cuentas"
        :key="cuenta.id"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getEstadoClass(cuenta.estado)
                ]"
              >
                {{ getEstadoLabel(cuenta.estado) }}
              </span>
              <span v-if="cuenta.exonerado" class="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                Exonerado
              </span>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-1">
              {{ cuenta.concepto }}
            </h3>

            <div class="space-y-1 text-sm text-gray-600">
              <div v-if="cuenta.descripcion" class="flex items-center gap-2">
                <i class="fas fa-align-left w-4"></i>
                <span>{{ cuenta.descripcion }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fas fa-calendar w-4"></i>
                <span>{{ formatFecha(cuenta.fecha_tratamiento || cuenta.created_at) }}</span>
              </div>
              <div v-if="cuenta.profesional" class="flex items-center gap-2">
                <i class="fas fa-user-md w-4"></i>
                <span>{{ cuenta.profesional.nombre }} {{ cuenta.profesional.apellido }}</span>
              </div>
            </div>

            <!-- Barra de progreso -->
            <div v-if="!cuenta.exonerado && cuenta.estado !== 'pagado'" class="mt-4">
              <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Pagado</span>
                <span>{{ cuenta.porcentaje_pagado }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all"
                  :style="{ width: cuenta.porcentaje_pagado + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Montos -->
          <div class="text-right ml-6">
            <div class="text-2xl font-bold text-gray-900">
              ${{ formatMonto(cuenta.total) }}
            </div>
            <div v-if="!cuenta.exonerado && cuenta.monto_pagado > 0" class="text-sm text-gray-600 mt-1">
              Pagado: ${{ formatMonto(cuenta.monto_pagado) }}
            </div>
            <div v-if="!cuenta.exonerado && cuenta.saldo_pendiente > 0" class="text-sm text-red-600 font-medium mt-1">
              Pendiente: ${{ formatMonto(cuenta.saldo_pendiente) }}
            </div>
            
            <button
              @click="verDetalleCuenta(cuenta)"
              class="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition text-sm"
            >
              Ver detalle
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Pagos -->
    <div v-else class="space-y-4">
      <div v-if="pagosStore.historialPagos.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <i class="fas fa-history text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No hay historial</h3>
        <p class="text-gray-600">No tienes pagos registrados</p>
      </div>

      <div
        v-for="pago in pagosStore.historialPagos"
        :key="pago.id"
        class="bg-white rounded-lg shadow-sm p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex gap-4 flex-1">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i class="fas fa-check-circle text-2xl text-green-600"></i>
            </div>

            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium text-gray-500">
                  Recibo #{{ pago.numero_recibo || pago.id }}
                </span>
              </div>

              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {{ pago.cuenta?.concepto || 'Pago de tratamiento' }}
              </h3>

              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <i class="fas fa-calendar w-4"></i>
                  <span>{{ formatFechaHora(pago.fecha_pago) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="fas fa-credit-card w-4"></i>
                  <span>{{ getMetodoPagoLabel(pago.metodo_pago) }}</span>
                </div>
                <div v-if="pago.referencia" class="flex items-center gap-2">
                  <i class="fas fa-hashtag w-4"></i>
                  <span>Ref: {{ pago.referencia }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-right ml-6">
            <div class="text-2xl font-bold text-green-600">
              ${{ formatMonto(pago.monto) }}
            </div>
            <button
              @click="descargarComprobante(pago.id)"
              class="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition text-sm"
            >
              <i class="fas fa-download mr-2"></i>
              Comprobante
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Detalle Cuenta -->
    <DetalleCuenta
      v-if="mostrarModalDetalle"
      :cuenta="cuentaSeleccionada"
      @close="cerrarModalDetalle"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePacientePagosStore } from '@/stores/paciente/pagos'
import DetalleCuenta from '@/components/paciente/DetalleCuenta.vue'

const pagosStore = usePacientePagosStore()

// State
const tabActivo = ref('cuentas')
const filtroCuentas = ref('')
const mostrarModalDetalle = ref(false)
const cuentaSeleccionada = ref(null)

// Methods
function formatMonto(monto) {
  return new Intl.NumberFormat('es-CL').format(monto)
}

function formatFecha(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
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

function verDetalleCuenta(cuenta) {
  cuentaSeleccionada.value = cuenta
  mostrarModalDetalle.value = true
}

function cerrarModalDetalle() {
  mostrarModalDetalle.value = false
  cuentaSeleccionada.value = null
}

async function cargarCuentas() {
  await pagosStore.fetchCuentas(filtroCuentas.value)
}

async function descargarComprobante(pagoId) {
  const result = await pagosStore.descargarComprobante(pagoId)
  
  if (result.success) {
    // Aquí podrías generar un PDF o mostrar la información
    alert('Comprobante: ' + JSON.stringify(result.data, null, 2))
  } else {
    alert('Error al descargar comprobante')
  }
}

// Lifecycle
onMounted(async () => {
  await pagosStore.fetchResumen()
  await pagosStore.fetchCuentas()
  
  if (tabActivo.value === 'historial') {
    await pagosStore.fetchHistorialPagos()
  }
})

// Watch tab change
watch(tabActivo, async (newTab) => {
  if (newTab === 'historial' && pagosStore.historialPagos.length === 0) {
    await pagosStore.fetchHistorialPagos()
  }
})
</script>