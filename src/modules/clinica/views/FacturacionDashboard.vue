<!-- views/admin/FacturacionDashboard.vue -->
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
          @click="nuevaCuenta"
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
                ? 'text-green-600 border-green-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'"
            >
              <i :class="tab.icon"></i>
              <span>{{ tab.label }}</span>
              <span
                v-if="tab.badge"
                class="px-2 py-0.5 text-xs rounded-full"
                :class="activeTab === tab.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ tab.badge }}
              </span>
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          
          <!-- Cuentas Recientes -->
          <div v-show="activeTab === 'cuentas'">
            <CuentasLista 
              :limit="10"
              @nueva-cuenta="nuevaCuenta"
              @ver-cuenta="verCuenta"
            />
            <div class="mt-4 text-center">
              <router-link
                to="/facturacion/cuentas"
                class="text-green-600 hover:text-green-700 font-medium"
              >
                Ver todas las cuentas →
              </router-link>
            </div>
          </div>

          <!-- Pagos Recientes -->
          <div v-show="activeTab === 'pagos'">
            <PagosLista 
              :limit="10"
              @registrar-pago="registrarPago"
            />
            <div class="mt-4 text-center">
              <router-link
                to="/facturacion/pagos"
                class="text-green-600 hover:text-green-700 font-medium"
              >
                Ver todos los pagos →
              </router-link>
            </div>
          </div>

          <!-- Financiamientos -->
          <div v-show="activeTab === 'financiamientos'">
            <FinanciamientosLista 
              :limit="10"
            />
            <div class="mt-4 text-center">
              <router-link
                to="/facturacion/financiamientos"
                class="text-green-600 hover:text-green-700 font-medium"
              >
                Ver todos los financiamientos →
              </router-link>
            </div>
          </div>

        </div>
      </div>

      <!-- Gráfica de Ingresos (Placeholder) -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          <i class="fas fa-chart-line text-blue-600 mr-2"></i>
          Ingresos Mensuales
        </h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p class="text-gray-500">Gráfica de ingresos (implementar con Chart.js)</p>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFacturacionStore } from '@clinica/stores/facturacion'
import { useNotification } from '@/composables/useNotification'
import CuentasLista from '@clinica/components/facturacion/CuentasLista.vue'
import PagosLista from '@clinica/components/facturacion/PagosLista.vue'
import FinanciamientosLista from '@clinica/components/facturacion/FinanciamientosLista.vue'

const facturacionStore = useFacturacionStore()
const notify = useNotification()

// State
const loading = ref(true)
const activeTab = ref('cuentas')
const mesSeleccionado = ref(getMesActual())

// Meses
const meses = [
  { value: '2025-01', label: 'Enero 2025' },
  { value: '2024-12', label: 'Diciembre 2024' },
  { value: '2024-11', label: 'Noviembre 2024' },
  { value: '2024-10', label: 'Octubre 2024' }
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
    badge: facturacionStore.financiamientosActivos.length || null
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

function nuevaCuenta() {
  // Implementar modal o redireccionar
  notify.info('Modal de nueva cuenta (por implementar)')
}

function verCuenta(cuenta) {
  // Implementar modal o redireccionar
  notify.info('Ver detalles de cuenta (por implementar)')
}

function registrarPago() {
  // Implementar modal
  notify.info('Modal de registro de pago (por implementar)')
}

// Lifecycle
onMounted(async () => {
  await cargarDashboard()
})
</script>