<!-- views/Facturacion.vue - VERSIÓN COMPLETA CON TODAS LAS FUNCIONALIDADES -->
<template>
  <div class="max-w-7xl mx-auto">
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          <i class="fas fa-file-invoice-dollar text-green-600 mr-2"></i>
          Facturación y Pagos
        </h1>
        <p class="text-gray-600 mt-1">Gestión financiera de la clínica</p>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Selector de Mes -->
        <select
          v-model="mesSeleccionado"
          @change="cargarDashboard"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="mes in meses" :key="mes.value" :value="mes.value">
            {{ mes.label }}
          </option>
        </select>

        <!-- Botón Nueva Cuenta -->
        <button
          @click="showCrearCuentaModal = true"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <i class="fas fa-plus"></i>
          Nueva Cuenta
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando datos...</p>
    </div>

    <!-- Contenido -->
    <div v-else>

      <!-- KPIs Principales -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <!-- Ingresos del Mes -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-blue-100">Ingresos del Mes</p>
            <i class="fas fa-dollar-sign text-2xl text-blue-200"></i>
          </div>
          <p class="text-3xl font-bold">{{ formatMonto(dashboard.ingresos_mes) }}</p>
          <p class="text-xs text-blue-100 mt-2">Total generado</p>
        </div>

        <!-- Cobrado -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-green-100">Cobrado</p>
            <i class="fas fa-check-circle text-2xl text-green-200"></i>
          </div>
          <p class="text-3xl font-bold">{{ formatMonto(dashboard.cobrado_mes) }}</p>
          <p class="text-xs text-green-100 mt-2">Pagos recibidos</p>
        </div>

        <!-- Pendiente -->
        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-orange-100">Por Cobrar</p>
            <i class="fas fa-clock text-2xl text-orange-200"></i>
          </div>
          <p class="text-3xl font-bold">{{ formatMonto(dashboard.pendiente_mes) }}</p>
          <p class="text-xs text-orange-100 mt-2">Cuentas pendientes</p>
        </div>

        <!-- Total Cuentas -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium text-purple-100">Cuentas Activas</p>
            <i class="fas fa-file-invoice text-2xl text-purple-200"></i>
          </div>
          <p class="text-3xl font-bold">{{ dashboard.total_cuentas }}</p>
          <p class="text-xs text-purple-100 mt-2">
            {{ dashboard.cuentas_pendientes }} pendientes
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="border-b border-gray-200">
          <div class="flex">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="cambiarTab(tab.id)"
              class="flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition"
              :class="activeTab === tab.id 
                ? 'border-green-600 text-green-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'"
            >
              <i :class="tab.icon"></i>
              {{ tab.label }}
              <span
                v-if="tab.badge"
                class="ml-1 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-semibold"
              >
                {{ tab.badge }}
              </span>
            </button>
          </div>
        </div>

        <div class="p-6">
          
          <!-- TAB: CUENTAS -->
          <div v-show="activeTab === 'cuentas'">
            <CuentasLista 
              :cuentas="cuentas"
              @ver-cuenta="verCuenta"
              @nueva-cuenta="showCrearCuentaModal = true"
            />
          </div>

          <!-- TAB: PAGOS -->
          <div v-show="activeTab === 'pagos'">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-800">Pagos Recientes</h3>
              <div class="text-sm text-gray-600">
                <i class="fas fa-calendar-day text-green-600 mr-1"></i>
                Hoy: <span class="font-semibold">{{ formatMonto(dashboard.pagos_hoy) }}</span>
              </div>
            </div>
            <PagosLista 
              :pagos="pagos"
              @ver-pago="verPago"
            />
          </div>

          <!-- TAB: FINANCIAMIENTOS -->
          <div v-show="activeTab === 'financiamientos'">
            
            <!-- KPIs Específicos de Financiamientos -->
            <div class="grid grid-cols-4 gap-4 mb-6">
              <!-- Total Financiado -->
              <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md p-4 text-white">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-medium text-indigo-100">Total Financiado</p>
                  <i class="fas fa-wallet text-xl text-indigo-200"></i>
                </div>
                <p class="text-2xl font-bold">{{ formatMonto(estadisticasFinanciamientos.totalFinanciado) }}</p>
                <p class="text-xs text-indigo-100 mt-1">{{ estadisticasFinanciamientos.totalPlanes }} planes activos</p>
              </div>

              <!-- Cuotas Vencidas -->
              <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-4 text-white cursor-pointer hover:shadow-lg transition"
                   @click="filtrosFinanciamientos.soloVencidas = true">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-medium text-red-100">Cuotas Vencidas</p>
                  <i class="fas fa-exclamation-triangle text-xl text-red-200"></i>
                </div>
                <p class="text-2xl font-bold">{{ estadisticasFinanciamientos.cuotasVencidas }}</p>
                <p class="text-xs text-red-100 mt-1">{{ formatMonto(estadisticasFinanciamientos.montoVencido) }}</p>
              </div>

              <!-- Próximas a Vencer -->
              <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-md p-4 text-white">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-medium text-amber-100">Próximas 7 días</p>
                  <i class="fas fa-calendar-check text-xl text-amber-200"></i>
                </div>
                <p class="text-2xl font-bold">{{ estadisticasFinanciamientos.proximasVencer }}</p>
                <p class="text-xs text-amber-100 mt-1">{{ formatMonto(estadisticasFinanciamientos.montoProximo) }}</p>
              </div>

              <!-- Tasa de Cumplimiento -->
              <div class="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-md p-4 text-white">
                <div class="flex items-center justify-between mb-2">
                  <p class="text-xs font-medium text-teal-100">Cumplimiento</p>
                  <i class="fas fa-chart-line text-xl text-teal-200"></i>
                </div>
                <p class="text-2xl font-bold">{{ estadisticasFinanciamientos.tasaCumplimiento }}%</p>
                <p class="text-xs text-teal-100 mt-1">Pagos a tiempo</p>
              </div>
            </div>

            <!-- Filtros y Búsqueda -->
            <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div class="grid grid-cols-12 gap-3">
                <!-- Búsqueda -->
                <div class="col-span-4">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Buscar Paciente</label>
                  <div class="relative">
                    <input
                      v-model="filtrosFinanciamientos.busqueda"
                      type="text"
                      placeholder="Nombre del paciente..."
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                    <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                <!-- Estado -->
                <div class="col-span-2">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    v-model="filtrosFinanciamientos.estado"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="vigente">Vigente</option>
                    <option value="completado">Completado</option>
                    <option value="vencido">Vencido</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <!-- Período -->
                <div class="col-span-2">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Período</label>
                  <select
                    v-model="filtrosFinanciamientos.periodo"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="todos">Todos</option>
                    <option value="mes">Este mes</option>
                    <option value="trimestre">Este trimestre</option>
                    <option value="anio">Este año</option>
                  </select>
                </div>

                <!-- Solo Vencidas -->
                <div class="col-span-2 flex items-end">
                  <label class="flex items-center cursor-pointer">
                    <input
                      v-model="filtrosFinanciamientos.soloVencidas"
                      type="checkbox"
                      class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    >
                    <span class="ml-2 text-sm text-gray-700">Solo vencidas</span>
                  </label>
                </div>

                <!-- Botones -->
                <div class="col-span-2 flex items-end gap-2">
                  <button
                    @click="limpiarFiltros"
                    class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
                  >
                    <i class="fas fa-redo text-xs mr-1"></i>
                    Limpiar
                  </button>
                  <button
                    @click="exportarFinanciamientos"
                    class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                  >
                    <i class="fas fa-file-excel text-xs mr-1"></i>
                    Excel
                  </button>
                </div>
              </div>
            </div>

            <!-- Lista de Financiamientos -->
            <FinanciamientosLista 
              :financiamientos="financiamientosPaginados"
              @ver="verFinanciamiento"
            />

            <!-- Paginación -->
            <div v-if="totalPaginasFinanciamientos > 1" class="flex items-center justify-between mt-6">
              <p class="text-sm text-gray-600">
                Mostrando {{ (paginaActualFinanciamientos - 1) * itemsPorPagina + 1 }} - 
                {{ Math.min(paginaActualFinanciamientos * itemsPorPagina, financiamientosFiltrados.length) }} 
                de {{ financiamientosFiltrados.length }} financiamientos
              </p>
              <div class="flex items-center gap-2">
                <button
                  @click="paginaActualFinanciamientos--"
                  :disabled="paginaActualFinanciamientos === 1"
                  class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="text-sm font-medium text-gray-700">
                  Página {{ paginaActualFinanciamientos }} de {{ totalPaginasFinanciamientos }}
                </span>
                <button
                  @click="paginaActualFinanciamientos++"
                  :disabled="paginaActualFinanciamientos === totalPaginasFinanciamientos"
                  class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- MODALES -->
    
    <!-- Modal: Crear Cuenta -->
    <CrearCuentaModal
      v-model="showCrearCuentaModal"
      @saved="handleCuentaCreada"
    />

    <!-- Modal: Ver Cuenta -->
    <VerCuentaModal
      v-model="showVerCuentaModal"
      :cuenta-id="cuentaSeleccionadaId"
      @updated="handleCuentaActualizada"
      @registrar-pago="abrirRegistrarPago"
      @financiar="abrirCrearFinanciamiento"
    />

    <!-- Modal: Registrar Pago -->
    <RegistrarPagoModal
      v-model="showRegistrarPagoModal"
      :cuenta="cuentaParaPago"
      @saved="handlePagoRegistrado"
    />

    <!-- Modal: Crear Financiamiento -->
    <CrearFinanciamientoModal
      v-model="showCrearFinanciamientoModal"
      :cuenta="cuentaParaFinanciar"
      @saved="handleFinanciamientoCreado"
    />

    <!-- Modal: Ver Financiamiento -->
    <VerFinanciamientoModal
      v-model="showVerFinanciamientoModal"
      :financiamiento="financiamientoSeleccionado"
      @pagar-cuota="abrirPagarCuota"
      @refresh="cargarDashboard"
    />

    <!-- Modal: Pagar Cuota -->
    <PagarCuotaModal
      v-model="showPagarCuotaModal"
      :cuota-data="cuotaData"
      @saved="handleCuotaPagada"
    />

    <!-- Modal: Ver Pago -->
    <VerPagoModal
      v-model="showVerPagoModal"
      :pago="pagoSeleccionado"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useFacturacionStore } from '@clinica/stores/facturacion'
