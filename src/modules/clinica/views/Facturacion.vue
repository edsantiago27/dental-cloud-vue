<!-- views/admin/FacturacionDashboard.vue - VERSIÓN FINAL CON FINANCIAMIENTOS -->
<template>
  <div class="max-w-7xl mx-auto">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          <i class="fas fa-file-invoice-dollar text-green-600 mr-2"></i>
          Facturación y Pagos
        </h1>
        <p class="text-gray-600 mt-1">Gestión financiera de la clínica</p>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Selector de Mes -->
        <select
          v-model="mesSeleccionado"
          @change="cargarDashboard"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="mes in meses" :key="mes.value" :value="mes.value">
            {{ mes.label }}
          </option>
        </select>

        <!-- Botón Nueva Cuenta -->
        <button
          @click="showCrearCuentaModal = true"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          <i class="fas fa-plus mr-2"></i>
          Nueva Cuenta
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando datos...</p>
    </div>

    <!-- Contenido -->
    <div v-else>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <!-- Ingresos del Mes -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-blue-100">Ingresos del Mes</p>
            <i class="fas fa-dollar-sign text-2xl text-blue-200"></i>
          </div>
          <p class="text-3xl font-bold">{{ formatMonto(dashboard.ingresos_mes) }}</p>
          <p class="text-xs text-blue-100 mt-2">Total generado</p>
        </div>

        <!-- Cobrado -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-green-100">Cobrado</p>
            <i class="fas fa-check-circle text-2xl text-green-200"></i>
          </div>
          <p class="text-3xl font-bold">{{ formatMonto(dashboard.cobrado_mes) }}</p>
          <p class="text-xs text-green-100 mt-2">Pagos recibidos</p>
        </div>

        <!-- Pendiente -->
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-orange-100">Por Cobrar</p>
            <i class="fas fa-clock text-2xl text-orange-200"></i>
          </div>
          <p class="text-3xl font-bold">{{ formatMonto(dashboard.pendiente_mes) }}</p>
          <p class="text-xs text-orange-100 mt-2">Cuentas pendientes</p>
        </div>

        <!-- Total Cuentas -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-purple-100">Cuentas Activas</p>
            <i class="fas fa-file-invoice text-2xl text-purple-200"></i>
          </div>
          <p class="text-3xl font-bold">{{ dashboard.total_cuentas }}</p>
          <p class="text-xs text-purple-100 mt-2">
            {{ dashboard.cuentas_pendientes }} pendientes
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="border-b border-gray-200">
          <div class="flex">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition"
              :class="activeTab === tab.id 
                ? 'border-green-600 text-green-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'"
            >
              <i :class="tab.icon"></i>
              {{ tab.label }}
              <span
                v-if="tab.badge"
                class="ml-1 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-semibold"
              >
                {{ tab.badge }}
              </span>
            </button>
          </div>
        </div>

        <div class="p-6">
          
          <!-- Cuentas -->
          <div v-show="activeTab === 'cuentas'">
            <CuentasLista 
              :limit="10"
              @ver-cuenta="verCuenta"
            />
          </div>

          <!-- Pagos -->
          <div v-show="activeTab === 'pagos'">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">Pagos Recientes</h3>
              <div class="text-sm text-gray-600">
                <i class="fas fa-calendar-day text-green-600 mr-1"></i>
                Hoy: <span class="font-semibold">{{ formatMonto(dashboard.pagos_hoy) }}</span>
              </div>
            </div>
            <PagosLista :limit="10" />
          </div>

          <!-- Financiamientos -->
          <div v-show="activeTab === 'financiamientos'">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">Financiamientos</h3>
              <div class="text-sm text-gray-600">
                <i class="fas fa-credit-card text-blue-600 mr-1"></i>
                Activos: <span class="font-semibold">{{ dashboard.financiamientos_activos }}</span>
              </div>
            </div>
            <FinanciamientosLista 
              :limit="10"
              @ver="verFinanciamiento"
            />
          </div>

        </div>
      </div>

    </div>

    <!-- Modales -->
    <CrearCuentaModal
      v-model="showCrearCuentaModal"
      @created="handleCuentaCreada"
    />

    <RegistrarPagoModal
      v-model="showRegistrarPagoModal"
      :cuenta="cuentaSeleccionada"
      @registered="handlePagoRegistrado"
    />

    <VerCuentaModal
      v-model="showVerCuentaModal"
      :cuenta="cuentaSeleccionada"
      @registrar-pago="abrirRegistrarPago"
      @financiar="abrirCrearFinanciamiento"
      @anular="anularCuenta"
      @exonerar="exonerarCuenta"
    />

    <CrearFinanciamientoModal
      v-model="showCrearFinanciamientoModal"
      :cuenta="cuentaSeleccionada"
      @created="handleFinanciamientoCreado"
    />

    <VerFinanciamientoModal
      v-model="showVerFinanciamientoModal"
      :financiamiento="financiamientoSeleccionado"
      @pagar-cuota="abrirPagarCuota"
      @refresh="cargarDashboard"
    />

    <PagarCuotaModal
      v-model="showPagarCuotaModal"
      :cuotaData="cuotaData"
      @pagado="handleCuotaPagada"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFacturacionStore } from '@clinica/stores/facturacion'
