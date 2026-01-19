<!-- views/superadmin/Dashboard.vue -->
<template>
  <div class="space-y-6">

    <!-- KPIs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- MRR -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <i class="fas fa-dollar-sign text-2xl"></i>
          </div>
          <div class="text-right">
            <div class="text-xs opacity-80">MRR</div>
            <div class="text-2xl font-bold">
              {{ formatMoney(stats.ingresos.mrr) }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <i class="fas fa-arrow-up"></i>
          <span>ARR: {{ formatMoney(stats.ingresos.arr) }}</span>
        </div>
      </div>

      <!-- Clínicas Activas -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <i class="fas fa-hospital text-2xl"></i>
          </div>
          <div class="text-right">
            <div class="text-xs opacity-80">Clínicas</div>
            <div class="text-2xl font-bold">
              {{ stats.clinicas.activas }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <i class="fas fa-plus-circle"></i>
          <span>+{{ stats.clinicas.nuevas_mes }} este mes</span>
        </div>
      </div>

      <!-- Conversión -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <i class="fas fa-chart-line text-2xl"></i>
          </div>
          <div class="text-right">
            <div class="text-xs opacity-80">Conversión</div>
            <div class="text-2xl font-bold">
              {{ metricas.tasa_conversion }}%
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <i class="fas fa-users"></i>
          <span>Trial → Pago</span>
        </div>
      </div>

      <!-- Churn Rate -->
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <i class="fas fa-chart-pie text-2xl"></i>
          </div>
          <div class="text-right">
            <div class="text-xs opacity-80">Churn Rate</div>
            <div class="text-2xl font-bold">
              {{ metricas.churn_rate }}%
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <i class="fas fa-info-circle"></i>
          <span>Últimos 30 días</span>
        </div>
      </div>

    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Crecimiento de Clínicas -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-chart-area text-blue-600 mr-2"></i>
          Crecimiento de Clínicas
        </h3>
        <div v-if="crecimiento.length > 0" class="h-64">
          <canvas ref="chartCrecimiento"></canvas>
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl"></i>
        </div>
      </div>

      <!-- Ingresos Mensuales -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-money-bill-wave text-green-600 mr-2"></i>
          Ingresos Mensuales
        </h3>
        <div v-if="ingresos.length > 0" class="h-64">
          <canvas ref="chartIngresos"></canvas>
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-400">
          <i class="fas fa-spinner fa-spin text-2xl"></i>
        </div>
      </div>

    </div>

    <!-- Distribución por Plan -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Gráfico de Torta -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-chart-pie text-purple-600 mr-2"></i>
          Distribución por Plan
        </h3>
        <div v-if="distribucionPlanes.length > 0" class="h-64">
          <canvas ref="chartPlanes"></canvas>
        </div>
        <div v-else class="h-64 flex items-center justify-center text-gray-400">
          Sin datos
        </div>
      </div>

      <!-- Top Clínicas -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-trophy text-yellow-600 mr-2"></i>
          Top 5 Clínicas Más Activas
        </h3>
        <div v-if="topClinicas.length > 0" class="space-y-3">
          <div
            v-for="(clinica, index) in topClinicas"
            :key="clinica.id"
            class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
          >
            <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ clinica.nombre }}</p>
              <p class="text-xs text-gray-500">{{ clinica.plan }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">{{ clinica.citas_mes }}</p>
              <p class="text-xs text-gray-500">citas/mes</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-8">
          <i class="fas fa-inbox text-3xl mb-2"></i>
          <p>No hay datos disponibles</p>
        </div>
      </div>

    </div>

    <!-- Actividad Reciente -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Nuevas Clínicas -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-hospital-alt text-blue-600 mr-2"></i>
          Nuevas Clínicas
        </h3>
        <div v-if="actividad.nuevas_clinicas?.length > 0" class="space-y-3">
          <div
            v-for="clinica in actividad.nuevas_clinicas"
            :key="clinica.id"
            class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fas fa-hospital text-blue-600"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm text-gray-900 truncate">{{ clinica.nombre }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(clinica.created_at) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-8 text-sm">
          Sin actividad reciente
        </div>
      </div>

      <!-- Alertas -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-bell text-orange-600 mr-2"></i>
          Alertas
        </h3>
        <div class="space-y-3">
          
          <div
            v-if="stats.alertas.suscripciones_por_vencer > 0"
            class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <i class="fas fa-exclamation-triangle text-yellow-600"></i>
              <div class="flex-1">
                <p class="text-sm font-medium text-yellow-900">Trials por vencer</p>
                <p class="text-xs text-yellow-700">{{ stats.alertas.suscripciones_por_vencer }} próximos 7 días</p>
              </div>
            </div>
          </div>

          <div
            v-if="stats.alertas.facturas_pendientes > 0"
            class="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div class="flex items-center gap-2">
              <i class="fas fa-file-invoice text-red-600"></i>
              <div class="flex-1">
                <p class="text-sm font-medium text-red-900">Facturas pendientes</p>
                <p class="text-xs text-red-700">
                  {{ stats.alertas.facturas_pendientes }} facturas - {{ formatMoney(stats.alertas.monto_pendiente) }}
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="stats.alertas.suscripciones_por_vencer === 0 && stats.alertas.facturas_pendientes === 0"
            class="text-center text-gray-400 py-8 text-sm"
          >
            <i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
            <p>Todo al día</p>
          </div>

        </div>
      </div>

      <!-- Últimos Pagos -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-dollar-sign text-green-600 mr-2"></i>
          Últimos Pagos
        </h3>
        <div v-if="actividad.ultimos_pagos?.length > 0" class="space-y-3">
          <div
            v-for="pago in actividad.ultimos_pagos"
            :key="pago.id"
            class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
          >
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-check text-green-600"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm text-gray-900 truncate">{{ pago.clinica?.nombre }}</p>
              <p class="text-xs text-gray-500">{{ formatMoney(pago.total) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 py-8 text-sm">
          Sin pagos recientes
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useSuperAdminDashboardStore } from '@superadmin/stores/dashboard'
import Chart from 'chart.js/auto'

const dashboardStore = useSuperAdminDashboardStore()

const chartCrecimiento = ref(null)
const chartIngresos = ref(null)
const chartPlanes = ref(null)

let chartInstanceCrecimiento = null
let chartInstanceIngresos = null
let chartInstancePlanes = null

// Computed
const stats = computed(() => dashboardStore.estadisticas)
const metricas = computed(() => dashboardStore.metricas)
const crecimiento = computed(() => dashboardStore.crecimientoClinicas)
const ingresos = computed(() => dashboardStore.ingresosMensuales)
const distribucionPlanes = computed(() => dashboardStore.distribucionPlanes)
const topClinicas = computed(() => dashboardStore.clinicasMasActivas)
const actividad = computed(() => dashboardStore.actividadReciente)

// Methods
function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short'
  })
}

