<!-- components/superadmin/Sidebar.vue -->
<template>
  <aside class="w-64 bg-slate-950 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col shadow-2xl">
    <!-- Logo -->
    <div class="px-6 py-5 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-inner">
          <i class="fas fa-crown text-amber-400 text-lg"></i>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">DentalCloud</p>
          <h1 class="text-sm font-semibold text-slate-50">Panel SuperAdmin</h1>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm">
      <SAMenuItem
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :icon="item.icon"
        :label="item.label"
        :badge="item.badge"
        :is-open="true"
      />
    </nav>

    <!-- Footer user -->
    <div class="px-4 py-4 border-t border-slate-800 bg-slate-950/80">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-100">
          {{ initials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-slate-50 truncate">
            {{ user?.nombre || 'SuperAdmin' }}
          </p>
          <p class="text-[11px] text-slate-400 truncate">
            {{ user?.rol || 'Administrador global' }}
          </p>
        </div>
        <button
          @click="$emit('logout')"
          class="ml-1 inline-flex items-center justify-center rounded-full p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-800/80 transition"
          title="Cerrar sesión"
        >
          <i class="fas fa-sign-out-alt text-xs"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import SAMenuItem from './SAMenuItem.vue'
import { useSuperAdminDashboardStore } from '../stores/superadmin/dashboard'
import { useSuperAdminAuthStore } from '../stores/superadmin/auth'

const dashboardStore = useSuperAdminDashboardStore()
const authStore = useSuperAdminAuthStore()

const user = computed(() => authStore.user)
const initials = computed(() => {
  const nombre = user.value?.nombre || 'SA'
  return nombre.substring(0, 2).toUpperCase()
})

const items = computed(() => {
  const alertas = dashboardStore.estadisticas.alertas || {}
  return [
    { to: '/superadmin/dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { to: '/superadmin/clinicas', label: 'Clínicas', icon: 'fas fa-hospital' },
    { to: '/superadmin/suscripciones', label: 'Suscripciones', icon: 'fas fa-credit-card', badge: alertas.suscripciones_por_vencer || null },
    { to: '/superadmin/planes', label: 'Planes', icon: 'fas fa-layer-group' },
    { to: '/superadmin/facturacion', label: 'Facturación', icon: 'fas fa-file-invoice-dollar', badge: alertas.facturas_pendientes || null },
    { to: '/superadmin/reportes', label: 'Reportes', icon: 'fas fa-chart-bar' },
    { to: '/superadmin/configuracion', label: 'Configuración', icon: 'fas fa-cog' },
  ]
})
</script>