import { useNotification } from '@shared/composables/useNotification'
import CuentasLista from '@clinica/components/facturacion/CuentasLista.vue'
import PagosLista from '@clinica/components/facturacion/PagosLista.vue'
import FinanciamientosLista from '@clinica/components/facturacion/FinanciamientosLista.vue'
import CrearCuentaModal from '@clinica/components/facturacion/CrearCuentaModal.vue'
import RegistrarPagoModal from '@clinica/components/facturacion/RegistrarPagoModal.vue'
import VerCuentaModal from '@clinica/components/facturacion/VerCuentaModal.vue'
import CrearFinanciamientoModal from '@clinica/components/facturacion/CrearFinanciamientoModal.vue'
import VerFinanciamientoModal from '@clinica/components/facturacion/VerFinanciamientoModal.vue'
import PagarCuotaModal from '@clinica/components/facturacion/PagarCuotaModal.vue'
import VerPagoModal from '@clinica/components/facturacion/VerPagoModal.vue'

const facturacionStore = useFacturacionStore()
const notify = useNotification()

// State Principal
const loading = ref(true)
const activeTab = ref('cuentas')
const mesSeleccionado = ref(getMesActual())

// Modales - Cuentas
const showCrearCuentaModal = ref(false)
const showVerCuentaModal = ref(false)
const showRegistrarPagoModal = ref(false)
const cuentaSeleccionadaId = ref(null)
const cuentaParaPago = ref(null)
const cuentaParaFinanciar = ref(null)

