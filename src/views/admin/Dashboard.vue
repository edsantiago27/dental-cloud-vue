<!-- views/Dashboard-View.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    
    <!-- Header con saludo -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        <i class="fas fa-chart-line text-blue-600 mr-3"></i>
        Dashboard
      </h1>
      <p class="text-gray-600 mt-1">
        Bienvenido de vuelta, {{ usuarioNombre }} 👋
      </p>
      <p class="text-sm text-gray-500">
        {{ fechaActual }}
      </p>
    </div>

    <!-- Botón Refrescar -->
    <div class="flex justify-end mb-4">
      <button
        @click="handleRefresh"
        :disabled="dashboardStore.loading"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
      >
        <i 
          :class="[
            'fas fa-sync-alt',
            dashboardStore.loading ? 'fa-spin' : ''
          ]"
        ></i>
        {{ dashboardStore.loading ? 'Actualizando...' : 'Actualizar' }}
      </button>
    </div>

    <!-- KPIs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      
      <!-- Pacientes -->
      <KPICard
        title="Total Pacientes"
        :value="dashboardStore.kpis.pacientes.total"
        :subtitle="`${dashboardStore.kpis.pacientes.nuevos_mes} nuevos este mes`"
        icon="fas fa-users"
        color="#3B82F6"
      />

      <!-- Citas Hoy -->
      <KPICard
        title="Citas Hoy"
        :value="dashboardStore.kpis.citas.hoy"
        :subtitle="`${dashboardStore.kpis.citas.pendientes} pendientes`"
        icon="fas fa-calendar-day"
        color="#10B981"
      />

      <!-- Ingresos del Mes -->
      <KPICard
        title="Ingresos del Mes"
        :value="dashboardStore.kpis.ingresos.mes_actual"
        :subtitle="`${formatCurrency(dashboardStore.kpis.ingresos.pendiente)} pendiente`"
        icon="fas fa-dollar-sign"
        color="#F59E0B"
        format="currency"
      />

      <!-- Tratamientos Activos -->
      <KPICard
        title="Tratamientos Activos"
        :value="dashboardStore.kpis.tratamientos.activos"
        :subtitle="`En curso`"
        icon="fas fa-tooth"
        color="#6366F1"
      />

    </div>

    <!-- Fila de Widgets -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      
      <!-- Próximas Citas (2 columnas) -->
      <div class="lg:col-span-2">
        <ProximasCitasWidget
          :citas="dashboardStore.proximasCitas"
          :loading="dashboardStore.loading"
        />
      </div>

      <!-- Resumen Rápido -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-chart-bar text-blue-600 mr-2"></i>
          Resumen Rápido
        </h3>

        <div class="space-y-4">
          
          <!-- Profesionales -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-user-md text-blue-600"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Profesionales</p>
                <p class="font-semibold text-gray-900">
                  {{ profesionalesStore.totalActivos }} activos
                </p>
              </div>
            </div>
          </div>

          <!-- Citas Semana -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-calendar-week text-green-600"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Citas esta semana</p>
                <p class="font-semibold text-gray-900">
                  {{ dashboardStore.kpis.citas.semana }}
                </p>
              </div>
            </div>
          </div>

          <!-- Pacientes Activos -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-user-check text-purple-600"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Pacientes activos</p>
                <p class="font-semibold text-gray-900">
                  {{ dashboardStore.kpis.pacientes.activos }}
                </p>
              </div>
            </div>
          </div>

          <!-- Citas Mes -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <i class="fas fa-calendar-alt text-orange-600"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">Citas este mes</p>
                <p class="font-semibold text-gray-900">
                  {{ dashboardStore.kpis.citas.mes }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Accesos Rápidos -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        <i class="fas fa-bolt text-blue-600 mr-2"></i>
        Accesos Rápidos
      </h3>

      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        
        <router-link
          to="/pacientes"
          class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition">
            <i class="fas fa-users text-blue-600 text-xl group-hover:text-white transition"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 text-center">Pacientes</span>
        </router-link>

        <router-link
          to="/citas"
          class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition">
            <i class="fas fa-calendar text-green-600 text-xl group-hover:text-white transition"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 text-center">Citas</span>
        </router-link>

        <router-link
          to="/profesionales"
          class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-purple-50 hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition">
            <i class="fas fa-user-md text-purple-600 text-xl group-hover:text-white transition"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 text-center">Profesionales</span>
        </router-link>

        <router-link
          to="/facturacion"
          class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-orange-50 hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition">
            <i class="fas fa-file-invoice-dollar text-orange-600 text-xl group-hover:text-white transition"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 text-center">Facturación</span>
        </router-link>

        <router-link
          to="/historia-clinica"
          class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-pink-50 hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-600 transition">
            <i class="fas fa-notes-medical text-pink-600 text-xl group-hover:text-white transition"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 text-center">Historia Clínica</span>
        </router-link>

        <router-link
          to="/configuracion"
          class="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-200 hover:shadow-md transition group"
        >
          <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition">
            <i class="fas fa-cog text-gray-600 text-xl group-hover:text-white transition"></i>
          </div>
          <span class="text-sm font-medium text-gray-700 text-center">Configuración</span>
        </router-link>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useProfesionalesStore } from '@/stores/profesionales'
import { useAuthStore } from '@/stores/auth'
import KPICard from '@/components/dashboard/KPICard.vue'
import ProximasCitasWidget from '@/components/dashboard/ProximasCitasWidget.vue'

const dashboardStore = useDashboardStore()
const profesionalesStore = useProfesionalesStore()
const authStore = useAuthStore()

const usuarioNombre = computed(() => {
  return authStore.user?.nombre || 'Usuario'
})

const fechaActual = computed(() => {
  const opciones = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date().toLocaleDateString('es-ES', opciones)
})

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value || 0)
}

async function handleRefresh() {
  await dashboardStore.refresh()
}

onMounted(async () => {
  // Cargar datos del dashboard
  await dashboardStore.loadDashboard()
  
  // Cargar profesionales si no están cargados
  if (profesionalesStore.profesionales.length === 0) {
    await profesionalesStore.fetchProfesionales()
  }
})
</script>