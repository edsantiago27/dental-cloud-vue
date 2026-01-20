<!-- views/superadmin/Suscripciones.vue -->
<template>
  <div class="space-y-8 animate-fade-in-up">

    <!-- Header con Stats (Bento Grid) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
            <i class="fas fa-check-circle text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Activas</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Suscripciones</p>
        <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stats.activas }}</p>
      </div>

      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
            <i class="fas fa-clock text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-yellow-600 uppercase tracking-widest">Trial</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">En Prueba Gratis</p>
        <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stats.trial }}</p>
      </div>

      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <i class="fas fa-exclamation-triangle text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-orange-600 uppercase tracking-widest">Crítico</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Por Vencer (7d)</p>
        <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stats.por_vencer }}</p>
      </div>

      <div class="bg-violet-600 dark:bg-orange-500 rounded-[2rem] p-6 shadow-lg shadow-violet-200 dark:shadow-orange-500/20">
        <div class="flex items-center justify-between mb-4 text-white">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="fas fa-dollar-sign text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-white/60 uppercase tracking-widest">Ingresos</span>
        </div>
        <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">MRR Proyectado</p>
        <p class="text-2xl font-black text-white tracking-tighter">{{ formatMoney(stats.mrr) }}</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
      <div class="flex flex-col lg:flex-row gap-4 items-center">
        <div class="flex-1 w-full relative">
          <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="filtros.buscar"
            @input="handleSearch"
            type="text"
            placeholder="Buscar por clínica o email..."
            class="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
          >
        </div>
        <div class="flex gap-4 w-full lg:w-auto">
          <select
            v-model="filtros.estado"
            @change="aplicarFiltros"
            class="flex-1 lg:flex-none px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 outline-none cursor-pointer appearance-none"
          >
            <option value="">Todos los estados</option>
            <option value="activa">Activas</option>
            <option value="trial">En Trial</option>
            <option value="suspendida">Suspendidas</option>
            <option value="cancelada">Canceladas</option>
          </select>
          <button
            @click="exportar"
            class="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-2xl border border-transparent hover:border-emerald-600/20 transition-all shadow-sm"
          >
            <i class="fas fa-file-export"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none overflow-hidden">
      <div v-if="loading" class="p-20 text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-violet-600 dark:text-orange-500"></i>
      </div>

      <div v-else-if="suscripcionesList.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left border-b border-gray-50 dark:border-white/5">
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Clínica / Cliente</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan & Modalidad</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado de Pago</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-white/5">
              <tr 
                v-for="suscripcion in suscripcionesList" 
                :key="suscripcion.id"
                class="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <td class="px-8 py-5">
                  <p class="text-sm font-black text-gray-900 dark:text-white">{{ suscripcion.clinica?.nombre }}</p>
                  <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">{{ suscripcion.clinica?.email }}</p>
                </td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <span class="px-3 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[9px] font-black uppercase rounded-lg border border-violet-100 dark:border-violet-500/20">
                      {{ suscripcion.plan?.nombre }}
                    </span>
                    <span class="text-[11px] font-bold text-gray-600 dark:text-gray-300">{{ formatMoney(suscripcion.monto) }} <span class="text-[9px] opacity-60">/ {{ suscripcion.tipo }}</span></span>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <div class="flex flex-col gap-1.5 align-start">
                    <span
                      v-if="suscripcion.es_trial"
                      class="inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-500/20 w-fit"
                    >
                      Trial ({{ suscripcion.dias_restantes }} días)
                    </span>
                    <span
                      class="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border w-fit"
                      :class="{
                        'bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/20': suscripcion.estado === 'activa',
                        'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20': suscripcion.estado === 'suspendida',
                        'bg-gray-50 text-gray-500 border-gray-100 dark:bg-white/5 dark:text-gray-400 dark:border-white/10': suscripcion.estado === 'cancelada'
                      }"
                    >
                      {{ suscripcion.estado }}
                    </span>
                  </div>
                </td>
                <td class="px-8 py-5 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      v-if="suscripcion.es_trial"
                      @click="mostrarModalExtenderTrial(suscripcion)"
                      class="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                      title="Extender Trial"
                    >
                      <i class="fas fa-clock text-xs"></i>
                    </button>
                    <button
                      v-if="suscripcion.estado === 'activa'"
                      @click="confirmarSuspender(suscripcion)"
                      class="w-9 h-9 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <i class="fas fa-pause text-xs"></i>
                    </button>
                    <button
                      @click="$router.push(`/superadmin/clinicas/${suscripcion.clinica_id}`)"
                      class="w-9 h-9 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-xl hover:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <i class="fas fa-external-link-alt text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="px-8 py-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Registros {{ ((paginacion.current_page - 1) * paginacion.per_page) + 1 }}-{{ Math.min(paginacion.current_page * paginacion.per_page, paginacion.total) }} de {{ paginacion.total }}
          </p>
          <div class="flex gap-2">
            <button
              @click="cambiarPagina(paginacion.current_page - 1)"
              :disabled="paginacion.current_page === 1"
              class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400 disabled:opacity-30"
            >
              <i class="fas fa-chevron-left text-xs"></i>
            </button>
            <button
              v-for="pagina in paginasVisibles"
              :key="pagina"
              @click="cambiarPagina(pagina)"
              class="px-4 py-2 rounded-xl text-[10px] font-black"
              :class="pagina === paginacion.current_page ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-400 dark:text-gray-500'"
            >
              {{ pagina }}
            </button>
            <button
              @click="cambiarPagina(paginacion.current_page + 1)"
              :disabled="paginacion.current_page === paginacion.last_page"
              class="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400 disabled:opacity-30"
            >
              <i class="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="p-20 text-center text-gray-400 uppercase font-black text-[10px] tracking-widest">
        No hay suscripciones registradas
      </div>
    </div>

    <!-- Modales -->
    <ExtenderTrialModal
      v-if="modalExtenderTrial.show"
      :suscripcion="modalExtenderTrial.suscripcion"
      @close="modalExtenderTrial.show = false"
      @saved="handleTrialExtendido"
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
import { useSuperAdminSuscripcionesStore } from '@superadmin/stores/suscripciones'
import ExtenderTrialModal from '@superadmin/components/ExtenderTrialModal.vue'
import ConfirmModal from '@superadmin/components/ConfirmModal.vue'

