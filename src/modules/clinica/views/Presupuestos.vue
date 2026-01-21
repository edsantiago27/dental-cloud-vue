<!-- views/admin/Presupuestos.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-violet-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-violet-500/20">Módulo Financiero</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gestión de Presupuestos</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Cotizaciones
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Emisión, seguimiento y conversión de planes de tratamiento</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openNewModal"
          class="flex items-center gap-3 px-8 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-xl group"
        >
          <i class="fas fa-plus text-violet-400"></i>
          Nuevo Presupuesto
        </button>
      </div>
    </div>

    <!-- Stats Row (Bento Style) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{{ stat.label }}</p>
          <div class="flex items-end gap-3">
             <h3 class="text-3xl font-black text-gray-900 tracking-tight leading-none">{{ stat.value }}</h3>
             <span class="text-[10px] font-bold text-violet-600 mb-1">{{ stat.suffix }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main List Card -->
    <div class="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden min-h-[500px]">
      
      <!-- Filters Bento -->
      <div class="flex flex-col lg:flex-row gap-6 mb-12">
        <div class="flex-1 relative">
           <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
           <input 
            type="text" 
            placeholder="Buscar por paciente o folio..." 
            class="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all"
           >
        </div>
        <div class="flex gap-4">
           <button class="px-8 py-5 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest text-gray-500 transition-all flex items-center gap-3">
             <i class="fas fa-filter"></i> Filtros
           </button>
        </div>
      </div>

      <!-- Table / List Content -->
      <div v-if="presupuestosStore.loading" class="py-20 text-center">
         <div class="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-6"></div>
         <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando Cotizaciones...</p>
      </div>

      <div v-else-if="presupuestosStore.presupuestos.length === 0" class="py-20 text-center">
         <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
           <i class="fas fa-file-invoice text-3xl"></i>
         </div>
         <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight">Sin presupuestos</h4>
         <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">No hay registros que coincidan con la búsqueda</p>
      </div>

      <div v-else class="space-y-4">
        <template v-for="item in presupuestosStore.presupuestos" :key="item?.id || Math.random()">
          <div 
            v-if="item"
            class="group bg-gray-50/30 hover:bg-white p-6 rounded-[2rem] border border-transparent hover:border-gray-100 hover:shadow-2xl hover:scale-[1.01] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer"
            @click="openViewModal(item)"
          >
          <div class="flex items-center gap-6 flex-1 min-w-0">
             <div class="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:border-violet-100 transition-colors">
                <span class="text-[8px] font-black text-gray-400 uppercase">Folio</span>
                <span class="text-sm font-black text-gray-900 tracking-tighter">#{{ item.id }}</span>
             </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-3 mb-1">
                   <h4 class="text-sm font-black text-gray-900 uppercase tracking-tight truncate">{{ item.paciente?.nombre || 'Paciente' }} {{ item.paciente?.apellido || 'N/A' }}</h4>
                   <span class="px-2 py-0.5 bg-violet-50 text-violet-600 text-[8px] font-black uppercase rounded-lg">{{ item.plan?.nombre || 'General' }}</span>
                </div>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{{ formatDate(item.fecha) }} • Emitido por {{ item.emitido_por || 'DentalCloud' }}</p>
              </div>
          </div>

          <div class="flex items-center gap-8">
             <div class="text-right">
                <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Neto</p>
                <p class="text-lg font-black text-gray-900 tracking-tighter">${{ formatAmount(item.total) }}</p>
             </div>
             <div 
               class="px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border"
               :style="{ backgroundColor: `${getEstadoColor(item.estado)}15`, color: getEstadoColor(item.estado), borderColor: `${getEstadoColor(item.estado)}30` }"
             >
               {{ item.estado }}
             </div>
             <div class="flex items-center gap-2">
                <button class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                   <i class="fas fa-eye text-[10px]"></i>
                </button>
                <button class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all">
                   <i class="fas fa-file-pdf text-[10px]"></i>
                </button>
             </div>
          </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Modales -->
    <PresupuestoFormModal 
      v-model="showNewModal" 
      @saved="handleSaved" 
    />

    <PresupuestoViewModal
      v-model="showViewModal"
      :presupuesto="selectedItem"
      @status-changed="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePresupuestosStore } from '@clinica/stores/presupuestos'
import { useNotification } from '@shared/composables/useNotification'
import PresupuestoFormModal from '@clinica/components/citas/PresupuestoFormModal.vue'
import PresupuestoViewModal from '@clinica/components/citas/PresupuestoViewModal.vue'

const presupuestosStore = usePresupuestosStore()
const notify = useNotification()

const showNewModal = ref(false)
const showViewModal = ref(false)
const selectedItem = ref(null)

const stats = computed(() => [
  { label: 'Emitidos Mes', value: presupuestosStore.total, suffix: 'UNIDADES' },
  { label: 'Conversión', value: '34', suffix: '% RATIO' },
  { label: 'Volumen Pendiente', value: `$${formatAmount(4500000)}`, suffix: 'POTENCIAL' }
])

function openNewModal() { showNewModal.value = true }
function openViewModal(item) { 
  selectedItem.value = item
  showViewModal.value = true
}

function handleSaved() {
  presupuestosStore.fetchPresupuestos()
}

function getEstadoColor(estado) {
  return (presupuestosStore.estados.find(e => e.value === estado) || { color: '#6B7280' }).color
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatAmount(amount) {
  return new Intl.NumberFormat('es-CL').format(amount)
}

onMounted(() => {
  presupuestosStore.fetchPresupuestos()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scale-up { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-scale-up { animation: scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
