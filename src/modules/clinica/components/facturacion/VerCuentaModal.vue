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

            <!-- Facturación Electrónica -->
            <div v-if="tieneDTEConfigurado" class="mb-6 p-4 rounded-xl border-2 border-dashed transition-all" :class="cuenta.dte_estado ? 'border-indigo-100 bg-indigo-50/30' : 'border-gray-200 bg-gray-50/30'">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-bold uppercase tracking-wider text-indigo-900 flex items-center">
                  <span class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mr-2">
                    <i class="fas fa-file-invoice"></i>
                  </span>
                  Facturación Electrónica
                </h4>
                <div v-if="cuenta.dte_estado" class="flex items-center gap-2">
                  <span 
                    class="px-2 py-0.5 text-xs font-bold rounded-full uppercase"
                    :class="getDTEEstadoClass(cuenta.dte_estado)"
                  >
                    {{ cuenta.dte_estado }}
                  </span>
                  <span v-if="cuenta.dte_folio" class="text-xs font-mono text-indigo-600 font-bold bg-white px-2 py-0.5 rounded border border-indigo-100">
                    Folio: #{{ cuenta.dte_folio }}
                  </span>
                </div>
              </div>

              <!-- DTE Emission (When NOT emitted) -->
              <div v-if="!cuenta.dte_estado" class="flex flex-col gap-3">
                <p class="text-xs text-indigo-700 italic">
                  <i class="fas fa-info-circle mr-1"></i>
                  Esta cuenta no tiene un documento tributario electrónico asociado. Seleccione el tipo de documento a emitir.
                </p>
                <div class="flex gap-2">
                  <button 
                    @click="emitirDTE(39)"
                    :disabled="loadingDTE"
                    class="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center justify-center"
                  >
                    <i v-if="loadingDTE" class="fas fa-spinner fa-spin mr-2"></i>
                    <i v-else class="fas fa-receipt mr-2 text-indigo-200"></i>
                    Emitir Boleta (39)
                  </button>
                  <button 
                    @click="emitirDTE(33)"
                    :disabled="loadingDTE"
                    class="flex-1 px-4 py-2.5 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:border-indigo-300 disabled:text-indigo-300 rounded-xl text-sm font-bold transition-all flex items-center justify-center"
                  >
                    <i v-if="loadingDTE" class="fas fa-spinner fa-spin mr-2"></i>
                    <i v-else class="fas fa-file-invoice mr-2 text-indigo-400"></i>
                    Emitir Factura (33)
                  </button>
                </div>
              </div>

              <!-- DTE Views (When emitted) -->
              <div v-else class="grid grid-cols-2 gap-3">
                <button 
                  @click="verDTE('pdf')"
                  class="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                  <i class="fas fa-file-pdf text-rose-200 text-lg"></i>
                  Ver PDF
                </button>
                <button 
                  @click="verDTE('xml')"
                  class="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                  <i class="fas fa-file-code text-slate-400 text-lg"></i>
                  Ver XML
                </button>
              </div>
            </div>

            <!-- Historial de Pagos -->
            <div class="mb-6">
              <h4 class="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center">
                <span class="w-8 h-8 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center mr-2">
                  <i class="fas fa-history"></i>
                </span>
                Historial de Pagos
              </h4>
              
              <div v-if="cuenta.pagos && cuenta.pagos.length > 0" class="space-y-2">
                <div
                  v-for="pago in cuenta.pagos"
                  :key="pago.id"
                  class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all group"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform"
                      :class="getMetodoColor(pago.metodo_pago)"
                    >
                      <i :class="getMetodoIcon(pago.metodo_pago)"></i>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">{{ formatMonto(pago.monto) }}</p>
                      <p class="text-xs text-gray-500">
                        {{ formatFechaHora(pago.created_at) }}
                        · {{ getMetodoLabel(pago.metodo_pago) }}
                      </p>
                      <p v-if="pago.referencia" class="text-xs text-indigo-500 font-medium">
                        Ref: {{ pago.referencia }}
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-col items-end">
                    <span
                      v-if="pago.estado === 'anulado'"
                      class="px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-full"
                    >
                      Anulado
                    </span>
                    <span v-else class="text-xs text-gray-400 italic">#{{ pago.id }}</span>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-8 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                <i class="fas fa-money-bill-wave text-4xl text-gray-200 mb-3"></i>
                <p class="text-gray-400 font-medium">No hay pagos registrados aún</p>
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
import { computed, watch, ref } from 'vue'
import { useFacturacionStore } from '../../stores/facturacion'
import { useConfiguracionStore } from '../../stores/configuracion'
import { useNotification } from '@shared/composables/useNotification'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  cuentaId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'registrar-pago', 'anular', 'exonerar', 'financiar', 'updated'])

