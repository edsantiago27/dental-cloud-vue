<!-- views/admin/Laboratorio.vue -->
<template>
  <div class="space-y-8 animate-fade-in p-2">
    <!-- Header Premium -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <span class="px-3 py-1 bg-violet-600 text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-violet-500/20">Módulo Operativo</span>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gestión de Laboratorio Dental</span>
        </div>
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
          {{ activeTab === 'ordenes' ? 'Órdenes de Trabajo' : 'Catálogo de Labs' }}
        </h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">
          {{ activeTab === 'ordenes' ? 'Seguimiento de prótesis y rehabilitaciones externas' : 'Gestión de proveedores y laboratorios dentales' }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Tab Switcher (Submenu) -->
        <div class="bg-gray-100 p-1 rounded-2xl flex mr-2">
            <button 
                @click="activeTab = 'ordenes'"
                class="px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                :class="activeTab === 'ordenes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
            >
                <i class="fas fa-list-ul mr-2"></i> Órdenes
            </button>
            <button 
                @click="activeTab = 'proveedores'"
                class="px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                :class="activeTab === 'proveedores' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
            >
                <i class="fas fa-building mr-2"></i> Proveedores
            </button>
        </div>

        <button
          v-if="activeTab === 'ordenes'"
          @click="showFormModal = true"
          class="flex items-center gap-3 px-8 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-xl group"
        >
          <i class="fas fa-plus text-violet-400"></i>
          Nueva Orden
        </button>

        <button
          v-else
          @click="openNewProveedor"
          class="flex items-center gap-3 px-8 py-4 bg-violet-600 border border-violet-500 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all shadow-xl group"
        >
          <i class="fas fa-plus text-white"></i>
          Nuevo Lab
        </button>
      </div>
    </div>

    <!-- Specialized Bento Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
       <!-- Main KPI: Active Workload -->
       <div class="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-10 -top-10 w-48 h-48 bg-violet-50 rounded-full blur-3xl group-hover:bg-violet-100 transition-colors duration-700"></div>
          <div class="relative z-10">
             <div class="flex items-center gap-4 mb-8">
                <div class="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                   <i class="fas fa-microscope text-xl"></i>
                </div>
                <div>
                   <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Carga de Trabajo Activa</p>
                   <h3 class="text-3xl font-black text-gray-900 tracking-tighter">{{ labStore.ordenesPendientes.length }} Órdenes en Curso</h3>
                </div>
             </div>
             <div class="flex gap-1">
                <div v-for="i in 12" :key="i" class="h-1 rounded-full flex-1" :class="i <= labStore.ordenesPendientes.length ? 'bg-violet-600' : 'bg-gray-100'"></div>
             </div>
          </div>
       </div>

       <!-- Secondary KPIs -->
       <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Próximas Entregas</p>
          <div class="flex items-end gap-3">
             <h3 class="text-3xl font-black text-gray-900 tracking-tight leading-none">{{ labStore.ordenesUrgentes.length }}</h3>
             <span class="text-[9px] font-black text-amber-500 mb-1">PROX. 48H</span>
          </div>
       </div>

       <div class="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-4">Lab. Asociados</p>
          <div class="flex items-end gap-3">
             <h3 class="text-3xl font-black text-gray-900 tracking-tight leading-none">{{ labStore.laboratorios.length }}</h3>
             <span class="text-[9px] font-black text-violet-600 mb-1">VIGENTES</span>
          </div>
       </div>
    </div>

    <!-- Main Content Area -->
    <div class="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden min-h-[500px]">
       
       <div v-if="activeTab === 'ordenes'">
           <!-- Filter Bar -->
           <div class="flex flex-col lg:flex-row gap-6 mb-12">
             <div class="flex-1 relative">
                <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"></i>
                <input 
                  v-model="busqueda"
                  @input="handleSearch"
                  type="text" 
                  placeholder="Buscar por paciente, laboratorio o número de orden..." 
                  class="w-full pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-violet-600/20 focus:ring-4 focus:ring-violet-600/5 transition-all"
                >
             </div>
             <div class="flex gap-4">
                <select 
                  v-model="filtroEstado"
                  @change="handleFilter"
                  class="px-8 py-5 bg-gray-50 border border-transparent rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest text-gray-500 outline-none focus:bg-white focus:border-violet-600/20 transition-all font-outfit"
                >
                   <option value="">Todos los Estados</option>
                   <option v-for="e in labStore.estados" :key="e.value" :value="e.value">{{ e.label }}</option>
                </select>
             </div>
           </div>

           <!-- Table/Grid Content -->
           <div v-if="labStore.loading" class="py-20 text-center">
              <div class="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-6"></div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando con Laboratorios...</p>
           </div>

           <div v-else-if="labStore.ordenes.length === 0" class="py-20 text-center">
              <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                <i class="fas fa-microscope text-3xl"></i>
              </div>
              <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight">Sin órdenes de trabajo</h4>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">No hay registros vigentes actualmente</p>
           </div>

           <div v-else class="space-y-4">
              <div 
                v-for="orden in labStore.ordenes" 
                :key="orden.id"
                class="group bg-gray-50/30 hover:bg-white p-6 rounded-[2.2rem] border border-transparent hover:border-gray-100 hover:shadow-2xl hover:scale-[1.01] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer"
                @click="openDetail(orden)"
              >
                 <div class="flex items-center gap-6 flex-1 min-w-0">
                    <div class="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:border-violet-100 transition-colors">
                       <span class="text-[7px] font-black text-gray-400 uppercase">Orden</span>
                       <span class="text-xs font-black text-gray-900 tracking-tighter">{{ orden.numero_orden }}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                       <div class="flex items-center gap-3 mb-1">
                          <h4 class="text-sm font-black text-gray-900 uppercase tracking-tight truncate">{{ orden.paciente?.nombre }} {{ orden.paciente?.apellido }}</h4>
                          <span class="px-2 py-0.5 bg-violet-50 text-violet-600 text-[8px] font-black uppercase rounded-lg">{{ orden.trabajo_tipo }}</span>
                       </div>
                       <div class="flex items-center gap-4">
                          <p class="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <i class="fas fa-building text-[10px]"></i> {{ orden.laboratorio?.nombre }}
                          </p>
                          <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <p class="text-[8px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-2">
                            <i class="fas fa-user-md text-[10px]"></i> Dr. {{ orden.profesional?.nombre }}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div class="flex items-center gap-8">
                    <div class="text-right">
                       <p class="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Entrega Prevista</p>
                       <p class="text-[10px] font-black text-gray-900" :class="{ 'text-red-500': isUrgent(orden.fecha_entrega_prevista) }">
                          {{ formatDate(orden.fecha_entrega_prevista) }}
                       </p>
                    </div>
                    <div 
                      class="px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border flex items-center gap-2"
                      :style="{ backgroundColor: `${getEstadoColor(orden.estado)}15`, color: getEstadoColor(orden.estado), borderColor: `${getEstadoColor(orden.estado)}30` }"
                    >
                      <i :class="getEstadoIcon(orden.estado)"></i>
                      {{ orden.estado }}
                    </div>
                    <div class="flex items-center gap-2">
                       <button class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:scale-110 transition-transform">
                          <i class="fas fa-edit text-[10px]"></i>
                       </button>
                       <button @click.stop="updateStatus(orden)" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all">
                          <i class="fas fa-exchange-alt text-[10px]"></i>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
       </div>

       <div v-else>
           <LaboratorioProveedorList @edit="openEditProveedor" />
       </div>
    </div>

    <!-- Modals -->
    <LaboratorioFormModal 
      v-if="showFormModal" 
      @close="showFormModal = false"
      @success="labStore.fetchOrdenes()"
    />

    <LaboratorioStatusModal
      v-if="showStatusModal"
      :orden="selectedOrden"
      @close="showStatusModal = false"
      @success="labStore.fetchOrdenes()"
    />

    <LaboratorioProveedorFormModal
        v-if="showProveedorModal"
        :laboratorio="selectedLab"
        @close="showProveedorModal = false"
        @success="labStore.fetchLaboratorios()"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLaboratorioStore } from '@clinica/stores/laboratorio'