// Modales - Financiamientos
const showCrearFinanciamientoModal = ref(false)
const showVerFinanciamientoModal = ref(false)
const showPagarCuotaModal = ref(false)
const financiamientoSeleccionado = ref(null)
const cuotaData = ref(null)

// Modales - Pagos
const showVerPagoModal = ref(false)
const pagoSeleccionado = ref(null)

// Filtros Financiamientos
const filtrosFinanciamientos = ref({
  busqueda: '',
  estado: '',
  periodo: 'todos',
  soloVencidas: false
})

const paginaActualFinanciamientos = ref(1)
const itemsPorPagina = 10

// Meses
const meses = [
  { value: '2026-01', label: 'Enero 2026' },
  { value: '2025-12', label: 'Diciembre 2025' },
  { value: '2025-11', label: 'Noviembre 2025' },
  { value: '2025-10', label: 'Octubre 2025' }
]

// Tabs
const tabs = computed(() => [
  {
    id: 'cuentas',
    label: 'Cuentas',
    icon: 'fas fa-file-invoice',
    badge: dashboard.value.cuentas_pendientes
  },
  {
    id: 'pagos',
    label: 'Pagos',
    icon: 'fas fa-money-bill-wave',
    badge: null
  },
  {
    id: 'financiamientos',
    label: 'Financiamientos',
    icon: 'fas fa-credit-card',
    badge: estadisticasFinanciamientos.value.totalPlanes || null
  }
])

