<template>
  <aside class="w-64 bg-slate-50 dark:bg-[#111111] border-r border-gray-100 dark:border-white/5 flex flex-col transition-colors duration-500 overflow-hidden relative">
    
    <!-- Accent Blur for Dark Mode -->
    <div v-if="themeStore.theme === 'dark'" class="absolute -left-20 -top-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none"></div>

    <!-- Logo Section -->
    <div class="p-8 relative z-10">
      <div class="flex items-center gap-3 group cursor-pointer">
        <div class="w-10 h-10 bg-violet-600 dark:bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:scale-110">
          <i class="fas fa-crown text-sm"></i>
        </div>
        <div>
          <h1 class="text-sm font-black tracking-tight text-gray-900 dark:text-white uppercase">DentalCloud</h1>
          <p class="text-[9px] font-black text-violet-500 dark:text-orange-500 uppercase tracking-[0.2em] mt-0.5">SuperAdmin</p>
        </div>
      </div>
    </div>

    <!-- Theme Toggle Switch -->
    <div class="px-6 mb-4 relative z-10">
      <div 
        @click="themeStore.toggleTheme"
        class="bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl flex items-center cursor-pointer transition-all border border-gray-200 dark:border-white/5"
      >
        <div 
          :class="[
            themeStore.theme === 'light' ? 'bg-white text-violet-600 shadow-sm' : 'text-gray-400',
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase transition-all'
          ]"
        >
          <i class="fas fa-sun"></i>
          <span v-if="themeStore.theme === 'light'">Claro</span>
        </div>
        <div 
          :class="[
            themeStore.theme === 'dark' ? 'bg-[#1a1a1a] text-orange-500 shadow-sm' : 'text-gray-400',
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase transition-all'
          ]"
        >
          <i class="fas fa-moon"></i>
          <span v-if="themeStore.theme === 'dark'">Oscuro</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10">
      <router-link
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-5 py-3.5 text-gray-400 dark:text-white/40 rounded-2xl transition-all duration-300 group hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
        active-class="active-nav-item"
      >
        <i :class="[item.icon, 'text-base transition-transform group-hover:scale-110']"></i>
        <span class="text-xs font-bold">{{ item.label }}</span>
        <span v-if="item.badge" class="ml-auto bg-violet-100 dark:bg-orange-500/20 text-violet-600 dark:text-orange-500 px-2 py-0.5 rounded-lg text-[9px] font-black">
          {{ item.badge }}
        </span>
      </router-link>
    </nav>

    <!-- Bottom User -->
    <div class="p-6 mt-auto relative z-10">
      <div class="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-[2rem] p-4 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-9 h-9 bg-violet-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-violet-600 dark:text-orange-500 font-black text-xs">
            {{ initials }}
          </div>
          <div class="min-w-0">
            <p class="text-[11px] font-black text-gray-900 dark:text-white truncate uppercase">{{ user?.nombre || 'Admin' }}</p>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Global Access</p>
          </div>
        </div>
        <button
          @click="$emit('logout')"
          class="w-full py-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]"
        >
          Salir del sistema
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useSuperAdminDashboardStore } from '@superadmin/stores/dashboard'
import { useSuperAdminAuthStore } from '@superadmin/stores/auth'
import { useSuperAdminThemeStore } from '@superadmin/stores/theme'

const dashboardStore = useSuperAdminDashboardStore()
const authStore = useSuperAdminAuthStore()
const themeStore = useSuperAdminThemeStore()

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

<style scoped>
.active-nav-item {
  background-color: white;
  color: #111827; /* gray-900 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-weight: 900;
}

.dark .active-nav-item {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  box-shadow: none;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.active-nav-item i {
  color: #7c3aed; /* violet-600 */
  transform: scale(1.1);
}

.dark .active-nav-item i {
  color: #f97316; /* orange-500 */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.05);
}
</style>
