<!-- views/superadmin/Reportes.vue -->
<template>
  <div class="space-y-8 animate-fade-in-up">

    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
      <div>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Inteligencia de Negocio</h2>
        <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Análisis profundo de métricas SaaS y crecimiento global</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="exportarReporte('completo')"
          class="px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <i class="fas fa-file-pdf mr-2 text-xs"></i> Exportar Snapshot
        </button>
        <button
          @click="recargarDatos"
          class="p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-400 dark:text-gray-500 rounded-2xl hover:text-violet-600 dark:hover:text-orange-500 transition-all shadow-sm"
        >
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>

    <!-- KPIs Grid (Bento Style) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- MRR -->
      <div class="bg-violet-600 dark:bg-orange-500 rounded-[2rem] p-8 text-white shadow-xl shadow-violet-200 dark:shadow-orange-500/20 relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10 flex flex-col h-full">
          <p class="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Monthly Recurring Revenue</p>
          <h3 class="text-3xl font-black tracking-tighter mb-auto">{{ formatMoney(kpis.mrr) }}</h3>
          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span class="text-[9px] font-bold uppercase tracking-widest opacity-60">MRR Actual</span>
            <i class="fas fa-dollar-sign text-xs opacity-40"></i>
          </div>
        </div>
      </div>

      <!-- ARR -->
      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none relative overflow-hidden group">
        <div class="relative z-10">
          <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Annual Recurring Revenue</p>
          <h3 class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ formatMoney(kpis.arr) }}</h3>
          <div class="mt-6 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-emerald-500">
            <span class="text-[9px] font-bold uppercase tracking-widest">ARR Proyectado</span>
            <i class="fas fa-chart-line text-xs"></i>
          </div>
        </div>
      </div>

      <!-- ARPU -->
      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none relative overflow-hidden group">
        <div class="relative z-10">
          <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">ARPU</p>
          <h3 class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ formatMoney(kpis.arpu) }}</h3>
          <div class="mt-6 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-violet-600 dark:text-orange-500">
            <span class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Ingreso Promedio</span>
            <i class="fas fa-user-circle text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Churn Rate -->
      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none relative overflow-hidden group">
        <div class="relative z-10">
          <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Churn Rate</p>
          <h3 class="text-3xl font-black text-red-600 dark:text-red-500 tracking-tighter">{{ kpis.churn_rate }}%</h3>
          <div class="mt-6 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-gray-400">
            <span class="text-[9px] font-bold uppercase tracking-widest">Tasa de Deserción</span>
            <i class="fas fa-user-slash text-xs"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Crecimiento Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white tracking-tight">ESCALE DE CLÍNICAS</h3>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Evolución de registros históricos</p>
          </div>
        </div>
        <div class="h-[300px] relative">
          <canvas ref="chartCrecimiento"></canvas>
        </div>
      </div>

      <!-- Distribución Chart -->
      <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white tracking-tight">MARKET SHARE</h3>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Distribución por planes</p>
          </div>
        </div>
        <div class="h-[300px] relative">
          <canvas ref="chartPlanes"></canvas>
        </div>
      </div>

      <!-- Ingresos Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white tracking-tight">MONETIZACIÓN</h3>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Facturación mensual consolidada</p>
          </div>
        </div>
        <div class="h-[300px] relative">
          <canvas ref="chartIngresos"></canvas>
        </div>
      </div>

      <!-- Top Clinics List -->
      <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight">Top Performance</h3>
        <div class="space-y-4">
          <div
            v-for="(clinica, index) in topClinicas"
            :key="clinica.id"
            class="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-white/[0.03] rounded-2xl border border-transparent dark:border-white/5 hover:border-violet-100 dark:hover:border-orange-500/20 transition-all group"
          >
            <div class="w-10 h-10 rounded-xl bg-violet-600 dark:bg-orange-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-violet-200 dark:shadow-orange-500/20">
              #{{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-black text-gray-900 dark:text-white truncate uppercase">{{ clinica.nombre }}</p>
              <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{{ clinica.actividad }} Movimientos</p>
            </div>
            <div class="text-right">
              <p class="text-[11px] font-black text-emerald-600 dark:text-emerald-500">{{ formatMoney(clinica.ingresos) }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useSuperAdminReportesStore } from '@superadmin/stores/reportes'