// Computed
const dashboard = computed(() => facturacionStore.dashboard)
const cuentas = computed(() => facturacionStore.cuentas.slice(0, 10))
const pagos = computed(() => facturacionStore.pagos.slice(0, 10))
const financiamientos = computed(() => facturacionStore.financiamientos)

// Estadísticas de Financiamientos
const estadisticasFinanciamientos = computed(() => {
  const fins = financiamientos.value || []
  
  let totalFinanciado = 0
  let totalPlanes = 0
  let cuotasVencidas = 0
  let montoVencido = 0
  let proximasVencer = 0
  let montoProximo = 0
  let cuotasPagadasATiempo = 0
  let totalCuotasPagadas = 0
  
  const hoy = new Date()
  const proximos7Dias = new Date()
  proximos7Dias.setDate(hoy.getDate() + 7)
  
  fins.forEach(fin => {
    if (fin.estado === 'activo' || fin.estado === 'vigente') {
      totalPlanes++
      totalFinanciado += parseFloat(fin.monto_total || 0)
      
      // Procesar cuotas
      if (fin.cuotas && Array.isArray(fin.cuotas)) {
        fin.cuotas.forEach(cuota => {
          const fechaVenc = new Date(cuota.fecha_vencimiento)
          
          if (cuota.estado === 'pendiente') {
            // Vencidas
            if (fechaVenc < hoy) {
              cuotasVencidas++
              montoVencido += parseFloat(cuota.monto || 0)
            }
            // Próximas a vencer
            else if (fechaVenc <= proximos7Dias) {
              proximasVencer++
              montoProximo += parseFloat(cuota.monto || 0)
            }
          }
          
          // Tasa de cumplimiento
          if (cuota.estado === 'pagada') {
            totalCuotasPagadas++
            const fechaPago = new Date(cuota.fecha_pago)
            if (fechaPago <= fechaVenc) {
              cuotasPagadasATiempo++
            }
          }
        })
      }
    }
  })
  
  const tasaCumplimiento = totalCuotasPagadas > 0 
    ? Math.round((cuotasPagadasATiempo / totalCuotasPagadas) * 100)
    : 100
  
  return {
    totalFinanciado,
    totalPlanes,
    cuotasVencidas,
    montoVencido,
    proximasVencer,
    montoProximo,
    tasaCumplimiento
  }
})

