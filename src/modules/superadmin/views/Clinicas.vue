<template>
  <div class="space-y-8 animate-fade-in-up">

    <!-- Header con Stats (Bento Grid) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400">
            <i class="fas fa-hospital text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Clínicas Registradas</p>
        <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stats.total }}</p>
      </div>

      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
            <i class="fas fa-check-circle text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-green-600 uppercase tracking-widest">Activo</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Cuentas Activas</p>
        <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stats.activas }}</p>
      </div>

      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <i class="fas fa-clock text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-orange-600 uppercase tracking-widest">Trial</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">En Período de Prueba</p>
        <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stats.trial }}</p>
      </div>

      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
            <i class="fas fa-ban text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-red-600 uppercase tracking-widest">Alerta</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Suscripciones Suspendidas</p>
        <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stats.suspendidas }}</p>
      </div>
    </div>

    <!-- Filtros y Acciones -->
    <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
      <div class="flex flex-col lg:flex-row gap-6 items-center">
        
        <!-- Búsqueda -->
        <div class="flex-1 w-full relative group">
          <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-gray-400">
            <i class="fas fa-search transition-colors group-focus-within:text-violet-600 dark:group-focus-within:text-orange-500"></i>
          </div>
          <input
            v-model="filtros.buscar"
            @input="handleSearch"
            type="text"
            placeholder="Buscar por nombre, email o RUT..."
            class="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
          >
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <!-- Filtro Estado -->
          <select
            v-model="filtros.estado"
            @change="aplicarFiltros"
            class="px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 outline-none cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-all appearance-none pr-10 relative"
          >
            <option value="">Todos los estados</option>
            <option value="activa">Activas</option>
            <option value="suspendida">Suspendidas</option>
            <option value="inactiva">Inactivas</option>
          </select>

          <button
            @click="modalNuevaClinica = true"
            class="flex-1 lg:flex-none px-8 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <i class="fas fa-plus mr-2"></i> Nueva Clínica
          </button>

          <button
            @click="exportar"
            class="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all"
            title="Exportar"
          >
            <i class="fas fa-file-export"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla / Listado de Clínicas -->
    <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none overflow-hidden">
      
      <!-- Loading State -->
      <div v-if="loading" class="p-20 text-center animate-pulse">
        <i class="fas fa-spinner fa-spin text-3xl text-violet-600 dark:text-orange-500 mb-4"></i>
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando clínicas...</p>
      </div>

      <!-- Content -->
      <div v-else-if="clinicasList.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left border-b border-gray-50 dark:border-white/5">
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Clínica</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Plan Actual</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Estado</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Fecha Registro</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-white/5">
              <tr
                v-for="clinica in clinicasList"
                :key="clinica.id"
                class="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <td class="px-8 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform overflow-hidden font-black text-xs">
                      <img v-if="clinica.logo" :src="clinica.logo_url" class="w-full h-full object-cover">
                      <span v-else>{{ clinica.nombre.substring(0,2).toUpperCase() }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-black text-gray-900 dark:text-white">{{ clinica.nombre }}</p>
                      <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">{{ clinica.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <div class="flex flex-col">
                    <span v-if="clinica.plan" class="text-xs font-black text-gray-700 dark:text-gray-300">{{ clinica.plan.nombre }}</span>
                    <span v-else class="text-[10px] font-black text-gray-300 uppercase tracking-widest">Sin Plan</span>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <span
                    class="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border"
                    :class="{
                      'bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/20': clinica.estado === 'activa',
                      'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20': clinica.estado === 'suspendida',
                      'bg-gray-50 text-gray-500 border-gray-100 dark:bg-white/5 dark:text-gray-400 dark:border-white/10': clinica.estado === 'inactiva'
                    }"
                  >
                    {{ clinica.estado }}
                  </span>
                </td>
                <td class="px-8 py-5">
                  <span class="text-[11px] font-bold text-gray-500 dark:text-gray-400">{{ formatDate(clinica.created_at) }}</span>
                </td>
                <td class="px-8 py-5 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="verDetalle(clinica.id)"
                      class="w-9 h-9 bg-violet-50 dark:bg-orange-500/10 text-violet-600 dark:text-orange-500 rounded-xl hover:bg-violet-600 dark:hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <i class="fas fa-eye text-xs"></i>
                    </button>
                    <button
                      @click="editarClinica(clinica)"
                      class="w-9 h-9 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-xl hover:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button
                      @click="confirmarEliminar(clinica)"
                      class="w-9 h-9 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <i class="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Paginación -->
        <div class="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-50 dark:border-white/5">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Mostrando registros {{ ((paginacion.current_page - 1) * paginacion.per_page) + 1 }} - {{ Math.min(paginacion.current_page * paginacion.per_page, paginacion.total) }} de {{ paginacion.total }}
          </p>

          <div class="flex gap-2">
            <button
              @click="cambiarPagina(paginacion.current_page - 1)"
              :disabled="paginacion.current_page === 1"
              class="w-10 h-10 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-xl hover:bg-violet-600 dark:hover:bg-orange-500 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
            >
              <i class="fas fa-chevron-left text-xs"></i>
            </button>

            <button
              v-for="pagina in paginasVisibles"
              :key="pagina"
              @click="cambiarPagina(pagina)"
              class="px-4 py-2 rounded-xl text-[10px] font-black transition-all"
              :class="pagina === paginacion.current_page
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
              "
            >
              {{ pagina }}
            </button>

            <button
              @click="cambiarPagina(paginacion.current_page + 1)"
              :disabled="paginacion.current_page === paginacion.last_page"
              class="w-10 h-10 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-xl hover:bg-violet-600 dark:hover:bg-orange-500 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
            >
              <i class="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-20 text-center">
        <div class="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-3xl text-gray-200 dark:text-gray-700 mx-auto mb-6">
          <i class="fas fa-hospital"></i>
        </div>
        <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">No hay clínicas registradas</h3>
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-8 max-w-xs mx-auto">Comienza expandiendo el ecosistema DentalCloud agregando una nueva sucursal.</p>
        <button
          @click="modalNuevaClinica = true"
          class="px-8 py-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl"
        >
          Nueva Clínica
        </button>
      </div>
    </div>

    <!-- Modales -->
    <ClinicaFormModal
      v-if="modalNuevaClinica || modalEditarClinica"
      :clinica="clinicaParaEditar"
      @close="cerrarModales"
      @saved="handleClinicaSaved"
    />

    <ConfirmModal
      v-if="modalConfirm.show"
      :title="modalConfirm.title"
      :message="modalConfirm.message"
      :type="modalConfirm.type"
      @confirm="modalConfirm.onConfirm"
      @cancel="modalConfirm.show = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSuperAdminClinicasStore } from '@superadmin/stores/clinicas'
