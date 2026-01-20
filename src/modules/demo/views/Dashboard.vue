<!-- src/modules/demo/views/Dashboard.vue -->
<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Bienvenida -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Dashboard Clínica</h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Snapshot de gestión inteligente en tiempo real</p>
      </div>
      <div class="flex items-center gap-3 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Hoy</span>
          <span class="text-xs font-black text-gray-900 uppercase tracking-tight">{{ today }}</span>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
        <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <i class="fas fa-users"></i>
        </div>
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pacientes</p>
        <p class="text-3xl font-black text-gray-900 tracking-tighter">{{ pacientesStore.pacientes.length }}</p>
      </div>

      <div class="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
        <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <i class="fas fa-calendar-check"></i>
        </div>
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Citas Hoy</p>
        <p class="text-3xl font-black text-gray-900 tracking-tighter">{{ agendaStore.appointments.length }}</p>
      </div>

      <div class="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
        <div class="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <i class="fas fa-box-open"></i>
        </div>
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Crítico</p>
        <p class="text-3xl font-black text-gray-900 tracking-tighter">{{ inventarioStore.stockBajo.length }}</p>
      </div>

      <div class="bg-violet-600 rounded-[2rem] p-6 text-white shadow-xl shadow-violet-200 group">
        <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <i class="fas fa-chart-line"></i>
        </div>
        <p class="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Recaudación</p>
        <p class="text-2xl font-black tracking-tighter">$1.240.000</p>
      </div>
    </div>

    <!-- Agenda & Stock -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Próximas Citas -->
      <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm border-t-4 border-t-violet-600">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight">Próximos Turnos</h3>
          <router-link to="/demo-tour/agenda" class="text-[9px] font-black text-violet-600 uppercase tracking-widest hover:underline">Ir a Agenda</router-link>
        </div>
        <div class="space-y-4">
          <div v-for="app in agendaStore.appointments.slice(0, 4)" :key="app.id" class="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all group">
            <div class="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm font-black text-[10px] text-gray-900">
              {{ app.hora }}
            </div>
            <div class="flex-1">
              <p class="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{{ getPacienteName(app.paciente_id) }}</p>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{{ app.motivo }}</p>
            </div>
            <div 
              class="w-2.5 h-2.5 rounded-full" 
              :style="{ backgroundColor: getStatusColor(app.estado) }"
              :title="app.estado"
            ></div>
          </div>
        </div>
      </div>

      <!-- Alertas de Inventario -->
      <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm border-t-4 border-t-orange-500">
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight">Reposición Necesaria</h3>
          <router-link to="/demo-tour/inventario" class="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline">Ver Almacén</router-link>
        </div>
        <div class="space-y-4">
          <div v-for="item in inventarioStore.stockBajo" :key="item.id" class="flex items-center gap-4 p-4 bg-red-50/50 rounded-2xl">
            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm">
              <i class="fas fa-exclamation-triangle text-xs text-orange-500"></i>
            </div>
            <div class="flex-1">
              <p class="text-xs font-black text-gray-900 uppercase tracking-tight">{{ item.nombre }}</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-orange-500" :style="{ width: (item.stock / item.stock_minimo * 100) + '%' }"></div>
                </div>
                <span class="text-[9px] font-black text-orange-600 uppercase">{{ item.stock }} UNID.</span>
              </div>
            </div>
          </div>
          <div v-if="inventarioStore.stockBajo.length === 0" class="p-10 text-center font-black text-[9px] text-emerald-500 uppercase tracking-widest">
            Stock en niveles óptimos
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDemoPacientesStore } from '../stores/demoPacientes'
import { useDemoAgendaStore } from '../stores/demoAgenda'
import { useDemoInventarioStore } from '../stores/demoInventario'

const pacientesStore = useDemoPacientesStore()
const agendaStore = useDemoAgendaStore()
const inventarioStore = useDemoInventarioStore()

const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

function getPacienteName(id) {
  const p = pacientesStore.pacientes.find(p => p.id === id)
  return p ? p.nombre : 'Paciente Demo'
}

function getStatusColor(status) {
  const est = agendaStore.estados.find(e => e.value === status)
  return est ? est.color : '#94a3b8'
}

onMounted(() => {
  pacientesStore.fetchPacientes()
  agendaStore.fetchAppointments()
  inventarioStore.fetchItems()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
</style>