const facturacionStore = useFacturacionStore()
const configStore = useConfiguracionStore()
const notify = useNotification()

const loadingDTE = ref(false)
const cuenta = computed(() => facturacionStore.cuentaActual)

// Fetch data when ID changes or modal opens
watch([() => props.cuentaId, () => props.modelValue], async ([newId, isOpen]) => {
  if (isOpen && newId) {
    await facturacionStore.fetchCuenta(newId)
  } else if (!isOpen) {
    facturacionStore.resetCuentaActual()
  }
}, { immediate: true })

// DTE logic
const tieneDTEConfigurado = computed(() => {
  const config = configStore.configuracion || {}
  const dte = config.facturacion_electronica || {}
  
  // Verificamos si tiene los campos mínimos para SimpleAPI
  return dte.habilitado && dte.api_key && config.rut
})

async function emitirDTE(tipo) {
  if (!cuenta.value) return
  
  loadingDTE.value = true
  try {
    const res = await facturacionStore.emitirDTE(cuenta.value.id, tipo)
    if (res.success) {
      notify.success('Documento emitido correctamente', `DTE Folio: ${res.data.dte_folio}`)
    } else {
      notify.error('Error al emitir DTE', res.message)
    }
  } catch (err) {
    notify.error('Error de conexión', 'No se pudo procesar la emisión')
  } finally {
    loadingDTE.value = false
  }
}

function verDTE(tipo) {
  if (!cuenta.value) return
  
  const path = tipo === 'pdf' ? cuenta.value.dte_pdf_path : cuenta.value.dte_xml_path
  if (!path) {
    notify.warning('Archivo no disponible', 'El documento aún no está disponible para descarga')
    return
  }

  // Si el path es una URL completa, abrirla
  if (path.startsWith('http')) {
    window.open(path, '_blank')
  } else {
    // Si es un path relativo, construir la URL de descarga
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost/api'
    window.open(`${baseUrl}/facturacion/cuentas/${cuenta.value.id}/descargar-${tipo}`, '_blank')
  }
}

function getDTEEstadoClass(estado) {
  const states = {
    emitido: 'bg-green-100 text-green-700',
    pendiente: 'bg-yellow-100 text-yellow-700',
    rechazado: 'bg-red-100 text-red-700',
    anulado: 'bg-gray-100 text-gray-700'
  }
  return states[estado] || 'bg-blue-100 text-blue-700'
}

// Computed para verificar si puede financiar
const puedeFinanciar = computed(() => {
  if (!cuenta.value) return false
  
  const estado = cuenta.value.estado
  const saldo = parseFloat(cuenta.value.saldo || cuenta.value.total || 0)
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
  if (isOpen && cuenta.value) {
    console.group('👁️ Ver Cuenta Modal Abierto')
    console.log('Cuenta completa:', cuenta.value)
    console.log('Estado:', cuenta.value.estado)
    console.log('Saldo:', cuenta.value.saldo)
    console.log('Total:', cuenta.value.total)
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
  if (!cuenta.value) return 0
  const total = parseFloat(cuenta.value.total) || 0
  const pagado = parseFloat(cuenta.value.monto_pagado) || 0
  if (total === 0) return 0
  return Math.round((pagado / total) * 100)
}

function isVencida() {
  if (!cuenta.value) return false
  if (cuenta.value.estado === 'pagado' || cuenta.value.estado === 'anulado' || cuenta.value.estado === 'exonerado') {
    return false
  }
  if (!cuenta.value.fecha_vencimiento) return false
  
  const hoy = new Date()
  const vencimiento = new Date(cuenta.value.fecha_vencimiento)
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