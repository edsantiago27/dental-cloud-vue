<!-- components/dashboard/ProximasCitasWidget.vue -->
<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm transition-all hover:shadow-xl group h-full flex flex-col">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight">Próximos Turnos</h3>
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sincronización en tiempo real</p>
      </div>
      <router-link 
        to="/calendario"
        class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all shadow-sm"
      >
        <i class="fas fa-external-link-alt text-[10px]"></i>
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center py-12">
      <div class="w-8 h-8 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
    </div>

    <!-- Lista de citas -->
    <div v-else-if="citas.length > 0" class="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
      <div
        v-for="cita in citas"
        :key="cita.id"
        class="flex items-center gap-5 p-5 bg-gray-50/50 rounded-[1.8rem] hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all border border-transparent hover:border-gray-100 cursor-pointer group/item"
        @click="handleViewCita(cita)"
      >
        <!-- Bloque de Tiempo -->
        <div class="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm font-black text-gray-900 border border-gray-100 group-hover/item:border-violet-200 transition-colors">
          <span class="text-lg tracking-tighter">{{ formatHora(cita.hora) }}</span>
          <span class="text-[8px] text-violet-600 uppercase tracking-widest mt-0.5">{{ formatFechaCorta(cita.fecha) }}</span>
        </div>

        <!-- Info Principal -->
        <div class="flex-1 min-w-0">
          <p class="text-xs font-black text-gray-900 uppercase tracking-tight truncate mb-1">
            {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}
          </p>
          <div class="flex items-center gap-2 mb-1">
             <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">
               {{ cita.tratamiento?.nombre || 'Consulta General' }}
             </span>
          </div>
          <div class="flex items-center gap-1.5">
             <div class="w-3 h-3 bg-violet-100 text-violet-600 rounded-md flex items-center justify-center">
               <i class="fas fa-user-md text-[6px]"></i>
             </div>
             <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest">
               {{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}
             </span>
          </div>
        </div>

        <!-- Estado / Acción -->
        <div 
          class="w-3 h-3 rounded-full flex-shrink-0 shadow-[0px_0px_10px_rgba(0,0,0,0.05)]"
          :class="getEstadoBg(cita.estado)"
          :title="getEstadoLabel(cita.estado)"
        ></div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex-1 flex flex-col items-center justify-center py-12 text-center">
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
        <i class="fas fa-calendar-check text-2xl"></i>
      </div>
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">No hay turnos pendientes hoy</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  citas: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['view-cita'])
const router = useRouter()

function formatHora(hora) {
  if (!hora) return '--:--'
  return hora.substring(0, 5)
}

function formatFechaCorta(fecha) {
  if (!fecha) return ''
  const d = new Date(fecha)
  const hoy = new Date()
  if (d.toDateString() === hoy.toDateString()) return 'Hoy'
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function getEstadoBg(estado) {
  const bgs = {
    'programada': 'bg-orange-400',
    'confirmada': 'bg-blue-500',
    'en_atencion': 'bg-emerald-500',
    'completada': 'bg-violet-600',
    'cancelada': 'bg-red-500',
    'no_asistio': 'bg-gray-400'
  }
  return bgs[estado] || 'bg-gray-400'
}

function getEstadoLabel(estado) {
  const labels = {
    'programada': 'Programada',
    'confirmada': 'Confirmada',
    'en_atencion': 'En Atención',
    'completada': 'Completada',
    'cancelada': 'Cancelada',
    'no_asistio': 'No Asistió'
  }
  return labels[estado] || estado
}

function handleViewCita(cita) {
  emit('view-cita', cita)
}
</script>

<style scoped>
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