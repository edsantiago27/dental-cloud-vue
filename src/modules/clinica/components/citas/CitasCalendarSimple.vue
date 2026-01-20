<!-- components/citas/CitasCalendarSimple.vue -->
<template>
  <div class="space-y-12">
    <!-- Loading Overlay -->
    <div v-if="citasStore.loading" class="p-20 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div class="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-6"></div>
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando Archivos...</p>
    </div>

    <!-- Empty State Bento -->
    <div v-else-if="citasStore.citas.length === 0" class="p-20 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
      <div class="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
        <i class="fas fa-calendar-times text-4xl"></i>
      </div>
      <h3 class="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Agenda Vacía</h3>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-xs mx-auto mb-8">No se encontraron registros para los parámetros seleccionados.</p>
    </div>

    <!-- Contenido Seccionado -->
    <div v-else class="space-y-16">
      
      <!-- Citas de HOY (The Focus) -->
      <section v-if="citasHoy.length > 0" class="space-y-6">
        <div class="flex items-center justify-between px-6">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-orange-100/50 text-orange-600 rounded-2xl flex items-center justify-center">
               <i class="fas fa-bolt text-lg"></i>
             </div>
             <div>
               <h3 class="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Prioridad Hoy</h3>
               <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Atenciones programadas para la jornada actual</p>
             </div>
          </div>
          <span class="px-4 py-2 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl">{{ citasHoy.length }} TURNOS</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="cita in citasHoy" 
            :key="cita.id"
            class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 cursor-pointer group relative overflow-hidden"
            @click="handleCitaClick(cita)"
          >
            <!-- Border Glow Fix -->
            <div class="absolute inset-0 border-2 border-transparent group-hover:border-violet-600/10 rounded-[2.5rem] transition-colors"></div>
            
            <div class="flex flex-col h-full relative z-10">
              <div class="flex items-start justify-between mb-8">
                <div class="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                  {{ formatHora(cita.hora) }}
                </div>
                <div 
                  class="px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border"
                  :style="{ backgroundColor: `${getEstadoColor(cita.estado)}15`, color: getEstadoColor(cita.estado), borderColor: `${getEstadoColor(cita.estado)}30` }"
                >
                  {{ getEstadoLabel(cita.estado) }}
                </div>
              </div>

              <div class="flex-1 space-y-4">
                 <div>
                   <p class="text-[9px] font-black text-violet-600 uppercase tracking-widest mb-1">{{ cita.tratamiento?.nombre || 'Consulta General' }}</p>
                   <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight group-hover:text-violet-600 transition-colors">{{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}</h4>
                 </div>
                 
                 <div class="flex flex-col gap-2 pt-4 border-t border-gray-50">
                    <div class="flex items-center gap-2">
                       <i class="fas fa-user-md text-[9px] text-gray-300"></i>
                       <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">DR. {{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                       <i class="fas fa-clock text-[9px] text-gray-300"></i>
                       <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ cita.duracion_minutos || 30 }} MINUTOS</span>
                    </div>
                 </div>
              </div>

              <button 
                @click.stop="emit('reagendar', cita)"
                class="mt-8 w-full py-4 bg-gray-50 group-hover:bg-violet-600 group-hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                <i class="fas fa-calendar-alt"></i>
                Reagendar Turno
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Próximas Citas (Horizontal Scroll / Compact Rows) -->
      <section v-if="proximasCitas.length > 0" class="space-y-6">
        <div class="flex items-center gap-4 px-6">
           <div class="w-12 h-12 bg-violet-100/50 text-violet-600 rounded-2xl flex items-center justify-center">
             <i class="fas fa-calendar-plus text-lg"></i>
           </div>
           <div>
             <h3 class="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Próximas Reservas</h3>
             <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Calendario de atenciones futuras</p>
           </div>
        </div>
        
        <div class="space-y-3 px-2">
          <div 
            v-for="cita in proximasCitas" 
            :key="cita.id"
            class="bg-white p-6 rounded-[2rem] border border-gray-50 hover:border-gray-100 hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group cursor-pointer"
            @click="handleCitaClick(cita)"
          >
            <div class="flex items-center gap-6 flex-1">
               <div class="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-violet-100 transition-colors">
                  <span class="text-[8px] font-black text-violet-600 uppercase tracking-widest">{{ formatFechaDia(cita.fecha) }}</span>
                  <span class="text-lg font-black text-gray-900 leading-none mt-1">{{ formatFechaNum(cita.fecha) }}</span>
               </div>
               <div class="min-w-0 flex-1">
                 <div class="flex items-center gap-3 mb-1">
                   <p class="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}</p>
                   <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
                   <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ formatHora(cita.hora) }}</span>
                 </div>
                 <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{{ cita.tratamiento?.nombre }} • DR. {{ cita.profesional?.nombre }}</p>
               </div>
            </div>

            <div class="flex items-center gap-4">
               <div 
                 class="px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border"
                 :style="{ backgroundColor: `${getEstadoColor(cita.estado)}15`, color: getEstadoColor(cita.estado), borderColor: `${getEstadoColor(cita.estado)}30` }"
               >
                 {{ getEstadoLabel(cita.estado) }}
               </div>
               <button 
                @click.stop="emit('reagendar', cita)"
                class="w-12 h-12 bg-gray-50 hover:bg-violet-600 hover:text-white rounded-xl text-gray-400 transition-all flex items-center justify-center"
               >
                 <i class="fas fa-calendar-alt text-xs"></i>
               </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Citas Anteriores (Historial Compacto) -->
      <section v-if="citasPasadas.length > 0" class="space-y-6">
        <h3 class="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] px-8">Historial Reciente</h3>
        
        <div class="bg-white rounded-[2.5rem] border border-gray-50 p-6 lg:p-10 divide-y divide-gray-50 shadow-sm">
          <div 
            v-for="cita in citasPasadas.slice(0, 10)" 
            :key="cita.id"
            class="py-5 flex items-center justify-between group cursor-pointer hover:bg-gray-50/50 transition-colors rounded-xl px-4"
            @click="handleCitaClick(cita)"
          >
            <div class="flex items-center gap-6">
               <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest w-20">{{ formatFechaCorta(cita.fecha) }}</span>
               <div class="flex flex-col">
                 <span class="text-[10px] font-black text-gray-900 uppercase tracking-tight group-hover:text-violet-600 transition-colors">{{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}</span>
                 <span class="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{{ cita.tratamiento?.nombre }}</span>
               </div>
            </div>
            <div class="flex items-center gap-6">
               <span class="text-[9px] font-black text-gray-300 uppercase tracking-widest">{{ formatHora(cita.hora) }}</span>
               <div 
                 class="w-2 h-2 rounded-full"
                 :style="{ backgroundColor: getEstadoColor(cita.estado) }"
                 :title="getEstadoLabel(cita.estado)"
               ></div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Leyenda Superior -->
    <div class="mt-20 p-8 bg-gray-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
      <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-50"></div>
      <div class="flex flex-wrap items-center gap-8 relative z-10">
        <span class="text-[9px] font-black text-gray-500 uppercase tracking-widest border-r border-white/5 pr-8">Codificación de Estados</span>
        <div v-for="estado in citasStore.estados" :key="estado.value" class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]" :style="{ backgroundColor: estado.color }"></div>
          <span class="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors">{{ estado.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCitasStore } from '@clinica/stores/citas'

const citasStore = useCitasStore()
const emit = defineEmits(['event-click', 'reagendar'])

const citasHoy = computed(() => {
  const hoyStr = new Date().toISOString().split('T')[0]
  return citasStore.citas.filter(cita => cita.fecha.split('T')[0] === hoyStr).sort((a, b) => a.hora.localeCompare(b.hora))
})

const proximasCitas = computed(() => {
  const hoyStr = new Date().toISOString().split('T')[0]
  return citasStore.citas.filter(cita => cita.fecha.split('T')[0] > hoyStr).sort((a, b) => {
    const dComp = a.fecha.localeCompare(b.fecha)
    return dComp !== 0 ? dComp : a.hora.localeCompare(b.hora)
  }).slice(0, 20)
})

const citasPasadas = computed(() => {
  const hoyStr = new Date().toISOString().split('T')[0]
  return citasStore.citas.filter(cita => cita.fecha.split('T')[0] < hoyStr).sort((a, b) => {
    const dComp = b.fecha.localeCompare(a.fecha)
    return dComp !== 0 ? dComp : b.hora.localeCompare(a.hora)
  })
})

function handleCitaClick(cita) { emit('event-click', cita) }
function getEstadoColor(estado) { return (citasStore.estados.find(e => e.value === estado) || {color: '#6B7280'}).color }
function getEstadoLabel(estado) { return (citasStore.estados.find(e => e.value === estado) || {label: estado}).label }

function formatFechaCorta(fecha) {
  const d = new Date(fecha.split('T')[0] + 'T00:00:00')
  return isNaN(d.getTime()) ? fecha : d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

function formatFechaDia(fecha) {
  const d = new Date(fecha.split('T')[0] + 'T00:00:00')
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-ES', { weekday: 'short' })
}

function formatFechaNum(fecha) {
  const d = new Date(fecha.split('T')[0] + 'T00:00:00')
  return isNaN(d.getTime()) ? '' : d.getDate()
}

function formatHora(hora) { return hora?.substring(0, 5) || '--:--' }

onMounted(async () => {
  const hoy = new Date()
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
  await citasStore.fetchCitas(inicio.toISOString().split('T')[0], fin.toISOString().split('T')[0])
})
</script>