function createChartCrecimiento() {
  if (!chartCrecimiento.value || crecimiento.value.length === 0) return

  const ctx = chartCrecimiento.value.getContext('2d')
  
  if (chartInstanceCrecimiento) {
    chartInstanceCrecimiento.destroy()
  }

  chartInstanceCrecimiento = new Chart(ctx, {
    type: 'line',
    data: {
      labels: crecimiento.value.map(d => d.periodo),
      datasets: [{
        label: 'Clínicas',
        data: crecimiento.value.map(d => d.total),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

function createChartIngresos() {
  if (!chartIngresos.value || ingresos.value.length === 0) return

  const ctx = chartIngresos.value.getContext('2d')
  
  if (chartInstanceIngresos) {
    chartInstanceIngresos.destroy()
  }

  chartInstanceIngresos = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ingresos.value.map(d => d.periodo),
      datasets: [{
        label: 'Ingresos',
        data: ingresos.value.map(d => d.total),
        backgroundColor: '#10B981',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

function createChartPlanes() {
  if (!chartPlanes.value || distribucionPlanes.value.length === 0) return

  const ctx = chartPlanes.value.getContext('2d')
  
  if (chartInstancePlanes) {
    chartInstancePlanes.destroy()
  }

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  chartInstancePlanes = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: distribucionPlanes.value.map(d => d.plan),
      datasets: [{
        data: distribucionPlanes.value.map(d => d.total),
        backgroundColor: colors.slice(0, distribucionPlanes.value.length),
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

onMounted(async () => {
  // Cargar datos
  await dashboardStore.loadDashboard()
  await dashboardStore.loadClinicasMasActivas(5)
  
  // Esperar a que los canvas estén disponibles
  await nextTick()
  
  // Crear gráficos
  createChartCrecimiento()
  createChartIngresos()
  createChartPlanes()
})
</script>