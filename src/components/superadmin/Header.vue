<template>
  <header class="bg-white border-b border-slate-200/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
      <!-- Title -->
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
          SuperAdmin
        </p>
        <h1 class="text-xl sm:text-2xl font-semibold text-slate-900 leading-tight">
          {{ title }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          {{ subtitle }}
        </p>
      </div>

      <!-- Quick stats / alerts -->
      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-6">
          <div class="text-right">
            <p class="text-[11px] text-slate-400">MRR</p>
            <p class="text-base font-semibold text-emerald-600">
              {{ formatMoney(estadisticas.ingresos?.mrr || 0) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-[11px] text-slate-400">Clínicas activas</p>
            <p class="text-base font-semibold text-sky-600">
              {{ estadisticas.clinicas?.activas || 0 }}
            </p>
          </div>
        </div>

        <button
          class="relative inline-flex items-center justify-center rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          title="Alertas"
        >
          <i class="fas fa-bell text-lg"></i>
          <span
            v-if="alertasCount > 0"
            class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center"
          >
            {{ alertasCount }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useSuperAdminDashboardStore } from '@/stores/superadmin/dashboard'

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
