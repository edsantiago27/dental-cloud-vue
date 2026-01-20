<!-- src/modules/demo/views/Agenda.vue -->
<template>
  <div class="space-y-8 animate-fade-in pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Agenda Maestra</h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Sincronización de pacientes y especialistas en tiempo real</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="openNewModal"
          class="px-8 py-4 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 hover:scale-105 active:scale-95 transition-all"
        >
          <i class="fas fa-calendar-plus mr-2"></i> Agendar Cita
        </button>
      </div>
    </div>

    <!-- Filtros y Vista -->
    <div class="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6 items-center">
      <div class="flex-1 w-full flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Filtrar Especialista</label>
          <select 
            v-model="agendaStore.filters.profesional_id"
            class="w-full px-6 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer"
          >
            <option :value="null">Todos los profesionales</option>
            <option v-for="prof in profesionales" :key="prof.id" :value="prof.id">{{ prof.nombre }}</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Estado de Cita</label>
          <select 
            v-model="agendaStore.filters.estado"
            class="w-full px-6 py-3 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer"
          >
            <option :value="null">Todos los estados</option>
            <option v-for="est in agendaStore.estados" :key="est.value" :value="est.value">{{ est.label }}</option>
          </select>
        </div>
      </div>
      <div class="w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6 flex gap-2">
        <div class="px-4 py-2 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Día</div>
        <div class="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 cursor-not-allowed">Semana</div>
        <div class="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 cursor-not-allowed">Mes</div>
      </div>
    </div>

    <!-- Agenda Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
      
      <!-- Mini Calendar -->
      <div class="xl:col-span-1 space-y-6">
        <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h3 class="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6 text-center">Enero 2026</h3>
          <div class="grid grid-cols-7 gap-1 text-center text-[9px] font-black text-gray-400 uppercase mb-4">
             <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
          </div>
          <div class="grid grid-cols-7 gap-2">
            <div v-for="n in 31" :key="n" 
              class="aspect-square flex items-center justify-center text-[10px] font-bold rounded-xl transition-all"
              :class="n === todayDay ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'text-gray-900 hover:bg-gray-50 cursor-pointer'"
            >
              {{ n }}
            </div>
          </div>
        </div>

        <div class="bg-gray-900 rounded-[2.5rem] p-8 text-white">
          <p class="text-[9px] font-black uppercase tracking-widest opacity-50 mb-4">Resumen de Hoy</p>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Confirmadas</span>
              <span class="text-sm font-black">{{ stats.confirmadas }}</span>
            </div>
            <div class="flex items-center justify-between text-orange-400">
              <span class="text-[10px] font-bold uppercase">Pendientes</span>
              <span class="text-sm font-black">{{ stats.pendiente }}</span>
            </div>
            <div class="pt-4 border-t border-white/10 flex items-center justify-between text-emerald-400">
              <span class="text-[10px] font-bold uppercase tracking-widest">Tasa Asistencia</span>
              <span class="text-sm font-black">94%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Time Slot List -->
      <div class="xl:col-span-3 space-y-4">
        <div v-if="agendaStore.filteredAppointments.length === 0" class="p-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
            <i class="fas fa-calendar-times text-4xl mb-4"></i>
            <span class="text-[10px] font-black uppercase tracking-[0.3em]">No hay citas con estos filtros</span>
        </div>

        <div 
          v-for="app in agendaStore.filteredAppointments" 
          :key="app.id" 
          class="group bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all flex items-center gap-8 relative overflow-hidden"
        >
          <!-- Status Line indicador -->
          <div class="absolute left-0 top-0 bottom-0 w-1.5" :style="{ backgroundColor: getStatusColor(app.estado) }"></div>
          
          <div class="w-20 flex flex-col items-center justify-center">
            <span class="text-lg font-black text-gray-900">{{ app.hora }}</span>
            <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest">{{ app.duracion || 30 }} MIN</span>
          </div>

          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <h3 class="text-sm font-black text-gray-900 uppercase tracking-tight">{{ getPacienteName(app.paciente_id) }}</h3>
              <span 
                class="px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-full border"
                :style="{ color: getStatusColor(app.estado), borderColor: getStatusColor(app.estado) + '30', backgroundColor: getStatusColor(app.estado) + '10' }"
              >
                {{ app.estado }}
              </span>
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <i class="fas fa-user-md text-[9px]"></i>
                </div>
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{{ app.profesional }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <i class="fas fa-stethoscope text-[9px]"></i>
                </div>
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{{ app.motivo }}</span>
              </div>
            </div>
          </div>

          <!-- Acciones Contextuales -->
          <div class="flex items-center gap-2">
             <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  v-if="app.estado === 'programada' || app.estado === 'pendiente'"
                  @click="updateStatus(app.id, 'confirmada')"
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  title="Confirmar asistencia"
                >
                  <i class="fas fa-check text-[10px]"></i>
                </button>
                <button 
                  v-if="app.estado === 'confirmada'"
                  @click="updateStatus(app.id, 'atendida')"
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  title="Iniciar atención"
                >
                  <i class="fas fa-play text-[9px]"></i>
                </button>
                <button 
                  @click="deleteApp(app.id)"
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <i class="fas fa-trash-alt text-[10px]"></i>
                </button>
             </div>
             <button class="p-4 text-gray-300 hover:text-violet-600">
               <i class="fas fa-ellipsis-v"></i>
             </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal Formulario Mejorado -->
    <div v-show="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm" @click="showModal = false"></div>
      <div class="bg-white rounded-[3rem] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden animate-scale-up border border-white/10">
        <div class="p-10 bg-gray-900 text-white relative">
          <div class="absolute top-0 right-0 p-8 opacity-10">
             <i class="fas fa-calendar-plus text-7xl"></i>
          </div>
          <h3 class="text-2xl font-black uppercase tracking-tight">Programar Cita</h3>
          <p class="text-[10px] font-bold text-violet-400 uppercase tracking-[0.3em] mt-2">Gestión de disponibilidad inteligente</p>
        </div>
        
        <form @submit.prevent="handleSave" class="p-10 space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Paciente en Ficha</label>
              <select v-model="form.paciente_id" required class="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all outline-none appearance-none">
                <option v-for="p in pacientesStore.pacientes" :key="p.id" :value="p.id">{{ p.nombre }}</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Especialista</label>
              <select v-model="form.profesional_id" @change="updateProfName" required class="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all outline-none appearance-none">
                <option v-for="prof in profesionales" :key="prof.id" :value="prof.id">{{ prof.nombre }}</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Hora de Inicio</label>
              <input v-model="form.hora" type="time" required class="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[11px] font-black outline-none">
            </div>

            <div class="md:col-span-2">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Motivo de Consulta (Tratamiento)</label>
              <input v-model="form.motivo" placeholder="Ej: LIMPIEZA, EVALUACIÓN, ETC." type="text" required class="w-full px-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-violet-600/20 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none">
            </div>
          </div>

          <div class="flex gap-4 pt-6">
            <button type="button" @click="showModal = false" class="flex-1 py-5 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">Cancelar</button>
            <button type="submit" class="flex-1 py-5 bg-violet-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-200 hover:scale-[1.03] active:scale-95 transition-all">Agendar Cita en Demo</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDemoPacientesStore } from '../stores/demoPacientes'