import { useNotification } from '@/composables/useNotification'
import CuentasLista from '@clinica/components/facturacion/CuentasLista.vue'
import PagosLista from '@clinica/components/facturacion/PagosLista.vue'
import FinanciamientosLista from '@clinica/components/facturacion/FinanciamientosLista.vue'
import CrearCuentaModal from '@clinica/components/facturacion/CrearCuentaModal.vue'
import RegistrarPagoModal from '@clinica/components/facturacion/RegistrarPagoModal.vue'
import VerCuentaModal from '@clinica/components/facturacion/VerCuentaModal.vue'
import CrearFinanciamientoModal from '@clinica/components/facturacion/CrearFinanciamientoModal.vue'
import VerFinanciamientoModal from '@clinica/components/facturacion/VerFinanciamientoModal.vue'
import PagarCuotaModal from '@clinica/components/facturacion/PagarCuotaModal.vue'

const facturacionStore = useFacturacionStore()
const notify = useNotification()

// State
const loading = ref(true)
const activeTab = ref('cuentas')
const mesSeleccionado = ref(getMesActual())

// Modales - Cuentas
const showCrearCuentaModal = ref(false)
const showRegistrarPagoModal = ref(false)
const showVerCuentaModal = ref(false)
const cuentaSeleccionada = ref(null)

// Modales - Financiamientos
const showCrearFinanciamientoModal = ref(false)
const showVerFinanciamientoModal = ref(false)
const showPagarCuotaModal = ref(false)
const financiamientoSeleccionado = ref(null)
const cuotaData = ref(null)

// Meses
const meses = [
  { value: '2026-01', label: 'Enero 2026' },
  { value: '2025-12', label: 'Diciembre 2025' },
  { value: '2025-11', label: 'Noviembre 2025' },
  { value: '2025-10', label: 'Octubre 2025' }
]

// Tabs
const tabs = computed(() => [
  {
    id: 'cuentas',
    label: 'Cuentas',
    icon: 'fas fa-file-invoice',
    badge: dashboard.value.cuentas_pendientes
  },
  {
    id: 'pagos',
    label: 'Pagos',
    icon: 'fas fa-money-bill-wave',
    badge: null
  },
  {
    id: 'financiamientos',
    label: 'Financiamientos',
    icon: 'fas fa-credit-card',
    badge: dashboard.value.financiamientos_activos || null
  }
])

// Computed
const dashboard = computed(() => facturacionStore.dashboard)

// Methods
async function cargarDashboard() {
  loading.value = true

  try {
    const [year, month] = mesSeleccionado.value.split('-')
    
    await Promise.all([
      facturacionStore.fetchDashboard({ year, month }),
      facturacionStore.fetchCuentas({ limit: 10, estado: 'pendiente' }),
      facturacionStore.fetchPagosHoy(),
      facturacionStore.fetchFinanciamientos({ limit: 10, estado: 'activo' })
    ])
  } catch (error) {
    notify.error('Error al cargar dashboard')
  } finally {
    loading.value = false
  }
}

