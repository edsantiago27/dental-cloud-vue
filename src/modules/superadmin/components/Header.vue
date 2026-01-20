<template>
  <header class="h-20 lg:h-24 sticky top-0 z-40 bg-white/70 dark:bg-[#111111]/70 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 lg:px-10 flex justify-between items-center transition-colors duration-500">
    
    <!-- Title & Breadcrumbs -->
    <div class="flex flex-col">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[9px] font-black text-violet-500 dark:text-orange-500 uppercase tracking-[0.2em]">Plataforma Global</span>
        <div class="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10"></div>
        <span class="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">DentalCloud</span>
      </div>
      <h1 class="text-xl lg:text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none group cursor-default">
        {{ title }}
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-orange-500 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"></span>
      </h1>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-6">
      
      <!-- Stats Pill (Desktop) -->
      <div class="hidden xl:flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-1.5 pr-4 rounded-2xl">
        <div class="w-9 h-9 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm flex items-center justify-center text-emerald-500">
          <i class="fas fa-chart-line text-sm"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">MRR Global</span>
          <span class="text-xs font-black text-gray-900 dark:text-white">{{ formatMoney(estadisticas.ingresos?.mrr || 0) }}</span>
        </div>
      </div>

      <div class="hidden xl:flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-1.5 pr-4 rounded-2xl">
        <div class="w-9 h-9 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm flex items-center justify-center text-blue-500">
          <i class="fas fa-hospital text-sm"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Clínicas</span>
          <span class="text-xs font-black text-gray-900 dark:text-white">{{ estadisticas.clinicas?.activas || 0 }}</span>
        </div>
      </div>

      <!-- Notifications -->
      <button class="w-12 h-12 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 dark:text-white/40 hover:text-violet-600 dark:hover:text-orange-500 hover:bg-white dark:hover:bg-white/5 hover:shadow-sm transition-all relative">
        <i class="fas fa-bell"></i>
        <span v-if="alertasCount > 0" class="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111111]"></span>
      </button>

      <!-- Global Search Toggle -->
      <button class="w-12 h-12 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-[#111111] flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-gray-200 dark:shadow-none">
        <i class="fas fa-search"></i>
      </button>

    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useSuperAdminDashboardStore } from '@superadmin/stores/dashboard'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: false, default: '' },
})

const dashboardStore = useSuperAdminDashboardStore()
const estadisticas = computed(() => dashboardStore.estadisticas)

const alertasCount = computed(() => {
  const a = estadisticas.value.alertas || {}
  return (a.suscripciones_por_vencer || 0) + (a.facturas_pendientes || 0)
})

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>
