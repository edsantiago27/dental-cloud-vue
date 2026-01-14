<!-- views/superadmin/Suscripciones.vue -->
<template>
  <div class="space-y-6">

    <!-- Header con Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Activas</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.activas }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Trial</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.trial }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Por Vencer</p>
            <p class="text-2xl font-bold text-orange-600">{{ stats.por_vencer }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">MRR</p>
            <p class="text-2xl font-bold text-purple-600">{{ formatMoney(stats.mrr) }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-dollar-sign text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
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
              placeholder="Buscar por clínica o email..."
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
          <option value="activa">Activas</option>
          <option value="trial">Trial</option>
          <option value="suspendida">Suspendidas</option>
          <option value="cancelada">Canceladas</option>
          <option value="por_vencer">Por Vencer (7 días)</option>
        </select>

        <!-- Filtro Tipo -->
        <select
          v-model="filtros.tipo"
          @change="aplicarFiltros"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Todos los tipos</option>
          <option value="mensual">Mensual</option>
          <option value="anual">Anual</option>
        </select>

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
        </div>

      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      
      <!-- Loading -->
      <div v-if="loading" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
        <p class="mt-2 text-gray-500">Cargando suscripciones...</p>
      </div>

      <!-- Tabla -->
      <div v-else-if="suscripcionesList.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clínica
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo / Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="suscripcion in suscripcionesList"
              :key="suscripcion.id"
              class="hover:bg-gray-50 transition"
            >
              <!-- Clínica -->
              <td class="px-6 py-4">
                <div>
                  <p class="font-medium text-gray-900">{{ suscripcion.clinica?.nombre }}</p>
                  <p class="text-sm text-gray-500">{{ suscripcion.clinica?.email }}</p>
                </div>
              </td>

              <!-- Plan -->
              <td class="px-6 py-4">
                <span
                  v-if="suscripcion.plan"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-purple-100 text-purple-800': suscripcion.plan.nombre === 'Enterprise',
                    'bg-blue-100 text-blue-800': suscripcion.plan.nombre === 'Profesional',
                    'bg-green-100 text-green-800': suscripcion.plan.nombre === 'Básico'
                  }"
                >
                  {{ suscripcion.plan.nombre }}
                </span>
                <span v-else class="text-sm text-gray-400">Sin plan</span>
              </td>

              <!-- Tipo / Monto -->
              <td class="px-6 py-4">
                <div class="text-sm">
                  <p class="text-gray-900 font-medium">{{ formatMoney(suscripcion.monto) }}</p>
                  <p class="text-gray-500 capitalize">{{ suscripcion.tipo }}</p>
                </div>
              </td>

              <!-- Estado -->
              <td class="px-6 py-4">
                <div class="space-y-1">
                  <!-- Trial Badge -->
                  <span
                    v-if="suscripcion.es_trial"
                    class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"
                  >
                    <i class="fas fa-clock mr-1"></i>
                    Trial ({{ suscripcion.dias_restantes || 0 }} días)
                  </span>
                  
                  <!-- Estado Badge -->
                  <span
                    class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': suscripcion.estado === 'activa',
                      'bg-red-100 text-red-800': suscripcion.estado === 'suspendida' || suscripcion.estado === 'cancelada',
                      'bg-gray-100 text-gray-800': suscripcion.estado === 'inactiva'
                    }"
                  >
                    <i
                      class="mr-1"
                      :class="{
                        'fas fa-check-circle': suscripcion.estado === 'activa',
                        'fas fa-ban': suscripcion.estado === 'suspendida' || suscripcion.estado === 'cancelada',
                        'fas fa-circle': suscripcion.estado === 'inactiva'
                      }"
                    ></i>
                    {{ suscripcion.estado }}
                  </span>
                </div>
              </td>

              <!-- Período -->
              <td class="px-6 py-4 text-sm text-gray-500">
                <div>
                  <p>{{ formatDate(suscripcion.fecha_inicio) }}</p>
                  <p class="text-xs">hasta {{ formatDate(suscripcion.fecha_fin) }}</p>
                </div>
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  
                  <button
                    v-if="suscripcion.es_trial"
                    @click="mostrarModalExtenderTrial(suscripcion)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Extender trial"
                  >
                    <i class="fas fa-clock"></i>
                  </button>

                  <button
                    v-if="suscripcion.estado === 'activa'"
                    @click="confirmarSuspender(suscripcion)"
                    class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                    title="Suspender"
                  >
                    <i class="fas fa-pause-circle"></i>
                  </button>

                  <button
                    v-if="suscripcion.estado === 'suspendida'"
                    @click="confirmarReactivar(suscripcion)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Reactivar"
                  >
                    <i class="fas fa-play-circle"></i>
                  </button>

                  <button
                    v-if="suscripcion.estado === 'activa' || suscripcion.estado === 'suspendida'"
                    @click="confirmarCancelar(suscripcion)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Cancelar"
                  >
                    <i class="fas fa-times-circle"></i>
                  </button>

                  <button
                    @click="$router.push(`/superadmin/clinicas/${suscripcion.clinica_id}`)"
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
        <i class="fas fa-credit-card text-6xl text-gray-300 mb-4"></i>
        <p class="text-lg text-gray-500 mb-2">No hay suscripciones</p>
        <p class="text-sm text-gray-400">Las suscripciones aparecerán aquí</p>
      </div>

      <!-- Paginación -->
      <div
        v-if="suscripcionesList.length > 0 && paginacion.last_page > 1"
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
import { useSuperAdminSuscripcionesStore } from '../stores/superadmin/suscripciones'
import ExtenderTrialModal from '../components/ExtenderTrialModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const suscripcionesStore = useSuperAdminSuscripcionesStore()