import { useDemoAgendaStore } from '../stores/demoAgenda'
import { demoStorageService } from '../services/demoStorageService'

const pacientesStore = useDemoPacientesStore()
const agendaStore = useDemoAgendaStore()

const showModal = ref(false)
const todayDay = new Date().getDate()
const profesionales = demoStorageService.getProfesionales()

const form = ref({ 
  paciente_id: '', 
  hora: '09:00', 
  motivo: '', 
  profesional_id: profesionales[0].id,
  profesional: profesionales[0].nombre,
  duracion: 30
})

const stats = computed(() => {
  return {
    confirmadas: agendaStore.appointments.filter(a => a.estado === 'confirmada').length,
    pendiente: agendaStore.appointments.filter(a => a.estado === 'pendiente' || a.estado === 'programada').length
  }
})

function getPacienteName(id) {
  const p = pacientesStore.pacientes.find(p => p.id === id)
  return p ? p.nombre : 'Paciente Demo'
}

function getStatusColor(status) {
  const est = agendaStore.estados.find(e => e.value === status)
  return est ? est.color : '#94a3b8'
}

function openNewModal() {
  form.value = { 
    paciente_id: pacientesStore.pacientes[0]?.id || '', 
    hora: '10:00', 
    motivo: '', 
    profesional_id: profesionales[0].id,
    profesional: profesionales[0].nombre,
    duracion: 30
  }
  showModal.value = true
}

function updateProfName() {
  const prof = profesionales.find(p => p.id === form.value.profesional_id)
  if (prof) form.value.profesional = prof.nombre
}

function handleSave() {
  agendaStore.createAppointment({ ...form.value })
  showModal.value = false
}

function updateStatus(id, status) {
  agendaStore.updateStatus(id, status)
}

function deleteApp(id) {
  if (confirm('¿Eliminar cita de la demo?')) {
    agendaStore.deleteAppointment(id)
  }
}

onMounted(() => {
  pacientesStore.fetchPacientes()
  agendaStore.fetchAppointments()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
.animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
