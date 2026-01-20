<template>
  <div class="space-y-8 animate-fade-in-up">
    
    <!-- Top Greeting Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
      <div>
        <h2 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          ¡Hola de nuevo, <span class="text-violet-600 dark:text-orange-500">{{ authStore.user?.nombre || 'Admin' }}</span>!
        </h2>
        <p class="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">
          Resumen global del ecosistema DentalCloud • {{ currentDate }}
        </p>
      </div>
      <div class="flex gap-3">
        <button class="px-6 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
          <i class="fas fa-download mr-2"></i> Reporte PDF
        </button>
        <button class="px-6 py-3 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all">
          Nueva Clínica
        </button>
      </div>
    </div>

    <!-- KPI Grid (Bento Style) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- MRR Card -->
      <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/30 dark:shadow-none relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-500 mb-6 transition-transform group-hover:rotate-12">
            <i class="fas fa-dollar-sign text-xl"></i>
          </div>
          <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">MRR Actual</p>
          <h3 class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ formatMoney(stats.ingresos.mrr) }}</h3>
          <p class="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-2 flex items-center gap-1">
            <i class="fas fa-arrow-trend-up"></i> +12.5% vs mes anterior
          </p>
        </div>
      </div>

      <!-- Clínicas Card -->
      <div class="bg-violet-600 dark:bg-orange-500 rounded-[2.5rem] p-8 shadow-2xl shadow-violet-200 dark:shadow-orange-500/20 relative overflow-hidden group">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10 text-white">
          <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <i class="fas fa-hospital text-xl"></i>
          </div>
          <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Clínicas Activas</p>
          <h3 class="text-3xl font-black tracking-tighter">{{ stats.clinicas.activas }}</h3>
          <p class="text-[10px] font-bold text-white/50 mt-2">
            {{ stats.clinicas.nuevas_mes }} nuevas este mes
          </p>
        </div>
      </div>

      <!-- Conversión Card -->
      <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/30 dark:shadow-none space-y-4">
        <div class="flex justify-between items-start">
          <div class="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500">
            <i class="fas fa-percent text-xl"></i>
          </div>
        </div>
        <div>
          <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Tasa de Conversión</p>
          <h3 class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ metricas.tasa_conversion }}%</h3>
        </div>
        <div class="h-1.5 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
          <div class="h-full bg-violet-600 dark:bg-orange-500" :style="{ width: metricas.tasa_conversion + '%' }"></div>
        </div>
      </div>

      <!-- Churn Card -->
      <div class="bg-gray-900 dark:bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200 dark:shadow-none flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <div class="w-12 h-12 bg-white/10 dark:bg-gray-100 rounded-2xl flex items-center justify-center text-white dark:text-gray-900">
            <i class="fas fa-user-minus text-lg"></i>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-3xl font-black text-white dark:text-gray-900 tracking-tighter">{{ metricas.churn_rate }}%</p>
          <p class="text-[10px] font-black text-white/40 dark:text-gray-400 uppercase tracking-widest mt-1">Churn Rate (30d)</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Chart (Growth) -->
      <div class="lg:col-span-2 bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase text-[12px]">Crecimiento del Ecosistema</h3>
          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-violet-600 dark:bg-orange-500"></span>
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nuevas Clínicas</span>
          </div>
        </div>
        <div class="h-72">
          <canvas ref="chartCrecimiento"></canvas>
        </div>
      </div>

      <!-- Distributions Section -->
      <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
        <h3 class="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase text-[12px] mb-8">Distribución por Plan</h3>
        <div class="h-64 flex items-center justify-center">
          <canvas ref="chartPlanes"></canvas>
        </div>
        <div class="mt-8 space-y-3">
          <div v-for="(item, idx) in distribucionPlanes" :key="idx" class="flex items-center justify-between px-2">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: getChartColors()[idx % getChartColors().length] }"></div>
              <span class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ item.plan }}</span>
            </div>
            <span class="text-xs font-black text-gray-900 dark:text-white">{{ item.total }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity & Lists -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Clínicas -->
      <div class="lg:col-span-2 bg-white dark:bg-[#111111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 dark:border-white/5">
          <h3 class="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase text-[12px]">Clínicas más activas</h3>
          <button class="text-[10px] font-black text-violet-600 dark:text-orange-500 uppercase tracking-widest">Ver Todas <i class="fas fa-arrow-right ml-1"></i></button>
        </div>
        <div class="space-y-4">
          <div v-for="clinica in topClinicas" :key="clinica.id" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:scale-[1.01] transition-all">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center text-gray-400">
                <i class="fas fa-hospital"></i>
              </div>
              <div>
                <p class="text-sm font-black text-gray-900 dark:text-white truncate">{{ clinica.nombre }}</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ clinica.plan }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-black text-gray-900 dark:text-white">{{ clinica.citas_mes }}</p>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Citas / Mes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts & Notifications -->
      <div class="bg-gray-900 dark:bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200 dark:shadow-none text-white dark:text-gray-900">
        <h3 class="text-lg font-black tracking-tight uppercase text-[12px] mb-8 opacity-60">Alertas Críticas</h3>
        <div class="space-y-4">
          <div v-if="stats.alertas.suscripciones_por_vencer > 0" class="p-5 bg-white/10 dark:bg-gray-100 rounded-3xl border border-white/5 dark:border-gray-200/50">
            <div class="flex gap-4">
              <i class="fas fa-clock text-orange-400 dark:text-orange-600 mt-1"></i>
              <div>
                <p class="text-xs font-black uppercase tracking-tight">{{ stats.alertas.suscripciones_por_vencer }} Suscripciones</p>
                <p class="text-[10px] font-bold opacity-60 dark:text-gray-500 mt-1">Trials por expirar en los próximos 7 días</p>
              </div>
            </div>
          </div>
          
          <div v-if="stats.alertas.facturas_pendientes > 0" class="p-5 bg-white/10 dark:bg-gray-100 rounded-3xl border border-white/5 dark:border-gray-200/50">
            <div class="flex gap-4">
              <i class="fas fa-wallet text-red-400 dark:text-red-500 mt-1"></i>
              <div>
                <p class="text-xs font-black uppercase tracking-tight">{{ stats.alertas.facturas_pendientes }} Facturas</p>
                <p class="text-[10px] font-bold opacity-60 dark:text-gray-500 mt-1">{{ formatMoney(stats.alertas.monto_pendiente) }} pendientes de cobro</p>
              </div>
            </div>
          </div>

          <div v-if="stats.alertas.suscripciones_por_vencer === 0 && stats.alertas.facturas_pendientes === 0" class="p-10 text-center">
            <i class="fas fa-check-circle text-emerald-400 dark:text-emerald-500 text-4xl mb-6"></i>
            <p class="text-xs font-black uppercase tracking-widest opacity-60">Todo bajo control</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useSuperAdminDashboardStore } from '@superadmin/stores/dashboard'