const modalExtenderTrial = ref({
  show: false,
  suscripcion: null
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
  suscripcionesStore.actualizarFiltros(filtros.value)
  suscripcionesStore.cambiarPagina(1)
}

function limpiarFiltros() {
  suscripcionesStore.limpiarFiltros()
  suscripcionesStore.fetchSuscripciones()
}

function cambiarPagina(pagina) {
  if (pagina !== '...') {
    suscripcionesStore.cambiarPagina(pagina)
  }
}

function mostrarModalExtenderTrial(suscripcion) {
  modalExtenderTrial.value = {
    show: true,
    suscripcion
  }
}

function confirmarSuspender(suscripcion) {
  modalConfirm.value = {
    show: true,
    title: 'Suspender Suscripción',
    message: `¿Estás seguro de suspender la suscripción de "${suscripcion.clinica?.nombre}"?`,
    type: 'warning',
    onConfirm: async () => {
      const motivo = prompt('Motivo de suspensión (opcional):')
      const result = await suscripcionesStore.suspender(suscripcion.id, motivo || '')
      
      if (result.success) {
        alert('Suscripción suspendida exitosamente')
      } else {
        alert(result.message || 'Error al suspender suscripción')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function confirmarReactivar(suscripcion) {
  modalConfirm.value = {
    show: true,
    title: 'Reactivar Suscripción',
    message: `¿Estás seguro de reactivar la suscripción de "${suscripcion.clinica?.nombre}"?`,
    type: 'success',
    onConfirm: async () => {
      const result = await suscripcionesStore.reactivar(suscripcion.id)
      
      if (result.success) {
        alert('Suscripción reactivada exitosamente')
      } else {
        alert(result.message || 'Error al reactivar suscripción')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function confirmarCancelar(suscripcion) {
  modalConfirm.value = {
    show: true,
    title: 'Cancelar Suscripción',
    message: `¿Estás seguro de cancelar la suscripción de "${suscripcion.clinica?.nombre}"? Esta acción no se puede deshacer.`,
    type: 'danger',
    onConfirm: async () => {
      const motivo = prompt('Motivo de cancelación (opcional):')
      const result = await suscripcionesStore.cancelar(suscripcion.id, motivo || '')
      
      if (result.success) {
        alert('Suscripción cancelada exitosamente')
      } else {
        alert(result.message || 'Error al cancelar suscripción')
      }
      
      modalConfirm.value.show = false
    }
  }
}

async function exportar() {
  const result = await suscripcionesStore.exportarSuscripciones()
  if (!result.success) {
    alert('Error al exportar suscripciones')
  }
}

async function handleTrialExtendido() {
  modalExtenderTrial.value.show = false
  await suscripcionesStore.fetchSuscripciones()
  await suscripcionesStore.fetchEstadisticas()
}

// Lifecycle
onMounted(async () => {
  await suscripcionesStore.fetchSuscripciones()
  await suscripcionesStore.fetchEstadisticas()
})
</script>