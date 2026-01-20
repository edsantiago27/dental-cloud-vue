<!-- views/superadmin/Facturacion.vue -->
<template>
  <div class="space-y-8 animate-fade-in-up">

    <!-- Header con Stats (Bento Grid) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <i class="fas fa-money-bill-wave text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Recaudado</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Ingresos del Mes</p>
        <p class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{{ formatMoney(stats.ingresos_mes) }}</p>
      </div>

      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400">
            <i class="fas fa-clock text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-orange-600 uppercase tracking-widest">Pendientes</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Cuentas por Cobrar</p>
        <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stats.pendientes }}</p>
      </div>

      <div class="bg-white dark:bg-[#111111] rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
            <i class="fas fa-exclamation-circle text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-red-600 uppercase tracking-widest">Crítico</span>
        </div>
        <p class="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Facturas Vencidas</p>
        <p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{{ stats.vencidas }}</p>
      </div>

      <div class="bg-violet-600 dark:bg-orange-500 rounded-[2rem] p-6 shadow-lg shadow-violet-200 dark:shadow-orange-500/20">
        <div class="flex items-center justify-between mb-4 text-white">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="fas fa-chart-pie text-lg"></i>
          </div>
          <span class="text-[9px] font-black text-white/60 uppercase tracking-widest">Performance</span>
        </div>
        <p class="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Tasa de Cobro</p>
        <p class="text-3xl font-black text-white tracking-tighter">{{ stats.tasa_cobro }}%</p>
      </div>
    </div>

    <!-- Filtros y Acciones -->
    <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none">
      <div class="flex flex-col xl:flex-row gap-4 items-center">
        <div class="flex-1 w-full relative">
          <i class="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="filtros.buscar"
            @input="handleSearch"
            type="text"
            placeholder="Buscar por clínica o número de factura..."
            class="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-violet-600/20 dark:focus:ring-orange-500/20 text-sm font-bold transition-all outline-none text-gray-900 dark:text-white"
          >
        </div>
        <div class="flex flex-wrap gap-3 w-full xl:w-auto">
          <select
            v-model="filtros.estado"
            @change="aplicarFiltros"
            class="px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 outline-none cursor-pointer appearance-none"
          >
            <option value="">Estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="pagada">Pagadas</option>
            <option value="vencida">Vencidas</option>
          </select>

          <input
            v-model="filtros.mes"
            @change="aplicarFiltros"
            type="month"
            class="px-6 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 outline-none cursor-pointer"
          >

          <div class="flex gap-2 ml-auto xl:ml-0">
            <button
              @click="modalGenerarMasivo = true"
              class="px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Generación Masiva
            </button>
            <button
              @click="modalNuevaFactura = true"
              class="p-4 bg-violet-600 dark:bg-orange-500 text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-violet-200 dark:shadow-orange-500/20"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white dark:bg-[#111111] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-100/20 dark:shadow-none overflow-hidden text-gray-900 dark:text-white">
      <div v-if="loading" class="p-20 text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-violet-600 dark:text-orange-500"></i>
      </div>

      <div v-else-if="facturasList.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left border-b border-gray-50 dark:border-white/5">
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Documento</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Clínica Emisora</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Monto Neto</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking de Pago</th>
                <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Draft</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 dark:divide-white/5">
              <tr 
                v-for="factura in facturasList" 
                :key="factura.id"
                class="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <td class="px-8 py-5">
                  <p class="text-sm font-black">{{ factura.numero }}</p>
                  <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">{{ formatDate(factura.fecha_emision) }}</p>
                </td>
                <td class="px-8 py-5">
                  <p class="text-sm font-black">{{ factura.clinica?.nombre }}</p>
                  <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">{{ factura.suscripcion?.plan?.nombre }}</p>
                </td>
                <td class="px-8 py-5">
                  <p class="text-sm font-black text-emerald-600 dark:text-emerald-500">{{ formatMoney(factura.total) }}</p>
                  <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">{{ factura.suscripcion?.tipo }}</p>
                </td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <span 
                      class="px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border"
                      :class="{
                        'bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/20': factura.estado === 'pagada',
                        'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-500 dark:border-orange-500/20': factura.estado === 'pendiente',
                        'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/20': factura.estado === 'vencida'
                      }"
                    >
                      {{ factura.estado }}
                    </span>
                    <span v-if="factura.estado !== 'pagada'" class="text-[10px] font-bold" :class="factura.dias_vencimiento < 0 ? 'text-red-500' : 'text-gray-400'">
                      {{ factura.dias_vencimiento < 0 ? 'Expirada' : `Vence en ${factura.dias_vencimiento}d` }}
                    </span>
                  </div>
                </td>
                <td class="px-8 py-5 text-right">
                  <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      v-if="factura.estado !== 'pagada'"
                      @click="mostrarModalRegistrarPago(factura)"
                      class="w-9 h-9 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <i class="fas fa-check text-xs"></i>
                    </button>
                    <button
                      v-if="factura.estado !== 'pagada'"
                      @click="confirmarEnviarRecordatorio(factura)"
                      class="w-9 h-9 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                    >
                      <i class="fas fa-paper-plane text-xs"></i>
                    </button>
                    <button
                      @click="$router.push(`/superadmin/clinicas/${factura.clinica_id}`)"
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
        No se han generado facturas en este periodo
      </div>
    </div>

    <!-- Modales -->
    <GenerarFacturaModal
      v-if="modalNuevaFactura"
      @close="modalNuevaFactura = false"
      @saved="handleFacturaGenerada"
    />

    <RegistrarPagoModal
      v-if="modalRegistrarPago.show"
      :factura="modalRegistrarPago.factura"
      @close="modalRegistrarPago.show = false"
      @saved="handlePagoRegistrado"
    />

    <ConfirmModal
      v-if="modalConfirm.show"
      :title="modalConfirm.title"
      :message="modalConfirm.message"
      :type="modalConfirm.type"
      @confirm="modalConfirm.onConfirm"
      @cancel="modalConfirm.show = false"
    />

    <GenerarMasivoModal
      v-if="modalGenerarMasivo"
      @close="modalGenerarMasivo = false"
      @saved="handleMasivoGenerado"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSuperAdminFacturacionStore } from '@superadmin/stores/facturacion'
