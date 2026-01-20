<!-- views/Dashboard.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-violet-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-violet-500/20 animate-pulse">Live Dashboard</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ fechaActual }}</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Hola, {{ usuarioNombre.split(' ')[0] }}
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Bienvenido al centro de mando de tu clínica</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="handleRefresh"
          :disabled="dashboardStore.loading"
          class="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all disabled:opacity-50 group"
        >
          <i :class="['fas fa-sync-alt', dashboardStore.loading ? 'fa-spin' : 'group-hover:rotate-180 transition-transform duration-500']"></i>
          {{ dashboardStore.loading ? 'Actualizando' : 'Sincronizar Datos' }}
        </button>
      </div>
    </div>

    <!-- Bento Grid Layer 1: KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Pacientes"
        :value="dashboardStore.kpis.pacientes.total"
        :subtitle="`${dashboardStore.kpis.pacientes.nuevos_mes} ingresos este mes`"
        icon="fas fa-users"
        color="#7c3aed"
        :change="12"
      />
      <KPICard
        title="Citas Hoy"
        :value="dashboardStore.kpis.citas.hoy"
        :subtitle="`${dashboardStore.kpis.citas.pendientes} por atender`"
        icon="fas fa-calendar-check"
        color="#0891b2"
        :progress="Math.round(((dashboardStore.kpis.citas.hoy - dashboardStore.kpis.citas.pendientes) / dashboardStore.kpis.citas.hoy) * 100) || 0"
      />
      <KPICard
        title="Ingresos"
        :value="dashboardStore.kpis.ingresos.mes_actual"
        :subtitle="`Meta mensual: $5.000.000`"
        icon="fas fa-wallet"
        color="#059669"
        format="currency"
        :progress="Math.round((dashboardStore.kpis.ingresos.mes_actual / 5000000) * 100)"
      />
      <KPICard
        title="Tratamientos"
        :value="dashboardStore.kpis.tratamientos.activos"
        subtitle="Planes en ejecución"
        icon="fas fa-tooth"
        color="#db2777"
      />
    </div>

    <!-- Bento Grid Layer 2: Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      <!-- Próximas Citas (Bento Large) -->
      <div class="lg:col-span-8">
        <ProximasCitasWidget
          :citas="dashboardStore.proximasCitas"
          :loading="dashboardStore.loading"
        />
      </div>

      <!-- Quick Summary (Bento Tall) -->
      <div class="lg:col-span-4 flex flex-col gap-8">
         <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group flex-1 min-h-[300px]">
            <div class="absolute -right-10 -top-10 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl group-hover:bg-violet-600/30 transition-colors"></div>
            
            <h3 class="text-sm font-black uppercase tracking-tight mb-8 relative z-10 flex items-center justify-between">
              Estado Operativo
              <i class="fas fa-chart-bar text-violet-400"></i>
            </h3>

            <div class="space-y-6 relative z-10">
              <div v-for="(stat, idx) in quickStats" :key="idx" class="flex items-center justify-between group/stat">
                <div class="flex items-center gap-4">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xs', stat.bg]">
                    <i :class="stat.icon"></i>
                  </div>
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover/stat:text-white transition-colors">{{ stat.label }}</span>
                </div>
                <span class="text-sm font-black tracking-tight">{{ stat.value }}</span>
              </div>
            </div>

            <div class="mt-12 pt-8 border-t border-white/5 relative z-10">
               <button class="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">Ver Reporte Detallado</button>
            </div>
         </div>
      </div>
    </div>

    <!-- Quick Access (Horizontal Grid) -->
    <div class="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
       <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-gray-50 rounded-full blur-3xl"></div>
       
       <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight mb-8 relative z-10">Acciones Frecuentes</h3>
       
       <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
          <router-link
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="flex flex-col items-center gap-4 p-6 bg-gray-50/50 rounded-[2rem] hover:bg-white hover:shadow-2xl hover:scale-105 transition-all group border border-transparent hover:border-gray-100"
          >
            <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all group-hover:shadow-lg', link.bg, link.text]">
              <i :class="link.icon"></i>
            </div>
            <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center group-hover:text-gray-900 transition-colors">{{ link.label }}</span>
          </router-link>
       </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@clinica/stores/dashboard'
import { useProfesionalesStore } from '@clinica/stores/profesionales'
import { useAuthStore } from '@shared/stores/auth'
import KPICard from '@clinica/components/dashboard/KPICard.vue'
import ProximasCitasWidget from '@clinica/components/dashboard/ProximasCitasWidget.vue'

const dashboardStore = useDashboardStore()
const profesionalesStore = useProfesionalesStore()
const authStore = useAuthStore()

const usuarioNombre = computed(() => authStore.user?.nombre || 'Colega')

const fechaActual = computed(() => {
  return new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  })
})

const quickStats = computed(() => [
  { label: 'Especialistas', value: `${profesionalesStore.totalActivos} Activos`, icon: 'fas fa-user-md', bg: 'bg-blue-500/10 text-blue-400' },
  { label: 'Agenda Semanal', value: dashboardStore.kpis.citas.semana, icon: 'fas fa-calendar-week', bg: 'bg-emerald-500/10 text-emerald-400' },
  { label: 'Fichas Activas', value: dashboardStore.kpis.pacientes.activos, icon: 'fas fa-id-card', bg: 'bg-orange-500/10 text-orange-400' },
  { label: 'Productividad', value: '84%', icon: 'fas fa-rocket', bg: 'bg-violet-500/10 text-violet-400' }
])

const quickLinks = [
  { to: '/pacientes', label: 'Pacientes', icon: 'fas fa-users', bg: 'bg-violet-50', text: 'text-violet-600' },
  { to: '/calendario', label: 'Agenda', icon: 'fas fa-calendar-plus', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { to: '/profesionales', label: 'Staff', icon: 'fas fa-user-md', bg: 'bg-blue-50', text: 'text-blue-600' },
  { to: '/facturacion', label: 'Finanzas', icon: 'fas fa-wallet', bg: 'bg-orange-50', text: 'text-orange-600' },
  { to: '/tratamientos', label: 'Servicios', icon: 'fas fa-tooth', bg: 'bg-pink-50', text: 'text-pink-600' },
  { to: '/configuracion', label: 'Ajustes', icon: 'fas fa-cog', bg: 'bg-gray-100', text: 'text-gray-600' }
]

async function handleRefresh() {
  await dashboardStore.loadDashboard()
}

onMounted(async () => {
  await dashboardStore.loadDashboard()
  if (profesionalesStore.profesionales.length === 0) {
    await profesionalesStore.fetchProfesionales()
  }
})
</script>

<style scoped>
@keyframes fade-in { 
  from { opacity: 0; transform: translateY(10px); } 
  to { opacity: 1; transform: translateY(0); } 
}
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
</style>