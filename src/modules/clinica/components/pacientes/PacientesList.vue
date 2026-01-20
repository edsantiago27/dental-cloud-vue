<!-- components/pacientes/PacientesList.vue -->
<template>
  <div class="space-y-6">
    <!-- Stats Row (Quick Snapshot) -->
    <div v-if="!pacientesStore.loading && pacientesStore.pacientes.length > 0" class="flex items-center gap-4 px-4 overflow-x-auto custom-scrollbar pb-2">
      <div class="px-5 py-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm min-w-fit">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-[9px] font-black text-gray-900 uppercase tracking-widest">{{ pacientesStore.paginationInfo.total }} REGISTROS TOTALES</span>
      </div>
      <div class="px-5 py-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm min-w-fit">
        <i class="fas fa-user-plus text-violet-600 text-[10px]"></i>
        <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">NUEVOS: 3</span>
      </div>
    </div>

    <!-- Main Container -->
    <div class="bg-transparent">
      
      <!-- Loading Skeleton/Spinner -->
      <div v-if="pacientesStore.loading" class="p-20 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div class="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-6"></div>
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Accediendo a la base de datos...</p>
      </div>

      <!-- Empty State Bento -->
      <div v-else-if="pacientesStore.pacientes.length === 0" class="p-20 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div class="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
          <i class="fas fa-users-slash text-4xl"></i>
        </div>
        <h3 class="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Sin Resultados Informativos</h3>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-10 max-w-xs mx-auto">
          {{ pacientesStore.filters.search ? 'Ajusta tus criterios de búsqueda para encontrar al paciente.' : 'Comienza a digitalizar tu clínica agregando tu primer paciente.' }}
        </p>
        <button
          v-if="!pacientesStore.filters.search"
          @click="$emit('new')"
          class="px-10 py-5 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-500/20 hover:scale-105 transition-all"
        >
          <i class="fas fa-plus mr-3"></i> Crear Ficha Inicial
        </button>
      </div>

      <!-- Card List (Bento Table Alternative) -->
      <div v-else class="space-y-4">
        <!-- List Header (Solo Desktop) -->
        <div class="hidden lg:grid grid-cols-12 gap-6 px-10 py-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
          <div class="col-span-4">IDENTIDAD DEL PACIENTE</div>
          <div class="col-span-2">DOCUMENTO / RUT</div>
          <div class="col-span-2">CANAL DE CONTACTO</div>
          <div class="col-span-2 text-center">ESTADO OPERATIVO</div>
          <div class="col-span-2 text-right">ACCIONES</div>
        </div>

        <!-- Rows -->
        <div
          v-for="paciente in pacientesStore.pacientes"
          :key="paciente.id"
          class="bg-white rounded-[2rem] border border-gray-50 p-6 lg:p-8 hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden"
        >
          <!-- Hover Accent -->
          <div class="absolute inset-y-0 left-0 w-1 bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <!-- Info Identidad -->
            <div class="col-span-4 flex items-center gap-6">
              <div class="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-800 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-violet-500/20 group-hover:rotate-6 transition-transform">
                {{ getInitials(paciente.nombre, paciente.apellido) }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-black text-gray-900 uppercase tracking-tight truncate group-hover:text-violet-600 transition-colors">
                  {{ paciente.nombre }} {{ paciente.apellido }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                   <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                     Edad: {{ calculateAge(paciente.fecha_nacimiento) }} AÑOS
                   </span>
                   <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
                   <span class="text-[9px] font-black text-violet-500 uppercase tracking-widest">Ver Digital ID</span>
                </div>
              </div>
            </div>

            <!-- RUT -->
            <div class="col-span-2">
              <span class="text-[10px] font-black text-gray-900 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">{{ paciente.rut }}</span>
            </div>

            <!-- Contacto -->
            <div class="col-span-2 space-y-1">
              <div class="flex items-center gap-2 text-[10px] font-black text-gray-600 tracking-tight truncate">
                <i class="fas fa-envelope text-[8px] text-gray-400"></i>
                <span class="truncate">{{ paciente.email || '--' }}</span>
              </div>
              <div class="flex items-center gap-2 text-[10px] font-black text-gray-600 tracking-tight">
                <i class="fas fa-phone text-[8px] text-gray-400"></i>
                <span>{{ paciente.telefono || '--' }}</span>
              </div>
            </div>

            <!-- Estado -->
            <div class="col-span-2 flex justify-center">
              <div 
                class="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all"
                :class="paciente.estado === 'activo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'"
              >
                {{ paciente.estado === 'activo' ? 'Activo' : 'Inactivo' }}
              </div>
            </div>

            <!-- Acciones Bento -->
            <div class="col-span-2 flex items-center justify-end gap-3">
              <button
                @click="$emit('agendar-cita', paciente)"
                class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm group/btn"
                title="Agendar Turno"
              >
                <i class="fas fa-calendar-plus text-[10px]"></i>
              </button>
              <button
                @click="$emit('perfil', paciente)"
                class="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all shadow-sm"
                title="Ficha Maestria"
              >
                <i class="fas fa-folder-open text-[10px]"></i>
              </button>
              <HistoriaClinicaButton 
                :paciente-id="paciente.id"
                variant="icon"
                class="!w-10 !h-10 !rounded-xl !bg-blue-50 !text-blue-600 hover:!bg-blue-600 hover:!text-white !transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Pagination -->
      <div
        v-if="pacientesStore.pacientes.length > 0"
        class="mt-10 p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Viendo <span class="text-gray-900">{{ pacientesStore.paginationInfo.from }} - {{ pacientesStore.paginationInfo.to }}</span> de <span class="text-gray-900">{{ pacientesStore.paginationInfo.total }}</span> Pacientes Digitales
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="handlePrevPage"
            :disabled="!pacientesStore.hasPrevPage"
            class="w-12 h-12 flex items-center justify-center border border-gray-100 rounded-2xl text-gray-400 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left text-xs"></i>
          </button>

          <div class="flex items-center gap-2">
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="handlePageChange(page)"
                :class="[
                  'w-12 h-12 flex items-center justify-center rounded-2xl text-[10px] font-black transition-all',
                  page === pacientesStore.currentPage
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                    : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <span v-else class="text-gray-400 font-black">...</span>
            </template>
          </div>

          <button
            @click="handleNextPage"
            :disabled="!pacientesStore.hasNextPage"
            class="w-12 h-12 flex items-center justify-center border border-gray-100 rounded-2xl text-gray-400 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePacientesStore } from '@clinica/stores'
import HistoriaClinicaButton from '@clinica/components/pacientes/HistoriaClinicaButton.vue'

const pacientesStore = usePacientesStore()

defineEmits(['new', 'agendar-cita', 'perfil', 'historial'])

const visiblePages = computed(() => {
  const total = pacientesStore.totalPages
  const current = pacientesStore.currentPage
  const pages = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) pages.push(1, 2, 3, 4, '...', total)
    else if (current >= total - 2) pages.push(1, '...', total - 3, total - 2, total - 1, total)
    else pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }
  return pages
})

function getInitials(nombre, apellido) {
  return ((nombre?.[0] || '') + (apellido?.[0] || '')).toUpperCase() || '?'
}

function calculateAge(fechaNacimiento) {
  if (!fechaNacimiento) return '--'
  const birth = new Date(fechaNacimiento)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function handlePrevPage() { if (pacientesStore.hasPrevPage) pacientesStore.changePage(pacientesStore.currentPage - 1) }
function handleNextPage() { if (pacientesStore.hasNextPage) pacientesStore.changePage(pacientesStore.currentPage + 1) }
function handlePageChange(page) { if (page !== '...') pacientesStore.changePage(page) }
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
</style>