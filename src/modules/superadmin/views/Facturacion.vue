<!-- views/superadmin/Facturacion.vue -->
<template>
  <div class="space-y-6">

    <!-- Header con Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Ingresos del Mes</p>
            <p class="text-2xl font-bold text-green-600">{{ formatMoney(stats.ingresos_mes) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-dollar-sign text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Pendientes</p>
            <p class="text-2xl font-bold text-orange-600">{{ stats.pendientes }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-clock text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Vencidas</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.vencidas }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Tasa de Cobro</p>
            <p class="text-2xl font-bold text-blue-600">{{ stats.tasa_cobro }}%</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-chart-line text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y Acciones -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex flex-col md:flex-row gap-4">
        
        <!-- Búsqueda -->
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              v-model="filtros.buscar"
              @input="handleSearch"
              type="text"
              placeholder="Buscar por clínica o número..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
        </div>

        <!-- Filtro Estado -->
        <select
          v-model="filtros.estado"
          @change="aplicarFiltros"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="pagada">Pagadas</option>
          <option value="vencida">Vencidas</option>
          <option value="anulada">Anuladas</option>
        </select>

        <!-- Filtro Mes -->
        <input
          v-model="filtros.mes"
          @change="aplicarFiltros"
          type="month"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >

        <!-- Botones -->
        <div class="flex gap-2">
          <button
            @click="limpiarFiltros"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <i class="fas fa-times mr-2"></i>
            Limpiar
          </button>

          <button
            @click="exportar"
            class="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            <i class="fas fa-file-export mr-2"></i>
            Exportar
          </button>

          <button
            @click="modalGenerarMasivo = true"
            class="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            <i class="fas fa-layer-group mr-2"></i>
            Generar Masivo
          </button>

          <button
            @click="modalNuevaFactura = true"
            class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            <i class="fas fa-plus mr-2"></i>
            Nueva Factura
          </button>
        </div>

      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      
      <!-- Loading -->
      <div v-if="loading" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
        <p class="mt-2 text-gray-500">Cargando facturas...</p>
      </div>

      <!-- Tabla -->
      <div v-else-if="facturasList.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clínica
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimiento
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="factura in facturasList"
              :key="factura.id"
              class="hover:bg-gray-50 transition"
            >
              <!-- Número -->
              <td class="px-6 py-4">
                <div class="text-sm">
                  <p class="font-medium text-gray-900">{{ factura.numero }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(factura.fecha_emision) }}</p>
                </div>
              </td>

              <!-- Clínica -->
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ factura.clinica?.nombre }}</p>
                  <p class="text-sm text-gray-500">{{ factura.suscripcion?.plan?.nombre }}</p>
                </div>
              </td>

              <!-- Monto -->
              <td class="px-6 py-4">
                <div class="text-sm">
                  <p class="font-semibold text-gray-900">{{ formatMoney(factura.total) }}</p>
                  <p class="text-xs text-gray-500">{{ factura.suscripcion?.tipo }}</p>
                </div>
              </td>

              <!-- Estado -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': factura.estado === 'pagada',
                    'bg-orange-100 text-orange-800': factura.estado === 'pendiente',
                    'bg-red-100 text-red-800': factura.estado === 'vencida',
                    'bg-gray-100 text-gray-800': factura.estado === 'anulada'
                  }"
                >
                  <i
                    class="mr-1"
                    :class="{
                      'fas fa-check-circle': factura.estado === 'pagada',
                      'fas fa-clock': factura.estado === 'pendiente',
                      'fas fa-exclamation-triangle': factura.estado === 'vencida',
                      'fas fa-ban': factura.estado === 'anulada'
                    }"
                  ></i>
                  {{ factura.estado }}
                </span>
              </td>

              <!-- Vencimiento -->
              <td class="px-6 py-4 text-sm">
                <div>
                  <p class="text-gray-900">{{ formatDate(factura.fecha_vencimiento) }}</p>
                  <p v-if="factura.dias_vencimiento" class="text-xs" :class="{
                    'text-red-600': factura.dias_vencimiento < 0,
                    'text-orange-600': factura.dias_vencimiento >= 0 && factura.dias_vencimiento <= 3,
                    'text-gray-500': factura.dias_vencimiento > 3
                  }">
                    {{ factura.dias_vencimiento < 0 ? 'Vencida' : `${factura.dias_vencimiento} días` }}
                  </p>
                </div>
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  
                  <button
                    v-if="factura.estado === 'pendiente' || factura.estado === 'vencida'"
                    @click="mostrarModalRegistrarPago(factura)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Registrar pago"
                  >
                    <i class="fas fa-dollar-sign"></i>
                  </button>

                  <button
                    v-if="factura.estado === 'pendiente' || factura.estado === 'vencida'"
                    @click="confirmarEnviarRecordatorio(factura)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Enviar recordatorio"
                  >
                    <i class="fas fa-envelope"></i>
                  </button>

                  <button
                    v-if="factura.estado !== 'anulada'"
                    @click="confirmarAnular(factura)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Anular factura"
                  >
                    <i class="fas fa-ban"></i>
                  </button>

                  <button
                    @click="$router.push(`/superadmin/clinicas/${factura.clinica_id}`)"
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                    title="Ver clínica"
                  >
                    <i class="fas fa-external-link-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <i class="fas fa-file-invoice text-6xl text-gray-300 mb-4"></i>
        <p class="text-lg text-gray-500 mb-2">No hay facturas</p>
        <p class="text-sm text-gray-400 mb-4">Las facturas aparecerán aquí</p>
        <button
          @click="modalNuevaFactura = true"
          class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          <i class="fas fa-plus mr-2"></i>
          Nueva Factura
        </button>
      </div>

      <!-- Paginación -->
      <div
        v-if="facturasList.length > 0 && paginacion.last_page > 1"
        class="px-6 py-4 border-t border-gray-200"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">
            Mostrando {{ ((paginacion.current_page - 1) * paginacion.per_page) + 1 }}
            a {{ Math.min(paginacion.current_page * paginacion.per_page, paginacion.total) }}
            de {{ paginacion.total }} resultados
          </p>

          <div class="flex gap-2">
            <button
              @click="cambiarPagina(paginacion.current_page - 1)"
              :disabled="paginacion.current_page === 1"
              class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-left"></i>
            </button>

            <button
              v-for="pagina in paginasVisibles"
              :key="pagina"
              @click="cambiarPagina(pagina)"
              class="px-3 py-2 border rounded-lg transition"
              :class="pagina === paginacion.current_page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
              "
            >
              {{ pagina }}
            </button>

            <button
              @click="cambiarPagina(paginacion.current_page + 1)"
              :disabled="paginacion.current_page === paginacion.last_page"
              class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
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
import { useSuperAdminFacturacionStore } from '../stores/superadmin/facturacion'
import GenerarFacturaModal from '../components/GenerarFacturaModal.vue'
import RegistrarPagoModal from '../components/RegistrarPagoModal.vue'
import GenerarMasivoModal from '../components/GenerarMasivoModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const facturacionStore = useSuperAdminFacturacionStore()