const suscripcionesStore = useSuperAdminSuscripcionesStore()

const modalExtenderTrial = ref({ show: false, suscripcion: null })
const modalConfirm = ref({ show: false, title: '', message: '', type: 'danger', onConfirm: null })

let searchTimeout = null

const stats = computed(() => suscripcionesStore.estadisticas)
const suscripcionesList = computed(() => suscripcionesStore.suscripciones)
const loading = computed(() => suscripcionesStore.loading)
const filtros = computed(() => suscripcionesStore.filtros)
const paginacion = computed(() => suscripcionesStore.paginacion)

const paginasVisibles = computed(() => {
  const current = paginacion.value.current_page
  const last = paginacion.value.last_page
  const delta = 2
  const range = []
  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) range.push(i)
  if (current - delta > 2) range.unshift('...')
  if (current + delta < last - 1) range.push('...')
  range.unshift(1)
  if (last > 1) range.push(last)
  return range.filter(p => p !== '...' || range.indexOf(p) === range.lastIndexOf(p))
})

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value)
}

function handleSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => aplicarFiltros(), 500)
}

function aplicarFiltros() {
  suscripcionesStore.actualizarFiltros(filtros.value)
  suscripcionesStore.cambiarPagina(1)
}

function cambiarPagina(pagina) {
  if (pagina !== '...') suscripcionesStore.cambiarPagina(pagina)
}

function mostrarModalExtenderTrial(suscripcion) {
  modalExtenderTrial.value = { show: true, suscripcion }
}

function confirmarSuspender(suscripcion) {
  modalConfirm.value = {
    show: true,
    title: 'Suspender Suscripción',
    message: `¿Deseas suspender el acceso a "${suscripcion.clinica?.nombre}"?`,
    type: 'warning',
    onConfirm: async () => {
      await suscripcionesStore.suspender(suscripcion.id, '')
      modalConfirm.value.show = false
    }
  }
}

async function exportar() {
  await suscripcionesStore.exportarSuscripciones()
}

async function handleTrialExtendido() {
  modalExtenderTrial.value.show = false
  await suscripcionesStore.fetchSuscripciones()
  await suscripcionesStore.fetchEstadisticas()
}

onMounted(async () => {
  await suscripcionesStore.fetchSuscripciones()
  await suscripcionesStore.fetchEstadisticas()
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