import { useSuperAdminAuthStore } from '@superadmin/stores/auth'
import { useSuperAdminThemeStore } from '@superadmin/stores/theme'
import Chart from 'chart.js/auto'

const dashboardStore = useSuperAdminDashboardStore()
const authStore = useSuperAdminAuthStore()
const themeStore = useSuperAdminThemeStore()

const chartCrecimiento = ref(null)
const chartPlanes = ref(null)

let chartInstanceCrecimiento = null
let chartInstancePlanes = null

// Computed
const stats = computed(() => dashboardStore.estadisticas)
const metricas = computed(() => dashboardStore.metricas)
const crecimiento = computed(() => dashboardStore.crecimientoClinicas)
const distribucionPlanes = computed(() => dashboardStore.distribucionPlanes)
const topClinicas = computed(() => dashboardStore.clinicasMasActivas)

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
})

// Methods
function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}

function getChartColors() {
  if (themeStore.theme === 'dark') {
    return ['#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#FFEDD5'] // Orange palette
  }
  return ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'] // Violet palette
}

function createCharts() {
  const accentColor = themeStore.theme === 'dark' ? '#F97316' : '#7C3AED'
  const textColor = themeStore.theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
  const gridColor = themeStore.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'

  // Crecimiento Chart
  if (chartCrecimiento.value && crecimiento.value.length > 0) {
    if (chartInstanceCrecimiento) chartInstanceCrecimiento.destroy()
    
    const ctx = chartCrecimiento.value.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, themeStore.theme === 'dark' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(124, 58, 237, 0.1)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    chartInstanceCrecimiento = new Chart(ctx, {
      type: 'line',
      data: {
        labels: crecimiento.value.map(d => d.periodo),
        datasets: [{
          data: crecimiento.value.map(d => d.total),
          borderColor: accentColor,
          backgroundColor: gradient,
          borderWidth: 4,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: accentColor,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { 
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 10, weight: 'bold' } }
          },
          x: { 
            grid: { display: false },
            ticks: { color: textColor, font: { size: 10, weight: 'bold' } }
          }
        }
      }
    })
  }

  // Planes Chart
  if (chartPlanes.value && distribucionPlanes.value.length > 0) {
    if (chartInstancePlanes) chartInstancePlanes.destroy()
    
    chartInstancePlanes = new Chart(chartPlanes.value.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: distribucionPlanes.value.map(d => d.plan),
        datasets: [{
          data: distribucionPlanes.value.map(d => d.total),
          backgroundColor: getChartColors(),
          borderWidth: themeStore.theme === 'dark' ? 4 : 0,
          borderColor: themeStore.theme === 'dark' ? '#111111' : '#fff',
        }]
      },
      options: {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    })
  }
}

onMounted(async () => {
  await dashboardStore.loadDashboard()
  await dashboardStore.loadClinicasMasActivas(5)
  await nextTick()
  createCharts()
})

watch(() => themeStore.theme, () => {
  createCharts()
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