const modalNuevaFactura = ref(false)
const modalGenerarMasivo = ref(false)

const modalRegistrarPago = ref({
  show: false,
  factura: null
})

const modalConfirm = ref({
  show: false,
  title: '',
  message: '',
  type: 'danger',
  onConfirm: null
})

let searchTimeout = null

// Computed
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
  
  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) range.unshift('...')
  if (current + delta < last - 1) range.push('...')

  range.unshift(1)
  if (last > 1) range.push(last)

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

function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}

function handleSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    aplicarFiltros()
  }, 500)
}

function aplicarFiltros() {
  facturacionStore.actualizarFiltros(filtros.value)
  facturacionStore.cambiarPagina(1)
}

function limpiarFiltros() {
  facturacionStore.limpiarFiltros()
  facturacionStore.fetchFacturas()
}

function cambiarPagina(pagina) {
  if (pagina !== '...') {
    facturacionStore.cambiarPagina(pagina)
  }
}

function mostrarModalRegistrarPago(factura) {
  modalRegistrarPago.value = {
    show: true,
    factura
  }
}

function confirmarEnviarRecordatorio(factura) {
  modalConfirm.value = {
    show: true,
    title: 'Enviar Recordatorio',
    message: `¿Enviar recordatorio de pago a "${factura.clinica?.nombre}"?`,
    type: 'info',
    onConfirm: async () => {
      const result = await facturacionStore.enviarRecordatorio(factura.id)
      
      if (result.success) {
        alert('Recordatorio enviado exitosamente')
      } else {
        alert(result.message || 'Error al enviar recordatorio')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function confirmarAnular(factura) {
  modalConfirm.value = {
    show: true,
    title: 'Anular Factura',
    message: `¿Estás seguro de anular la factura ${factura.numero}? Esta acción no se puede deshacer.`,
    type: 'danger',
    onConfirm: async () => {
      const motivo = prompt('Motivo de anulación (opcional):')
      const result = await facturacionStore.anularFactura(factura.id, motivo || '')
      
      if (result.success) {
        alert('Factura anulada exitosamente')
      } else {
        alert(result.message || 'Error al anular factura')
      }
      
      modalConfirm.value.show = false
    }
  }
}

async function exportar() {
  const result = await facturacionStore.exportarFacturas()
  if (!result.success) {
    alert('Error al exportar facturas')
  }
}

async function handleFacturaGenerada() {
  modalNuevaFactura.value = false
  await facturacionStore.fetchFacturas()
  await facturacionStore.fetchEstadisticas()
}

async function handlePagoRegistrado() {
  modalRegistrarPago.value.show = false
  await facturacionStore.fetchFacturas()
  await facturacionStore.fetchEstadisticas()
}

async function handleMasivoGenerado() {
  modalGenerarMasivo.value = false
  await facturacionStore.fetchFacturas()
  await facturacionStore.fetchEstadisticas()
}

// Lifecycle
onMounted(async () => {
  await facturacionStore.fetchFacturas()
  await facturacionStore.fetchEstadisticas()
})
</script>