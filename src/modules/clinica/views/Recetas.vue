<!-- views/admin/Recetas.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-emerald-500/20">Fichero Médico</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gestión de Recetas Médicas</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          Prescripciones
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Control histórico de fármacos y tratamientos recetados</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="openNewModal"
          class="flex items-center gap-3 px-8 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-xl group"
        >
          <i class="fas fa-plus text-emerald-400"></i>
          Nueva Receta
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
       <div class="md:col-span-2 bg-emerald-700 p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div class="relative z-10 flex items-center gap-8">
             <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
                <i class="fas fa-file-medical"></i>
             </div>
             <div>
                <p class="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Total de Prescripciones</p>
                <p class="text-4xl font-black tracking-tighter">{{ recetasStore.total }} DOCUMENTOS</p>
             </div>
          </div>
       </div>
       <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Recetas Activas</p>
          <div class="flex items-end gap-3">
             <h3 class="text-3xl font-black text-gray-900 tracking-tighter leading-none">{{ recetasStore.recetasActivas.length }}</h3>
             <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-1.5 animate-pulse"></span>
          </div>
       </div>
       <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Anulaciones</p>
          <div class="flex items-end gap-3">
             <h3 class="text-3xl font-black text-gray-900 tracking-tighter leading-none">{{ recetasStore.recetasAnuladas.length }}</h3>
             <span class="text-[9px] font-black text-red-500 mb-1">HISTÓRICO</span>
          </div>
       </div>
    </div>

    <!-- Main List Container -->
    <div class="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden min-h-[500px]">
      
      <!-- List Filter & Search -->
      <div class="flex flex-col lg:flex-row gap-6 mb-12">
        <div class="flex-1 relative">
           <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
           <input 
            v-model="busqueda"
            @input="handleSearch"
            type="text" 
            placeholder="Buscar por paciente, diagnóstico o medicamento..." 
            class="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-emerald-600/20 focus:ring-4 focus:ring-emerald-600/5 transition-all"
           >
        </div>
        <div class="flex gap-4">
           <select 
            v-model="filtroEstado"
            @change="handleFilter"
            class="px-8 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest text-gray-500 outline-none focus:bg-white focus:border-emerald-600/20 transition-all font-outfit"
           >
              <option value="">Todos los Estados</option>
              <option v-for="e in recetasStore.estados" :key="e.value" :value="e.value">{{ e.label }}</option>
           </select>
        </div>
      </div>

      <!-- Content -->
      <div v-if="recetasStore.loading" class="py-20 text-center">
         <div class="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
         <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consultando Base de Datos Médica...</p>
      </div>

      <div v-else-if="recetasStore.recetas.length === 0" class="py-20 text-center">
         <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
           <i class="fas fa-file-prescription text-3xl"></i>
         </div>
         <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight">Sin prescripciones</h4>
         <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">No se encontraron documentos registrados</p>
      </div>

      <div v-else class="space-y-4">
         <div 
           v-for="receta in recetasStore.recetas" 
           :key="receta.id"
           class="group bg-gray-50/30 hover:bg-white p-6 rounded-[2.2rem] border border-transparent hover:border-gray-100 hover:shadow-2xl hover:scale-[1.01] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer"
           @click="openViewModal(receta)"
         >
            <div class="flex items-center gap-6 flex-1 min-w-0">
               <div class="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:border-emerald-100 transition-colors">
                  <span class="text-[7px] font-black text-gray-400 uppercase">Num.</span>
                  <span class="text-xs font-black text-gray-900">#{{ receta.numero || receta.id }}</span>
               </div>
               <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-3 mb-1">
                     <h4 class="text-sm font-black text-emerald-900 uppercase tracking-tight truncate">{{ receta.paciente?.nombre }} {{ receta.paciente?.apellido }}</h4>
                  </div>
                  <div class="flex items-center gap-4">
                     <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest">{{ formatDate(receta.fecha_emision) }}</p>
                     <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
                     <p class="text-[8px] font-black text-violet-600 uppercase tracking-widest">DR. {{ receta.profesional?.nombre }}</p>
                  </div>
               </div>
            </div>

            <div class="flex items-center gap-8">
               <div class="hidden md:block text-right">
                  <p class="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Diagnóstico</p>
                  <p class="text-[9px] font-bold text-gray-500 uppercase tracking-tight truncate max-w-[150px]">{{ receta.diagnostico }}</p>
               </div>
               <div 
                 class="px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border"
                 :style="{ backgroundColor: `${getEstadoColor(receta.estado)}15`, color: getEstadoColor(receta.estado), borderColor: `${getEstadoColor(receta.estado)}30` }"
               >
                 {{ receta.estado }}
               </div>
               <div class="flex items-center gap-2">
                  <button class="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-gray-200">
                     <i class="fas fa-eye text-[10px]"></i>
                  </button>
                  <button @click.stop="downloadPDF(receta)" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">
                     <i class="fas fa-file-download text-[10px]"></i>
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>

    <!-- Modals -->
    <RecetaFormModal 
      v-model="showFormModal"
      @saved="handleSaved"
    />

    <RecetaViewModal
      v-model="showViewModal"
      :receta="selectedReceta"
      @status-changed="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRecetasStore } from '@clinica/stores/recetas'
import { useNotification } from '@shared/composables/useNotification'
import RecetaFormModal from '@clinica/components/citas/RecetaFormModal.vue'
import RecetaViewModal from '@clinica/components/citas/RecetaViewModal.vue'

const recetasStore = useRecetasStore()
const notify = useNotification()

const showFormModal = ref(false)
const showViewModal = ref(false)
const selectedReceta = ref(null)

const busqueda = ref('')
const filtroEstado = ref('')

function openNewModal() { showFormModal.value = true }

function openViewModal(receta) {
  selectedReceta.value = receta
  showViewModal.value = true
}

function handleSaved() {
  recetasStore.fetchRecetas()
}

function handleSearch() {
  recetasStore.setFiltros({ buscar: busqueda.value })
}

function handleFilter() {
  recetasStore.setFiltros({ estado: filtroEstado.value })
}

function getEstadoColor(estado) {
  return (recetasStore.estados.find(e => e.value === estado) || { color: '#6B7280' }).color
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function downloadPDF(receta) {
  const url = recetasStore.getPdfUrl(receta.id)
  window.open(url, '_blank')
}

onMounted(() => {
  recetasStore.fetchRecetas()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