// Financiamientos Filtrados
const financiamientosFiltrados = computed(() => {
  let resultado = [...financiamientos.value]
  
  // Filtro de búsqueda
  if (filtrosFinanciamientos.value.busqueda) {
    const busqueda = filtrosFinanciamientos.value.busqueda.toLowerCase()
    resultado = resultado.filter(f => {
      const nombreCompleto = `${f.paciente?.nombre || ''} ${f.paciente?.apellido || ''}`.toLowerCase()
      return nombreCompleto.includes(busqueda)
    })
  }
  
  // Filtro de estado
  if (filtrosFinanciamientos.value.estado) {
    resultado = resultado.filter(f => f.estado === filtrosFinanciamientos.value.estado)
  }
  
  // Filtro de solo vencidas
  if (filtrosFinanciamientos.value.soloVencidas) {
    resultado = resultado.filter(f => {
      if (!f.cuotas || !Array.isArray(f.cuotas)) return false
      return f.cuotas.some(c => {
        if (c.estado !== 'pendiente') return false
        const fechaVenc = new Date(c.fecha_vencimiento)
        return fechaVenc < new Date()
      })
    })
  }
  
  // Filtro de período
  if (filtrosFinanciamientos.value.periodo !== 'todos') {
    const hoy = new Date()
    let fechaInicio = new Date()
    
    if (filtrosFinanciamientos.value.periodo === 'mes') {
      fechaInicio.setMonth(hoy.getMonth())
      fechaInicio.setDate(1)
    } else if (filtrosFinanciamientos.value.periodo === 'trimestre') {
      fechaInicio.setMonth(hoy.getMonth() - 3)
    } else if (filtrosFinanciamientos.value.periodo === 'anio') {
      fechaInicio.setMonth(0)
      fechaInicio.setDate(1)
    }
    
    resultado = resultado.filter(f => {
      const fechaCreacion = new Date(f.created_at)
      return fechaCreacion >= fechaInicio
    })
  }
  
  return resultado
})

// Financiamientos Paginados
const financiamientosPaginados = computed(() => {
  const inicio = (paginaActualFinanciamientos.value - 1) * itemsPorPagina
  const fin = inicio + itemsPorPagina
  return financiamientosFiltrados.value.slice(inicio, fin)
})

const totalPaginasFinanciamientos = computed(() => {
  return Math.ceil(financiamientosFiltrados.value.length / itemsPorPagina)
})

// Watchers
watch(() => filtrosFinanciamientos.value, () => {
  paginaActualFinanciamientos.value = 1
}, { deep: true })

// Methods
async function cargarDashboard() {
  loading.value = true
  
  try {
    const [year, month] = mesSeleccionado.value.split('-')
    
    await Promise.all([
      facturacionStore.fetchDashboard({ year, month }),
      facturacionStore.fetchCuentas({ limit: 100 }),
      facturacionStore.fetchPagosHoy(),
      cargarFinanciamientosCompletos()
    ])
  } catch (error) {
    console.error('Error al cargar dashboard:', error)
    notify.error('Error al cargar dashboard')
  } finally {
    loading.value = false
  }
}

async function cargarFinanciamientosCompletos() {
  try {
    // Cargar lista de financiamientos
    const response = await facturacionStore.fetchFinanciamientos({ limit: 1000 })
    
    if (response.success) {
      const lista = response.data.data || response.data || []
      
      // Cargar detalle completo de cada financiamiento (con cuotas)
      const financiamientosDetallados = []
      
      for (const fin of lista) {
        const detalleResponse = await facturacionStore.fetchFinanciamiento(fin.id)
        if (detalleResponse.success && detalleResponse.data) {
          financiamientosDetallados.push(detalleResponse.data)
        } else {
          financiamientosDetallados.push(fin)
        }
      }
      
      // Actualizar el store manualmente
      facturacionStore.financiamientos = financiamientosDetallados
      
      console.log('✅ Financiamientos cargados:', financiamientosDetallados.length)
    }
  } catch (error) {
    console.error('Error al cargar financiamientos:', error)
  }
}

