<!-- views/admin/CuentasView.vue -->
<template>
  <div class="max-w-7xl mx-auto">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          <i class="fas fa-file-invoice text-green-600 mr-2"></i>
          Cuentas por Cobrar
        </h1>
        <p class="text-gray-600 mt-1">Gestión completa de cuentas</p>
      </div>
      
      <button
        @click="showCrearModal = true"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
      >
        <i class="fas fa-plus mr-2"></i>
        Nueva Cuenta
      </button>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Búsqueda -->
        <div class="md:col-span-2">
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Buscar por paciente, concepto..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
        </div>

        <!-- Estado -->
        <select
          v-model="filtros.estado"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="parcial">Pago Parcial</option>
          <option value="pagado">Pagado</option>
          <option value="vencido">Vencido</option>
        </select>

        <!-- Botón Buscar -->
        <button
          @click="buscar"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <i class="fas fa-search mr-2"></i>
          Buscar
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="cuenta in cuentas" :key="cuenta.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              #{{ cuenta.numero || cuenta.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ cuenta.paciente?.nombre }} {{ cuenta.paciente?.apellido }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ cuenta.concepto }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatMonto(cuenta.total) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
              {{ formatMonto(cuenta.saldo) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getEstadoClass(cuenta.estado)"
              >
                {{ getEstadoLabel(cuenta.estado) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatFecha(cuenta.fecha_emision) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="verCuenta(cuenta)"
                  class="text-blue-600 hover:text-blue-800"
                  title="Ver detalles"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  v-if="cuenta.estado === 'pendiente' || cuenta.estado === 'parcial'"
                  @click="registrarPago(cuenta)"
                  class="text-green-600 hover:text-green-800"
                  title="Registrar pago"
                >
                  <i class="fas fa-money-bill-wave"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Mostrando {{ cuentas.length }} de {{ totalCuentas }} cuentas
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="paginaAnterior"
            :disabled="paginacion.current_page === 1"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <span class="px-3 py-1">{{ paginacion.current_page }}</span>
          <button
            @click="paginaSiguiente"
            :disabled="!tieneSiguientePagina"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <CrearCuentaModal
      v-model="showCrearModal"
      @created="handleCreada"
    />

    <RegistrarPagoModal
      v-model="showPagoModal"
      :cuenta="cuentaSeleccionada"
      @registered="handlePagoRegistrado"
    />

    <VerCuentaModal
      v-model="showVerModal"
      :cuenta="cuentaSeleccionada"
      @registrar-pago="abrirRegistrarPago"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFacturacionStore } from '@clinica/stores/facturacion'
import { useNotification } from '@shared/composables/useNotification'
import CrearCuentaModal from '@clinica/components/facturacion/CrearCuentaModal.vue'
import RegistrarPagoModal from '@clinica/components/facturacion/RegistrarPagoModal.vue'
import VerCuentaModal from '@clinica/components/facturacion/VerCuentaModal.vue'

const facturacionStore = useFacturacionStore()
const notify = useNotification()

// State
const filtros = ref({
  busqueda: '',
  estado: ''
})

const showCrearModal = ref(false)
const showPagoModal = ref(false)
const showVerModal = ref(false)
const cuentaSeleccionada = ref(null)

// Computed
const cuentas = computed(() => facturacionStore.cuentas)
const totalCuentas = computed(() => facturacionStore.totalCuentas)
const paginacion = computed(() => facturacionStore.cuentasPaginacion)

const tieneSiguientePagina = computed(() => {
  return paginacion.value.current_page * paginacion.value.per_page < paginacion.value.total
})

// Methods
async function buscar() {
  await facturacionStore.fetchCuentas({
    ...filtros.value,
    page: 1
  })
}

async function paginaAnterior() {
  if (paginacion.value.current_page > 1) {
    await facturacionStore.fetchCuentas({
      ...filtros.value,
      page: paginacion.value.current_page - 1
    })
  }
}

async function paginaSiguiente() {
  if (tieneSiguientePagina.value) {
    await facturacionStore.fetchCuentas({
      ...filtros.value,
      page: paginacion.value.current_page + 1
    })
  }
}

function verCuenta(cuenta) {
  cuentaSeleccionada.value = cuenta
  showVerModal.value = true
}

function registrarPago(cuenta) {
  cuentaSeleccionada.value = cuenta
  showPagoModal.value = true
}

function abrirRegistrarPago(cuenta) {
  cuentaSeleccionada.value = cuenta
  showVerModal.value = false
  showPagoModal.value = true
}

function handleCreada() {
  notify.success('Cuenta creada')
  buscar()
}

function handlePagoRegistrado() {
  notify.success('Pago registrado')
  buscar()
}

function formatMonto(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor || 0)
}

function formatFecha(fecha) {
  if (!fecha) return '-'
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getEstadoClass(estado) {
  const classes = {
    pendiente: 'bg-orange-100 text-orange-700',
    pagado: 'bg-green-100 text-green-700',
    parcial: 'bg-blue-100 text-blue-700',
    anulado: 'bg-gray-100 text-gray-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

function getEstadoLabel(estado) {
  const labels = {
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    parcial: 'Parcial',
    anulado: 'Anulado'
  }
  return labels[estado] || estado
}

// Lifecycle
onMounted(() => {
  buscar()
})
</script>