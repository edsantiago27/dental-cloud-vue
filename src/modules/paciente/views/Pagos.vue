<template>
  <div class="space-y-10 animate-fade-in-up">
    
    <!-- Large Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
      <div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tight">Finanzas</h1>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Seguimiento de presupuestos y pagos</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          DentalCloud Pay
        </span>
      </div>
    </div>

    <!-- Summary Widgets (Bento Grid) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Balance Pendiente -->
      <div class="bg-red-50 rounded-[2.5rem] p-8 border border-red-100 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-red-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm mb-6">
            <i class="fas fa-exclamation-circle text-xl"></i>
          </div>
          <p class="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-2">Saldo Pendiente</p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-red-600 tracking-tighter">${{ formatMonto(pagosStore.resumen.total_pendiente) }}</span>
            <span class="text-[10px] font-bold text-red-300 uppercase">CLP</span>
          </div>
        </div>
      </div>

      <!-- Total Pagado -->
      <div class="bg-green-50 rounded-[2.5rem] p-8 border border-green-100 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-green-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm mb-6">
            <i class="fas fa-check-circle text-xl"></i>
          </div>
          <p class="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none mb-2">Inversión en Salud</p>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black text-green-600 tracking-tighter">${{ formatMonto(pagosStore.resumen.total_pagado) }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Info 1 -->
      <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
            <i class="fas fa-file-invoice text-xl"></i>
          </div>
          <span class="bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Activas</span>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-black text-gray-900 tracking-tighter">{{ pagosStore.resumen.cuentas_pendientes }}</p>
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Documentos por pagar</p>
        </div>
      </div>

      <!-- Quick Info 2 -->
      <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-200 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
            <i class="fas fa-history text-lg"></i>
          </div>
        </div>
        <div class="mt-4">
          <p v-if="pagosStore.resumen.ultimo_pago" class="text-2xl font-black tracking-tighter">${{ formatMonto(pagosStore.resumen.ultimo_pago.monto) }}</p>
          <p v-else class="text-2xl font-black text-gray-600 tracking-tighter">$--</p>
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Último Pago realizado</p>
        </div>
      </div>
    </div>

    <!-- Main Lists -->
    <div class="space-y-8">
      <!-- Section Tabs -->
      <div class="flex gap-4">
        <button
          @click="tabActivo = 'cuentas'"
          :class="[tabActivo === 'cuentas' ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-white text-gray-400 border border-gray-100', 'px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all']"
        >
          Cuentas por Pagar
        </button>
        <button
          @click="tabActivo = 'historial'"
          :class="[tabActivo === 'historial' ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'bg-white text-gray-400 border border-gray-100', 'px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all']"
        >
          Historial de Pagos
        </button>
      </div>

      <!-- Loading -->
      <div v-if="pagosStore.loading" class="flex flex-col items-center justify-center py-20 animate-pulse">
        <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
        </div>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cargando registros...</p>
      </div>

      <!-- Lists Content -->
      <div v-else class="space-y-6">
        
        <!-- Cuentas Content -->
        <template v-if="tabActivo === 'cuentas'">
          <!-- Filter -->
          <div class="flex items-center gap-4 bg-gray-50/50 p-3 rounded-3xl border border-transparent focus-within:bg-white focus-within:border-blue-100 transition-all w-fit">
            <i class="fas fa-filter text-gray-300 ml-3"></i>
            <select v-model="filtroCuentas" @change="cargarCuentas" class="bg-transparent text-sm font-bold text-gray-600 outline-none pr-8 appearance-none cursor-pointer">
              <option value="">Todos los documentos</option>
              <option value="pendiente">Solo Pendientes</option>
              <option value="pagado">Solo Pagados</option>
            </select>
          </div>

          <div v-if="pagosStore.cuentas.length === 0" class="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-100/50">
            <i class="fas fa-file-invoice-dollar text-5xl text-gray-100 mb-6"></i>
            <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">No hay registros financieros</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-6">
            <div v-for="cuenta in pagosStore.cuentas" :key="cuenta.id" class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/30 hover:shadow-blue-100/50 transition-all duration-500 group flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div class="flex-1 flex gap-6">
                <div :class="[cuenta.estado === 'pagado' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500', 'w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl flex-shrink-0']">
                  <i :class="cuenta.estado === 'pagado' ? 'fas fa-check-double' : 'fas fa-file-invoice-dollar'"></i>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <span :class="['px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest', getEstadoClass(cuenta.estado).replace('bg-', 'bg-').replace('text-', 'text-')]">
                      {{ getEstadoLabel(cuenta.estado) }}
                    </span>
                    <span v-if="cuenta.exonerado" class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-50 text-purple-600">Cortesia</span>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 tracking-tight">{{ cuenta.concepto }}</h3>
                  <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                    <div class="flex items-center gap-2"><i class="fas fa-calendar"></i> {{ formatFecha(cuenta.fecha_tratamiento || cuenta.created_at) }}</div>
                    <div v-if="cuenta.profesional" class="flex items-center gap-2"><i class="fas fa-user-md"></i> {{ cuenta.profesional.nombre }}</div>
                  </div>
                  
                  <!-- Small Progress for Partial Payments -->
                  <div v-if="!cuenta.exonerado && cuenta.estado !== 'pagado'" class="w-full max-w-xs pt-4">
                    <div class="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-1.5">
                      <span>Proceso de pago</span>
                      <span>{{ cuenta.porcentaje_pagado }}%</span>
                    </div>
                    <div class="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-600 rounded-full" :style="{ width: cuenta.porcentaje_pagado + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col md:items-end justify-center min-w-[200px] border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-8">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Documento</p>
                <p class="text-3xl font-black text-gray-900 tracking-tighter">${{ formatMonto(cuenta.total) }}</p>
                <div v-if="!cuenta.exonerado && cuenta.saldo_pendiente > 0" class="mt-2 text-red-500 font-bold text-xs bg-red-50 px-3 py-1 rounded-full">
                  Pendiente: ${{ formatMonto(cuenta.saldo_pendiente) }}
                </div>
                <button @click="verDetalleCuenta(cuenta)" class="mt-6 w-full md:w-auto px-6 py-3 bg-gray-50 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Historial Content -->
        <template v-else>
          <div v-if="pagosStore.historialPagos.length === 0" class="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-100/50">
            <i class="fas fa-history text-5xl text-gray-100 mb-6"></i>
            <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Sin movimientos registrados</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="pago in pagosStore.historialPagos" :key="pago.id" class="bg-white rounded-[2.5rem] p-6 border border-gray-50 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
              <div class="flex items-center gap-6">
                <div class="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-xl">
                  <i class="fas fa-receipt"></i>
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-300 uppercase tracking-widest">Recibo #{{ pago.numero_recibo || pago.id }}</p>
                  <h4 class="font-bold text-gray-900 leading-tight mt-1">{{ pago.cuenta?.concepto || 'Pago de tratamiento' }}</h4>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="text-[10px] font-bold text-gray-400"><i class="fas fa-calendar-alt mr-1"></i> {{ formatFechaHora(pago.fecha_pago) }}</span>
                    <span class="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">{{ getMetodoPagoLabel(pago.metodo_pago) }}</span>
                  </div>
                </div>
              </div>
              <div class="text-right flex flex-col items-end gap-3">
                <p class="text-2xl font-black text-green-600 tracking-tighter">${{ formatMonto(pago.monto) }}</p>
                <button @click="descargarComprobante(pago.id)" class="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
          </div>
        </template>

      </div>
    </div>

    <!-- Modals -->
    <DetalleCuenta v-if="mostrarModalDetalle" :cuenta="cuentaSeleccionada" @close="cerrarModalDetalle" />

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePacientePagosStore } from '@paciente/stores/pagos'
import DetalleCuenta from '@paciente/components/DetalleCuenta.vue'

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
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatFechaHora(fecha) {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getEstadoClass(estado) {
  const classes = {
    'pendiente': 'border-red-100 bg-red-50 text-red-600',
    'parcial': 'border-orange-100 bg-orange-50 text-orange-600',
    'pagado': 'border-green-100 bg-green-50 text-green-600',
    'anulado': 'border-gray-100 bg-gray-50 text-gray-500'
  }
  return classes[estado] || 'border-gray-100 bg-gray-50 text-gray-500'
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
    'tarjeta_debito': 'Débito',
    'tarjeta_credito': 'Crédito',
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
  mostrarModalDetalle.value = false; cuentaSeleccionada.value = null
}

async function cargarCuentas() {
  await pagosStore.fetchCuentas(filtroCuentas.value)
}

async function descargarComprobante(pagoId) {
  const result = await pagosStore.descargarComprobante(pagoId)
  if (result.success) {
    // alert('Comprobante: ' + JSON.stringify(result.data, null, 2))
  } else {
    // alert('Error al descargar comprobante')
  }
}

onMounted(async () => {
  await pagosStore.fetchResumen()
  await pagosStore.fetchCuentas()
  if (tabActivo.value === 'historial') await pagosStore.fetchHistorialPagos()
})

watch(tabActivo, async (newTab) => {
  if (newTab === 'historial' && pagosStore.historialPagos.length === 0) {
    await pagosStore.fetchHistorialPagos()
  }
})
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>