function getMesActual() {
  const fecha = new Date()
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatMonto(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor || 0)
}

// Handlers - Cuentas
function verCuenta(cuenta) {
  cuentaSeleccionada.value = cuenta
  showVerCuentaModal.value = true
}

function abrirRegistrarPago(cuenta) {
  cuentaSeleccionada.value = cuenta
  showVerCuentaModal.value = false
  showRegistrarPagoModal.value = true
}

function abrirCrearFinanciamiento(cuenta) {
  cuentaSeleccionada.value = cuenta
  showVerCuentaModal.value = false
  showCrearFinanciamientoModal.value = true
}

async function anularCuenta(cuenta) {
  const confirmacion = window.confirm(
    `¿Estás segura de anular esta cuenta?\n\nPaciente: ${cuenta.paciente?.nombre} ${cuenta.paciente?.apellido}\nMonto: ${formatMonto(cuenta.saldo)}`
  )
  
  if (confirmacion) {
    const motivo = window.prompt('Motivo de la anulación:')
    if (motivo) {
      const result = await facturacionStore.anularCuenta(cuenta.id, motivo)
      if (result.success) {
        notify.success('Cuenta anulada correctamente')
        showVerCuentaModal.value = false
        await cargarDashboard()
      } else {
        notify.error(result.message || 'Error al anular cuenta')
      }
    }
  }
}

async function exonerarCuenta(cuenta) {
  const confirmacion = window.confirm(
    `¿Estás segura de exonerar esta cuenta?\n\nLa deuda de ${formatMonto(cuenta.saldo)} será eliminada.\n\nPaciente: ${cuenta.paciente?.nombre} ${cuenta.paciente?.apellido}`
  )
  
  if (confirmacion) {
    const motivo = window.prompt('Motivo de la exoneración:')
    if (motivo) {
      const result = await facturacionStore.exonerarCuenta(cuenta.id, motivo)
      if (result.success) {
        notify.success('Cuenta exonerada correctamente')
        showVerCuentaModal.value = false
        await cargarDashboard()
      } else {
        notify.error(result.message || 'Error al exonerar cuenta')
      }
    }
  }
}

function handleCuentaCreada(cuenta) {
  notify.success('Cuenta creada correctamente', 'Éxito')
  cargarDashboard()
}

function handlePagoRegistrado(pago) {
  notify.success('Pago registrado correctamente', 'Éxito')
  showRegistrarPagoModal.value = false
  cargarDashboard()
}

// Handlers - Financiamientos
async function verFinanciamiento(financiamiento) {
  console.log('📋 Ver financiamiento:', financiamiento.id)
  
  // Cargar detalles completos del financiamiento con cuotas
  const response = await facturacionStore.fetchFinanciamiento(financiamiento.id)
  
  if (response.success) {
    financiamientoSeleccionado.value = response.data
    console.log('✅ Financiamiento cargado con cuotas:', response.data)
  } else {
    // Si falla, usar el financiamiento de la lista
    financiamientoSeleccionado.value = financiamiento
    console.log('⚠️ Usando financiamiento de lista (sin detalles):', financiamiento)
  }
  
  showVerFinanciamientoModal.value = true
}

function abrirPagarCuota(data) {
  cuotaData.value = data
  showVerFinanciamientoModal.value = false
  showPagarCuotaModal.value = true
}

function handleFinanciamientoCreado(financiamiento) {
  notify.success('Financiamiento creado correctamente', 'Éxito')
  showCrearFinanciamientoModal.value = false
  cargarDashboard()
}

async function handleCuotaPagada(data) {
  notify.success('Cuota pagada correctamente', 'Éxito')
  showPagarCuotaModal.value = false
  
  // Recargar el financiamiento actualizado
  const response = await facturacionStore.fetchFinanciamiento(data.id)
  if (response.success) {
    financiamientoSeleccionado.value = response.data
    showVerFinanciamientoModal.value = true
  }
  
  await cargarDashboard()
}

// Lifecycle
onMounted(async () => {
  await cargarDashboard()
})
</script>