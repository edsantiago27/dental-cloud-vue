<template>
  <div class="min-h-screen bg-slate-50 flex">
    <SuperAdminSidebar @logout="handleLogout" />

    <div class="flex-1 flex flex-col">
      <SuperAdminHeader :title="pageTitle" :subtitle="pageSubtitle" />

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SuperAdminSidebar from '@/components/superadmin/Sidebar.vue'
import SuperAdminHeader from '@/components/superadmin/Header.vue'
import { useSuperAdminAuthStore } from '@/stores/superadmin/auth'
import { useSuperAdminDashboardStore } from '@/stores/superadmin/dashboard'

const route = useRoute()
const router = useRouter()
const authStore = useSuperAdminAuthStore()
const dashboardStore = useSuperAdminDashboardStore()

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
  if (!dashboardStore.estadisticas.clinicas?.total) {
    await dashboardStore.loadDashboard()
  }
})
</script>

<style scoped>
/* El estilo principal lo dan los componentes hijos */
</style>
