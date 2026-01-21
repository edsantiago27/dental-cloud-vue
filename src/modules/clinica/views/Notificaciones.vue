<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-violet-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-violet-500/20">Centro de Avisos</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Notificaciones del Sistema</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Notificaciones
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Mantente al día con la actividad de la clínica</p>
      </div>
    </div>

    <!-- Lista de Notificaciones -->
    <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden min-h-[500px]">
      <div v-if="notificationsStore.loading && notificationsStore.notificaciones.length === 0" class="flex flex-col items-center justify-center py-20">
        <i class="fas fa-circle-notch fa-spin text-4xl text-violet-100 mb-4"></i>
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargando avisos...</p>
      </div>

      <div v-else-if="notificationsStore.notificaciones.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6">
          <i class="fas fa-bell-slash text-2xl text-gray-200"></i>
        </div>
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">No hay notificaciones pendientes</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="noti in notificationsStore.notificaciones" 
          :key="noti.id"
          :class="[
            'p-6 rounded-3xl border transition-all duration-300 flex items-center gap-6 group',
            noti.read_at 
              ? 'bg-gray-50/50 border-gray-100 opacity-60' 
              : 'bg-white border-violet-100 shadow-lg shadow-violet-500/5 hover:border-violet-300'
          ]"
        >
          <!-- Icono segun tipo -->
          <div :class="[
            'w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-sm',
            getIconBg(noti.data.tipo)
          ]">
            <i :class="getIcon(noti.data.tipo)"></i>
          </div>

          <!-- Contenido -->
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[8px] font-black uppercase tracking-widest text-violet-500">
                {{ noti.data.tipo?.replace('_', ' ') || 'SISTEMA' }}
              </span>
              <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                {{ formatTime(noti.created_at) }}
              </span>
            </div>
            <p class="text-[11px] font-black text-gray-900 uppercase tracking-tight leading-relaxed">
              {{ noti.data.mensaje }}
            </p>
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-2">
            <button 
              v-if="!noti.read_at"
              @click="markRead(noti.id)"
              class="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center hover:scale-110 transition shadow-lg shadow-violet-500/20"
              title="Marcar como leída"
            >
              <i class="fas fa-check text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotificationsStore } from '@clinica/stores/notificaciones'

const notificationsStore = useNotificationsStore()

function getIcon(tipo) {
  switch(tipo) {
    case 'cita_proxima': return 'fas fa-calendar-check'
    case 'pago_recibido': return 'fas fa-hand-holding-usd'
    default: return 'fas fa-info-circle'
  }
}

function getIconBg(tipo) {
  switch(tipo) {
    case 'cita_proxima': return 'bg-violet-50 text-violet-600'
    case 'pago_recibido': return 'bg-emerald-50 text-emerald-600'
    default: return 'bg-blue-50 text-blue-600'
  }
}

function formatTime(date) {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now - then) / 1000)

  if (diffInSeconds < 60) return 'hace unos segundos'
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
  return then.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

async function markRead(id) {
  await notificationsStore.marcarComoLeida(id)
}

onMounted(() => {
  notificationsStore.fetchNotificaciones()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