function cambiarTab(tabId) {
  activeTab.value = tabId
  
  // Cargar datos específicos del tab si es necesario
  if (tabId === 'pagos' && pagos.value.length === 0) {
    facturacionStore.fetchPagosHoy()
  }
}

function getMesActual() {
  const fecha = new Date()
  const year = fecha.getFullYear()
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatMonto(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(valor || 0)
}

// Handlers - Cuentas
function verCuenta(cuenta) {
  cuentaSeleccionadaId.value = cuenta.id
  showVerCuentaModal.value = true
}

function abrirRegistrarPago(cuenta) {
  cuentaParaPago.value = cuenta
  showVerCuentaModal.value = false
  showRegistrarPagoModal.value = true
}

function abrirCrearFinanciamiento(cuenta) {
  cuentaParaFinanciar.value = cuenta
  showVerCuentaModal.value = false
  showCrearFinanciamientoModal.value = true
}

function handleCuentaCreada() {
  notify.success('Cuenta creada correctamente')
  cargarDashboard()
}

function handleCuentaActualizada() {
  notify.success('Cuenta actualizada')
  cargarDashboard()
}

function handlePagoRegistrado() {
  notify.success('Pago registrado correctamente')
  showRegistrarPagoModal.value = false
  cargarDashboard()
}

// Handlers - Financiamientos
async function verFinanciamiento(financiamiento) {
  console.log('📋 Ver financiamiento:', financiamiento.id)
  
  // Cargar detalles completos
  const response = await facturacionStore.fetchFinanciamiento(financiamiento.id)
  
  if (response.success) {
    financiamientoSeleccionado.value = response.data
  } else {
    financiamientoSeleccionado.value = financiamiento
  }
  
  showVerFinanciamientoModal.value = true
}

function abrirPagarCuota(data) {
  cuotaData.value = data
  showVerFinanciamientoModal.value = false
  showPagarCuotaModal.value = true
}

function handleFinanciamientoCreado() {
  notify.success('Financiamiento creado correctamente')
  showCrearFinanciamientoModal.value = false
  cargarDashboard()
}

async function handleCuotaPagada() {
  notify.success('Cuota pagada correctamente')
  showPagarCuotaModal.value = false
  await cargarDashboard()
}

function limpiarFiltros() {
  filtrosFinanciamientos.value = {
    busqueda: '',
    estado: '',
    periodo: 'todos',
    soloVencidas: false
  }
}

function exportarFinanciamientos() {
  // Preparar datos para exportar
  const datos = financiamientosFiltrados.value.map(f => ({
    'Paciente': `${f.paciente?.nombre || ''} ${f.paciente?.apellido || ''}`,
    'Estado': f.estado,
    'Cuotas': `${f.cuotas_pagadas || 0}/${f.numero_cuotas || 0}`,
    'Total': f.monto_total,
    'Pagado': f.monto_pagado || 0,
    'Saldo': f.saldo_pendiente || f.monto_total,
    'Fecha': new Date(f.created_at).toLocaleDateString('es-CL')
  }))
  
  // Convertir a CSV
  const headers = Object.keys(datos[0])
  const csv = [
    headers.join(','),
    ...datos.map(row => headers.map(h => row[h]).join(','))
  ].join('\n')
  
  // Descargar
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `financiamientos_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  
  notify.success('Archivo exportado correctamente')
}

// Handlers - Pagos
function verPago(pago) {
  pagoSeleccionado.value = pago
  showVerPagoModal.value = true
}

// Lifecycle
onMounted(async () => {
  await cargarDashboard()
})
</script>