import ClinicaFormModal from '@superadmin/components/ClinicaFormModal.vue'
import ConfirmModal from '@superadmin/components/ConfirmModal.vue'

const router = useRouter()
const clinicasStore = useSuperAdminClinicasStore()

// Refs
const modalNuevaClinica = ref(false)
const modalEditarClinica = ref(false)
const clinicaParaEditar = ref(null)

const modalConfirm = ref({
  show: false,
  title: '',
  message: '',
  type: 'danger',
  onConfirm: null
})

let searchTimeout = null

// Computed
const stats = computed(() => clinicasStore.estadisticas)
const clinicasList = computed(() => clinicasStore.clinicas)
const loading = computed(() => clinicasStore.loading)
const filtros = computed(() => clinicasStore.filtros)
const paginacion = computed(() => clinicasStore.paginacion)

const paginasVisibles = computed(() => {
  const current = paginacion.value.current_page
  const last = paginacion.value.last_page
  const delta = 2
  const range = []
  
  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < last - 1) {
    range.push('...')
  }

  range.unshift(1)
  if (last > 1) {
    range.push(last)
  }

  return range.filter(p => p !== '...' || range.indexOf(p) === range.lastIndexOf(p))
})

// Methods
function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function handleSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    aplicarFiltros()
  }, 500)
}

function aplicarFiltros() {
  clinicasStore.actualizarFiltros(filtros.value)
  clinicasStore.cambiarPagina(1)
}

function limpiarFiltros() {
  clinicasStore.limpiarFiltros()
  clinicasStore.fetchClinicas()
}

function cambiarPagina(pagina) {
  if (pagina !== '...') {
    clinicasStore.cambiarPagina(pagina)
  }
}

function verDetalle(id) {
  router.push(`/superadmin/clinicas/${id}`)
}

function editarClinica(clinica) {
  clinicaParaEditar.value = { ...clinica }
  modalEditarClinica.value = true
}

function confirmarEliminar(clinica) {
  modalConfirm.value = {
    show: true,
    title: 'Eliminar Clínica',
    message: `¿Estás seguro de eliminar "${clinica.nombre}"? Esta acción no se puede deshacer y afectará a todos sus usuarios.`,
    type: 'danger',
    onConfirm: async () => {
      const result = await clinicasStore.eliminarClinica(clinica.id)
      if (result.success) {
        // success toast
      }
      modalConfirm.value.show = false
    }
  }
}

async function exportar() {
  await clinicasStore.exportarClinicas()
}

function cerrarModales() {
  modalNuevaClinica.value = false
  modalEditarClinica.value = false
  clinicaParaEditar.value = null
}

async function handleClinicaSaved() {
  cerrarModales()
  await clinicasStore.fetchClinicas()
  await clinicasStore.fetchEstadisticas()
}

// Lifecycle
onMounted(async () => {
  await clinicasStore.fetchClinicas()
  await clinicasStore.fetchEstadisticas()
})
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>