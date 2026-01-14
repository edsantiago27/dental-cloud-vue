<!-- views/superadmin/Clinicas.vue -->
<template>
  <div class="space-y-6">

    <!-- Header con Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Clínicas</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-hospital text-blue-600 text-xl"></i>
          </div>
        </div>
      </div>

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
            <p class="text-sm text-gray-500">Suspendidas</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.suspendidas }}</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <i class="fas fa-ban text-red-600 text-xl"></i>
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
              placeholder="Buscar por nombre, email o RUT..."
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
          <option value="suspendida">Suspendidas</option>
          <option value="inactiva">Inactivas</option>
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

          <button
            @click="modalNuevaClinica = true"
            class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            <i class="fas fa-plus mr-2"></i>
            Nueva Clínica
          </button>
        </div>

      </div>
    </div>

    <!-- Tabla de Clínicas -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      
      <!-- Loading -->
      <div v-if="loading" class="p-8 text-center">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
        <p class="mt-2 text-gray-500">Cargando clínicas...</p>
      </div>

      <!-- Tabla -->
      <div v-else-if="clinicasList.length > 0" class="overflow-x-auto">
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
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registro
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="clinica in clinicasList"
              :key="clinica.id"
              class="hover:bg-gray-50 transition"
            >
              <!-- Clínica -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    v-if="clinica.logo"
                    class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img :src="clinica.logo_url" :alt="clinica.nombre" class="w-full h-full object-cover">
                  </div>
                  <div
                    v-else
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="fas fa-hospital text-blue-600"></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ clinica.nombre }}</p>
                    <p class="text-sm text-gray-500">{{ clinica.slug }}</p>
                  </div>
                </div>
              </td>

              <!-- Plan -->
              <td class="px-6 py-4">
                <span
                  v-if="clinica.plan"
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-purple-100 text-purple-800': clinica.plan.nombre === 'Enterprise',
                    'bg-blue-100 text-blue-800': clinica.plan.nombre === 'Profesional',
                    'bg-green-100 text-green-800': clinica.plan.nombre === 'Básico'
                  }"
                >
                  {{ clinica.plan.nombre }}
                </span>
                <span v-else class="text-sm text-gray-400">Sin plan</span>
              </td>

              <!-- Contacto -->
              <td class="px-6 py-4">
                <div class="text-sm">
                  <p class="text-gray-900">{{ clinica.email }}</p>
                  <p class="text-gray-500">{{ clinica.telefono || '-' }}</p>
                </div>
              </td>

              <!-- Estado -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': clinica.estado === 'activa',
                    'bg-red-100 text-red-800': clinica.estado === 'suspendida',
                    'bg-gray-100 text-gray-800': clinica.estado === 'inactiva'
                  }"
                >
                  <i
                    class="mr-1"
                    :class="{
                      'fas fa-check-circle': clinica.estado === 'activa',
                      'fas fa-ban': clinica.estado === 'suspendida',
                      'fas fa-circle': clinica.estado === 'inactiva'
                    }"
                  ></i>
                  {{ clinica.estado }}
                </span>
              </td>

              <!-- Registro -->
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(clinica.created_at) }}
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="verDetalle(clinica.id)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Ver detalle"
                  >
                    <i class="fas fa-eye"></i>
                  </button>

                  <button
                    @click="editarClinica(clinica)"
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>

                  <button
                    v-if="clinica.estado === 'activa'"
                    @click="confirmarSuspender(clinica)"
                    class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                    title="Suspender"
                  >
                    <i class="fas fa-pause-circle"></i>
                  </button>

                  <button
                    v-if="clinica.estado === 'suspendida'"
                    @click="confirmarActivar(clinica)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Activar"
                  >
                    <i class="fas fa-play-circle"></i>
                  </button>

                  <button
                    @click="confirmarEliminar(clinica)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <i class="fas fa-hospital text-6xl text-gray-300 mb-4"></i>
        <p class="text-lg text-gray-500 mb-2">No hay clínicas registradas</p>
        <p class="text-sm text-gray-400 mb-4">Crea la primera clínica para comenzar</p>
        <button
          @click="modalNuevaClinica = true"
          class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          <i class="fas fa-plus mr-2"></i>
          Nueva Clínica
        </button>
      </div>

      <!-- Paginación -->
      <div
        v-if="clinicasList.length > 0 && paginacion.last_page > 1"
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
import { useSuperAdminClinicasStore } from '@/stores/superadmin/clinicas'
import ClinicaFormModal from '@/components/superadmin/ClinicaFormModal.vue'
import ConfirmModal from '@/components/superadmin/ConfirmModal.vue'

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

function confirmarSuspender(clinica) {
  modalConfirm.value = {
    show: true,
    title: 'Suspender Clínica',
    message: `¿Estás seguro de suspender "${clinica.nombre}"? La clínica no podrá acceder al sistema.`,
    type: 'warning',
    onConfirm: async () => {
      const motivo = prompt('Motivo de suspensión (opcional):')
      const result = await clinicasStore.suspenderClinica(clinica.id, motivo || '')
      
      if (result.success) {
        alert('Clínica suspendida exitosamente')
      } else {
        alert(result.message || 'Error al suspender clínica')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function confirmarActivar(clinica) {
  modalConfirm.value = {
    show: true,
    title: 'Activar Clínica',
    message: `¿Estás seguro de activar "${clinica.nombre}"?`,
    type: 'success',
    onConfirm: async () => {
      const result = await clinicasStore.activarClinica(clinica.id)
      
      if (result.success) {
        alert('Clínica activada exitosamente')
      } else {
        alert(result.message || 'Error al activar clínica')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function confirmarEliminar(clinica) {
  modalConfirm.value = {
    show: true,
    title: 'Eliminar Clínica',
    message: `¿Estás seguro de eliminar "${clinica.nombre}"? Esta acción no se puede deshacer.`,
    type: 'danger',
    onConfirm: async () => {
      const result = await clinicasStore.eliminarClinica(clinica.id)
      
      if (result.success) {
        alert('Clínica eliminada exitosamente')
      } else {
        alert(result.message || 'Error al eliminar clínica')
      }
      
      modalConfirm.value.show = false
    }
  }
}

async function exportar() {
  const result = await clinicasStore.exportarClinicas()
  if (!result.success) {
    alert('Error al exportar clínicas')
  }
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