import { useNotification } from '@shared/composables/useNotification'

// Components
import LaboratorioFormModal from '@clinica/components/citas/LaboratorioFormModal.vue'
import LaboratorioStatusModal from '@clinica/components/citas/LaboratorioStatusModal.vue'
import LaboratorioProveedorList from '@clinica/components/citas/LaboratorioProveedorList.vue'
import LaboratorioProveedorFormModal from '@clinica/components/citas/LaboratorioProveedorFormModal.vue'

const labStore = useLaboratorioStore()
const notify = useNotification()

const activeTab = ref('ordenes')
const showFormModal = ref(false)
const showStatusModal = ref(false)
const showProveedorModal = ref(false)

const selectedOrden = ref(null)
const selectedLab = ref(null)

const busqueda = ref('')
const filtroEstado = ref('')

function handleSearch() {
  labStore.setFiltros({ buscar: busqueda.value })
}

function handleFilter() {
  labStore.setFiltros({ estado: filtroEstado.value })
}

function getEstadoColor(estado) {
  return (labStore.estados.find(e => e.value === estado) || { color: '#6B7280' }).color
}

function getEstadoIcon(estado) {
  return (labStore.estados.find(e => e.value === estado) || { icon: 'fas fa-info-circle' }).icon
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isUrgent(date) {
    if (!date) return false
    const d = new Date(date)
    const hoy = new Date()
    const diff = d - hoy
    return diff > 0 && diff < (1000 * 60 * 60 * 24 * 3)
}

function openDetail(orden) {
    selectedOrden.value = orden
    showStatusModal.value = true
}

async function updateStatus(orden) {
    selectedOrden.value = orden
    showStatusModal.value = true
}

function openNewProveedor() {
    selectedLab.value = null
    showProveedorModal.value = true
}

function openEditProveedor(lab) {
    selectedLab.value = lab
    showProveedorModal.value = true
}

onMounted(() => {
  labStore.fetchOrdenes()
  labStore.fetchLaboratorios()
})
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
</style>