import GenerarFacturaModal from '@superadmin/components/GenerarFacturaModal.vue'
import RegistrarPagoModal from '@superadmin/components/RegistrarPagoModal.vue'
import GenerarMasivoModal from '@superadmin/components/GenerarMasivoModal.vue'
import ConfirmModal from '@superadmin/components/ConfirmModal.vue'

const facturacionStore = useSuperAdminFacturacionStore()
const modalNuevaFactura = ref(false)
const modalGenerarMasivo = ref(false)
const modalRegistrarPago = ref({ show: false, factura: null })
const modalConfirm = ref({ show: false, title: '', message: '', type: 'danger', onConfirm: null })

let searchTimeout = null

const stats = computed(() => facturacionStore.estadisticas)
const facturasList = computed(() => facturacionStore.facturas)
const loading = computed(() => facturacionStore.loading)
const filtros = computed(() => facturacionStore.filtros)
const paginacion = computed(() => facturacionStore.paginacion)

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

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value)
}

function handleSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => aplicarFiltros(), 500)
}

function aplicarFiltros() {
  facturacionStore.actualizarFiltros(filtros.value)
  facturacionStore.cambiarPagina(1)
}

function cambiarPagina(pagina) {
  if (pagina !== '...') facturacionStore.cambiarPagina(pagina)
}

function mostrarModalRegistrarPago(factura) {
  modalRegistrarPago.value = { show: true, factura }
}

onMounted(async () => {
  await facturacionStore.fetchFacturas()
  await facturacionStore.fetchEstadisticas()
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