<template>
  <div class="min-h-screen transition-colors duration-500 bg-slate-100 dark:bg-[#0a0a0a]">
    <div class="flex h-screen overflow-hidden">
      
      <!-- Sidebar Component -->
      <SuperAdminSidebar @logout="handleLogout" />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        <!-- Header Component -->
        <SuperAdminHeader :title="pageTitle" :subtitle="pageSubtitle" />

        <!-- Main Viewport -->
        <main class="flex-1 overflow-y-auto px-6 lg:px-10 py-8 lg:py-10 custom-scrollbar relative z-10">
          <div class="max-w-[1600px] mx-auto">
            <router-view v-slot="{ Component }">
              <transition 
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform translate-y-4 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform translate-y-4 opacity-0"
                mode="out-in"
              >
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </main>

        <!-- Dynamic Accent for Light/Dark -->
        <div class="fixed bottom-0 right-0 w-[500px] h-[500px] -mr-32 -mb-32 pointer-events-none opacity-50">
          <div v-if="themeStore.theme === 'dark'" class="w-full h-full bg-orange-500/5 rounded-full blur-[120px]"></div>
          <div v-else class="w-full h-full bg-violet-500/[0.03] rounded-full blur-[120px]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SuperAdminSidebar from '@superadmin/components/Sidebar.vue'
import SuperAdminHeader from '@superadmin/components/Header.vue'
import { useSuperAdminAuthStore } from '@superadmin/stores/auth'
import { useSuperAdminDashboardStore } from '@superadmin/stores/dashboard'
import { useSuperAdminThemeStore } from '@superadmin/stores/theme'

const route = useRoute()
const router = useRouter()
const authStore = useSuperAdminAuthStore()
const dashboardStore = useSuperAdminDashboardStore()
const themeStore = useSuperAdminThemeStore()

const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Dashboard',
    clinicas: 'Gestión de Clínicas',
    suscripciones: 'Suscripciones',
    planes: 'Planes',
    facturacion: 'Facturación',
    reportes: 'Reportes',
    configuracion: 'Configuración del Sistema',
  }
  const path = route.path.split('/').pop()
  return titles[path] || 'Panel de Administración'
})

const pageSubtitle = computed(() => {
  const subtitles = {
    dashboard: 'Visión general del rendimiento de la plataforma',
    clinicas: 'Administra todas las clínicas de DentalCloud',
    suscripciones: 'Controla el estado de las suscripciones',
    planes: 'Diseña y ajusta los planes comerciales',
    facturacion: 'Visualiza y gestiona la facturación global',
    reportes: 'Analiza métricas clave del negocio',
    configuracion: 'Configura la plataforma a nivel global',
  }
  const path = route.path.split('/').pop()
  return subtitles[path] || 'DentalCloud SuperAdmin'
})

async function handleLogout() {
  await authStore.logout()
  router.push('/superadmin/login')
}

onMounted(async () => {
  authStore.checkAuth()
  themeStore.applyTheme()
  if (!dashboardStore.estadisticas.clinicas?.total) {
    await dashboardStore.loadDashboard()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
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
