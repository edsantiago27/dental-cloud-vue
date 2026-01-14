<!-- views/superadmin/Reportes.vue -->
<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Reportes y Analytics</h2>
        <p class="text-sm text-gray-500 mt-1">Métricas avanzadas del negocio</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="exportarReporte('completo')"
          class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          <i class="fas fa-file-pdf mr-2"></i>
          Exportar PDF
        </button>
        <button
          @click="recargarDatos"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <i class="fas fa-sync-alt mr-2"></i>
          Actualizar
        </button>
      </div>
    </div>

    <!-- KPIs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- MRR -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm opacity-90">MRR</p>
          <i class="fas fa-dollar-sign text-2xl opacity-80"></i>
        </div>
        <p class="text-3xl font-bold">{{ formatMoney(kpis.mrr) }}</p>
        <p class="text-xs opacity-75 mt-1">Monthly Recurring Revenue</p>
      </div>

      <!-- ARR -->
      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm opacity-90">ARR</p>
          <i class="fas fa-chart-line text-2xl opacity-80"></i>
        </div>
        <p class="text-3xl font-bold">{{ formatMoney(kpis.arr) }}</p>
        <p class="text-xs opacity-75 mt-1">Annual Recurring Revenue</p>
      </div>

      <!-- ARPU -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm opacity-90">ARPU</p>
          <i class="fas fa-user-circle text-2xl opacity-80"></i>
        </div>
        <p class="text-3xl font-bold">{{ formatMoney(kpis.arpu) }}</p>
        <p class="text-xs opacity-75 mt-1">Average Revenue Per User</p>
      </div>

      <!-- LTV -->
      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm opacity-90">LTV</p>
          <i class="fas fa-trophy text-2xl opacity-80"></i>
        </div>
        <p class="text-3xl font-bold">{{ formatMoney(kpis.ltv) }}</p>
        <p class="text-xs opacity-75 mt-1">Lifetime Value</p>
      </div>

      <!-- Churn Rate -->
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Churn Rate</p>
            <p class="text-2xl font-bold text-red-600">{{ kpis.churn_rate }}%</p>
          </div>
          <i class="fas fa-user-times text-red-500 text-xl"></i>
        </div>
      </div>

      <!-- Conversion Rate -->
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Conversion Rate</p>
            <p class="text-2xl font-bold text-green-600">{{ kpis.conversion_rate }}%</p>
          </div>
          <i class="fas fa-percentage text-green-500 text-xl"></i>
        </div>
      </div>

      <!-- CAC -->
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">CAC</p>
            <p class="text-2xl font-bold text-yellow-600">{{ formatMoney(kpis.cac) }}</p>
          </div>
          <i class="fas fa-bullseye text-yellow-500 text-xl"></i>
        </div>
      </div>

      <!-- New Signups -->
      <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">New Signups</p>
            <p class="text-2xl font-bold text-blue-600">{{ kpis.new_signups }}</p>
          </div>
          <i class="fas fa-user-plus text-blue-500 text-xl"></i>
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Crecimiento de Clínicas -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-chart-line text-blue-600 mr-2"></i>
          Crecimiento de Clínicas
        </h3>
        <canvas ref="chartCrecimiento" height="250"></canvas>
      </div>

      <!-- Ingresos Mensuales -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-chart-bar text-green-600 mr-2"></i>
          Ingresos Mensuales
        </h3>
        <canvas ref="chartIngresos" height="250"></canvas>
      </div>

      <!-- Distribución por Plan -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-chart-pie text-purple-600 mr-2"></i>
          Distribución por Plan
        </h3>
        <canvas ref="chartPlanes" height="250"></canvas>
      </div>

      <!-- Top 10 Clínicas -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-trophy text-orange-600 mr-2"></i>
          Top 10 Clínicas Más Activas
        </h3>
        <div class="space-y-3 max-h-[250px] overflow-y-auto">
          <div
            v-for="(clinica, index) in topClinicas"
            :key="clinica.id"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 truncate">{{ clinica.nombre }}</p>
              <p class="text-xs text-gray-500">{{ clinica.actividad }} acciones</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-green-600">{{ formatMoney(clinica.ingresos) }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useSuperAdminReportesStore } from '@/stores/superadmin/reportes'
import Chart from 'chart.js/auto'

const reportesStore = useSuperAdminReportesStore()

// Refs para canvas
const chartCrecimiento = ref(null)
const chartIngresos = ref(null)
const chartPlanes = ref(null)

// Instancias de gráficos
let chartCrecimientoInstance = null
let chartIngresosInstance = null
let chartPlanesInstance = null

// Computed
const kpis = computed(() => reportesStore.kpis)
const topClinicas = computed(() => reportesStore.topClinicas)

// Methods
function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}

function crearGraficoCrecimiento() {
  if (!chartCrecimiento.value) return

  const data = reportesStore.crecimiento

  if (chartCrecimientoInstance) {
    chartCrecimientoInstance.destroy()
  }

  chartCrecimientoInstance = new Chart(chartCrecimiento.value, {
    type: 'line',
    data: {
      labels: data.map(d => d.mes),
      datasets: [{
        label: 'Clínicas Totales',
        data: data.map(d => d.total),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  })
}

function crearGraficoIngresos() {
  if (!chartIngresos.value) return

  const data = reportesStore.ingresos

  if (chartIngresosInstance) {
    chartIngresosInstance.destroy()
  }

  chartIngresosInstance = new Chart(chartIngresos.value, {
    type: 'bar',
    data: {
      labels: data.map(d => d.mes),
      datasets: [{
        label: 'Ingresos (CLP)',
        data: data.map(d => d.total),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatMoney(value)
            }
          }
        }
      }
    }
  })
}

function crearGraficoPlanes() {
  if (!chartPlanes.value) return

  const data = reportesStore.distribucionPlanes

  if (chartPlanesInstance) {
    chartPlanesInstance.destroy()
  }

  chartPlanesInstance = new Chart(chartPlanes.value, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.plan),
      datasets: [{
        data: data.map(d => d.cantidad),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  })
}

async function recargarDatos() {
  await reportesStore.fetchKPIs()
  await reportesStore.fetchCrecimiento(12)
  await reportesStore.fetchIngresos(12)
  await reportesStore.fetchDistribucionPlanes()
  await reportesStore.fetchTopClinicas(10)
  
  await nextTick()
  crearGraficoCrecimiento()
  crearGraficoIngresos()
  crearGraficoPlanes()
}

async function exportarReporte(tipo) {
  const result = await reportesStore.exportarReporte(tipo)
  if (!result.success) {
    alert('Error al exportar reporte')
  }
}

// Lifecycle
onMounted(async () => {
  await recargarDatos()
})
</script>