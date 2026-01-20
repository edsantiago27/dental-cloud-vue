<template>
  <div class="space-y-8 lg:space-y-10 pb-12">
    
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 animate-pulse">
      <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
      </div>
      <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Sincronizando tus datos...</p>
    </div>

    <!-- Dashboard Content -->
    <template v-else>
      
      <!-- Top Section: Welcome & Quick Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        <!-- Welcome Banner (Bento 1) -->
        <div class="lg:col-span-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-200 group">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
          <div class="relative z-10">
            <span class="inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Resumen de Salud
            </span>
            <h1 class="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
              Hola, <span class="text-blue-400">{{ (authStore.userName || 'Paciente').split(' ')[0] }}</span>. <br class="hidden md:block">
              Tu sonrisa es nuestra prioridad.
            </h1>
            <p class="text-gray-400 font-medium text-lg max-w-md">
              Tienes <span class="text-white font-bold">{{ proximaCita ? '1 cita programada' : '0 citas pendientes' }}</span> y tu historial está actualizado.
            </p>
          </div>
        </div>

        <!-- Quick Info Widget (Bento 2) -->
        <div class="lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between">
          <div class="flex justify-between items-start">
            <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
              <i class="fas fa-hospital-user text-2xl"></i>
            </div>
            <span class="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Activo</span>
          </div>
          <div>
            <h3 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Clínica Actual</h3>
            <p class="text-2xl font-bold text-gray-900 truncate">{{ authStore.clinica?.nombre || 'DentalCloud' }}</p>
            <div class="flex items-center gap-2 mt-3 text-xs text-gray-500 font-bold">
              <i class="fas fa-map-marker-alt text-blue-500"></i>
              <span>{{ authStore.clinica?.ciudad || 'Santiago' }}, Chile</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Main Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        
        <!-- Next Appointment Widget (Large Bento) -->
        <div class="md:col-span-2 bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-100 relative overflow-hidden flex flex-col justify-between min-h-[340px]">
          <div class="absolute top-0 right-0 p-10 opacity-10 translate-x-10 -translate-y-10">
            <i class="fas fa-calendar-alt text-[200px]"></i>
          </div>
          
          <div class="relative z-10 flex justify-between">
            <h2 class="text-2xl font-bold tracking-tight">Próxima Consulta</h2>
            <router-link :to="{ name: 'paciente-citas' }" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all">
              <i class="fas fa-external-link-alt text-sm"></i>
            </router-link>
          </div>

          <div v-if="proximaCita" class="relative z-10 mt-10">
            <div class="flex items-end gap-2 mb-4">
              <span class="text-7xl font-bold leading-none tracking-tighter">{{ formatDia(proximaCita.fecha) }}</span>
              <div class="flex flex-col mb-1">
                <span class="text-xl font-bold uppercase tracking-widest opacity-80 leading-none">{{ formatMes(proximaCita.fecha) }}</span>
                <span class="text-sm font-bold opacity-60">{{ new Date(proximaCita.fecha).getFullYear() }}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mt-8 border-t border-white/20 pt-8">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <i class="fas fa-clock text-blue-200"></i>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Hora</p>
                  <p class="font-bold">{{ proximaCita.hora?.substring(0, 5) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <i class="fas fa-user-md text-blue-200"></i>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Doctor</p>
                  <p class="font-bold truncate">{{ proximaCita.profesional?.nombre }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="relative z-10 py-10">
            <p class="text-2xl font-bold opacity-50">No tienes citas agendadas próximamente</p>
            <router-link :to="{ name: 'paciente-citas' }" class="mt-8 inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-blue-700/20">
              <i class="fas fa-plus"></i>
              Agendar Ahora
            </router-link>
          </div>
        </div>

        <!-- Balance Widget -->
        <div class="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100 flex flex-col justify-between shadow-sm">
          <div class="flex justify-between items-center">
            <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <i class="fas fa-wallet text-xl"></i>
            </div>
            <router-link :to="{ name: 'paciente-pagos' }" class="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline">Historial</router-link>
          </div>
          
          <div class="mt-10">
            <h3 class="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Deuda Pendiente</h3>
            <div class="flex items-baseline gap-1">
              <span class="text-gray-900 text-5xl font-black tracking-tighter">${{ formatMonto(resumenPagos.total_pendiente) }}</span>
              <span class="text-gray-400 font-bold text-lg">CLP</span>
            </div>
            <p class="text-gray-500 font-semibold text-xs mt-4 bg-white/50 inline-block px-3 py-1 rounded-full border border-white">
              {{ resumenPagos.cuentas_pendientes }} comprobantes pendientes
            </p>
          </div>

          <button class="mt-8 w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100/50 hover:bg-indigo-700 transition active:scale-[0.98]">
            Pagar Ahora
          </button>
        </div>

        <!-- Transactions List Widget -->
        <div class="lg:row-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col">
          <div class="flex justify-between items-center mb-10">
            <h3 class="text-gray-900 font-bold text-xl tracking-tight">Pagos Pendientes</h3>
            <router-link :to="{ name: 'paciente-pagos' }" class="text-blue-600 text-xs font-bold uppercase tracking-widest">Ver Todos</router-link>
          </div>

          <div v-if="cuentasPendientes.length === 0" class="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-10">
            <div class="w-20 h-20 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center mb-4">
              <i class="fas fa-check text-2xl"></i>
            </div>
            <p class="font-bold">¡Estás al día!</p>
          </div>

          <div v-else class="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div v-for="cuenta in cuentasPendientes.slice(0, 5)" :key="cuenta.id" class="flex items-center justify-between group cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-red-500 group-hover:text-white">
                  <i class="fas fa-file-invoice-dollar"></i>
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm truncate max-w-[140px]">{{ cuenta.concepto }}</h4>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{{ formatFechaCorta(cuenta.created_at) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-black text-gray-900 leading-none">${{ formatMonto(cuenta.saldo_pendiente || cuenta.total) }}</p>
                <p class="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1">Vencido</p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-50">
            <p class="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">DentalCloud Seguridad Garantizada</p>
          </div>
        </div>

        <!-- Quick Actions Grid -->
        <div class="md:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
          <h3 class="text-gray-900 font-bold text-xl tracking-tight mb-8">Accesos Rápidos</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <router-link
              v-for="action in quickActions"
              :key="action.label"
              :to="action.to"
              class="flex flex-col items-center justify-center p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 group"
            >
              <div :class="[action.bg, action.color, 'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm']">
                <i :class="[action.icon, 'text-xl']"></i>
              </div>
              <span class="text-[13px] font-bold text-gray-700 tracking-tight text-center">{{ action.label }}</span>
            </router-link>
          </div>
        </div>

        <!-- Clinic Contact Extra (Half Widget) -->
        <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl shadow-gray-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
              <i class="fas fa-headset text-blue-400"></i>
            </div>
            <h4 class="font-bold tracking-tight">¿Necesitas ayuda?</h4>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center gap-3 group">
              <i class="fas fa-phone text-blue-400 bg-white/5 w-10 h-10 flex items-center justify-center rounded-xl transition-all group-hover:bg-blue-400 group-hover:text-white"></i>
              <span class="text-sm font-semibold">{{ authStore.clinica?.telefono || '+56 9 1234 5678' }}</span>
            </div>
            <div class="flex items-center gap-3 group">
              <i class="fas fa-envelope text-blue-400 bg-white/5 w-10 h-10 flex items-center justify-center rounded-xl transition-all group-hover:bg-blue-400 group-hover:text-white"></i>
              <span class="text-sm font-semibold truncate">{{ authStore.clinica?.email || 'hola@clinica.cl' }}</span>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-white/10">
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
              Horario: {{ authStore.clinica?.horario_atencion || 'Lun-Vie 9:00 - 18:00' }}
            </p>
          </div>
        </div>

      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePacienteAuthStore } from '@paciente/stores/auth'
import { usePacienteCitasStore } from '@paciente/stores/citas'
import { pagosService } from '../services'

const authStore = usePacienteAuthStore()
const citasStore = usePacienteCitasStore()

// State
const resumenPagos = ref({
  total_pendiente: 0,
  total_pagado: 0,
  cuentas_pendientes: 0
})
const cuentasPendientes = ref([])

// Quick Actions config
const quickActions = [
  { label: 'Nueva Cita', to: { name: 'paciente-citas' }, icon: 'fas fa-plus', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Mi Historia', to: { name: 'paciente-historia-clinica' }, icon: 'fas fa-notes-medical', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Ver Pagos', to: { name: 'paciente-pagos' }, icon: 'fas fa-wallet', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Documentos', to: { name: 'paciente-documentos' }, icon: 'fas fa-folder-open', color: 'text-purple-600', bg: 'bg-purple-50' },
]

// Computed
const proximaCita = computed(() => citasStore.proximaCita)
const loading = computed(() => citasStore.loading || authStore.loading)

// Methods
function formatMonto(monto) {
  if (!monto && monto !== 0) return '0'
  return new Intl.NumberFormat('es-CL').format(monto)
}

function formatFechaCorta(fecha) {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function formatDia(fecha) {
  if (!fecha) return ''
  return new Date(fecha).getDate()
}

function formatMes(fecha) {
  if (!fecha) return ''
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return meses[new Date(fecha).getMonth()]
}

async function cargarDatos() {
  try {
    await citasStore.fetchCitas()
    
    // Cargar resumen de pagos
    const pagosResponse = await pagosService.getResumen()
    if (pagosResponse.success !== false) {
      resumenPagos.value = pagosResponse.data || pagosResponse || resumenPagos.value
    }

    // Cargar cuentas pendientes
    const cuentasResponse = await pagosService.getCuentas('pendiente')
    if (cuentasResponse.success !== false) {
      cuentasPendientes.value = cuentasResponse.data || cuentasResponse || []
    }
  } catch (err) {
    console.error('Error al cargar datos del dashboard:', err)
  }
}

onMounted(async () => {
  if (!authStore.user || !authStore.clinica) {
    await authStore.fetchPerfil()
  }
  await cargarDatos()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #e2e8f0;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Transición suave para los bento-grids */
.grid > div {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.grid > div:hover {
  transform: translateY(-5px);
}
</style>