import { useSuperAdminThemeStore } from '@superadmin/stores/theme'
import Chart from 'chart.js/auto'

const reportesStore = useSuperAdminReportesStore()
const themeStore = useSuperAdminThemeStore()

const chartCrecimiento = ref(null)
const chartIngresos = ref(null)
const chartPlanes = ref(null)

let chartCrecimientoInstance = null
let chartIngresosInstance = null
let chartPlanesInstance = null

const kpis = computed(() => reportesStore.kpis)
const topClinicas = computed(() => reportesStore.topClinicas)

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value)
}

function getChartColors() {
  const isDark = themeStore.theme === 'dark'
  return {
    accent: isDark ? '#f97316' : '#7c3aed', // orange-500 : violet-600
    grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    text: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
  }
}

function crearGraficoCrecimiento() {
  if (!chartCrecimiento.value) return
  const data = reportesStore.crecimiento
  if (chartCrecimientoInstance) chartCrecimientoInstance.destroy()
  
  const colors = getChartColors()
  chartCrecimientoInstance = new Chart(chartCrecimiento.value, {
    type: 'line',
    data: {
      labels: data.map(d => d.mes),
      datasets: [{
        label: 'Clínicas',
        data: data.map(d => d.total),
        borderColor: colors.accent,
        backgroundColor: colors.accent + '15',
        tension: 0.5,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { 
          beginAtZero: true, 
          grid: { color: colors.grid }, 
          ticks: { color: colors.text, font: { size: 10, weight: '900' } } 
        },
        x: { 
          grid: { display: false }, 
          ticks: { color: colors.text, font: { size: 10, weight: '900' } } 
        }
      }
    }
  })
}

function crearGraficoIngresos() {
  if (!chartIngresos.value) return
  const data = reportesStore.ingresos
  if (chartIngresosInstance) chartIngresosInstance.destroy()
  
  const colors = getChartColors()
  chartIngresosInstance = new Chart(chartIngresos.value, {
    type: 'bar',
    data: {
      labels: data.map(d => d.mes),
      datasets: [{
        label: 'Facturación',
        data: data.map(d => d.total),
        backgroundColor: colors.accent,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { 
          grid: { color: colors.grid }, 
          ticks: { color: colors.text, font: { size: 9, weight: '900' }, callback: v => '$' + (v/1000) + 'k' } 
        },
        x: { grid: { display: false }, ticks: { color: colors.text, font: { size: 10, weight: '900' } } }
      }
    }
  })
}

function crearGraficoPlanes() {
  if (!chartPlanes.value) return
  const data = reportesStore.distribucionPlanes
  if (chartPlanesInstance) chartPlanesInstance.destroy()
  
  const isDark = themeStore.theme === 'dark'
  chartPlanesInstance = new Chart(chartPlanes.value, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.plan),
      datasets: [{
        data: data.map(d => d.cantidad),
        backgroundColor: isDark 
          ? ['#f97316', '#fb923c', '#fdba74', '#ffedd5', '#fed7aa']
          : ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'],
        borderWidth: 0,
        hoverOffset: 20
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: getChartColors().text, font: { size: 9, weight: '900' }, padding: 20, usePointStyle: true }
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
  await reportesStore.exportarReporte(tipo)
}

watch(() => themeStore.theme, () => {
  crearGraficoCrecimiento()
  crearGraficoIngresos()
  crearGraficoPlanes()
})

onMounted(async () => {
  await recargarDatos()
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