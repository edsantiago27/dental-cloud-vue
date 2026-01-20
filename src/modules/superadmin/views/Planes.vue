<!-- views/superadmin/Planes.vue -->
<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Gestión de Planes</h2>
        <p class="text-sm text-gray-500 mt-1">Configura los planes disponibles para las clínicas</p>
      </div>
      <button
        @click="modalNuevoPlan = true"
        class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        <i class="fas fa-plus mr-2"></i>
        Nuevo Plan
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && planesList.length === 0" class="flex justify-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
    </div>

    <!-- Planes Grid -->
    <div v-else-if="planesList.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div
        v-for="plan in planesOrdenados"
        :key="plan.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl"
        :class="{
          'border-purple-500': plan.nombre === 'Enterprise',
          'border-blue-500': plan.nombre === 'Profesional',
          'border-green-500': plan.nombre === 'Básico',
          'border-gray-300': !['Enterprise', 'Profesional', 'Básico'].includes(plan.nombre),
          'opacity-60': plan.estado !== 'activo'
        }"
      >
        
        <!-- Header del Plan -->
        <div
          class="p-6 text-white"
          :class="{
            'bg-gradient-to-br from-purple-600 to-purple-700': plan.nombre === 'Enterprise',
            'bg-gradient-to-br from-blue-600 to-blue-700': plan.nombre === 'Profesional',
            'bg-gradient-to-br from-green-600 to-green-700': plan.nombre === 'Básico',
            'bg-gradient-to-br from-gray-600 to-gray-700': !['Enterprise', 'Profesional', 'Básico'].includes(plan.nombre)
          }"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-2xl font-bold">{{ plan.nombre }}</h3>
              <p class="text-sm opacity-90 mt-1">{{ plan.descripcion }}</p>
            </div>
            <span
              v-if="plan.estado !== 'activo'"
              class="px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full"
            >
              {{ plan.estado === 'descontinuado' ? 'Descontinuado' : 'Inactivo' }}
            </span>
          </div>
          
          <!-- Precio -->
          <div class="mt-6">
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-bold">{{ formatMoney(plan.precio_mensual) }}</span>
              <span class="text-sm opacity-80">/mes</span>
            </div>
            <div class="mt-2 text-sm opacity-90">
              o {{ formatMoney(plan.precio_anual) }} /año
              <span class="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs">
                {{ calcularDescuento(plan) }}% OFF
              </span>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="p-6">
          
          <!-- Límites -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-3 text-sm">
              <i class="fas fa-users text-blue-600 w-5"></i>
              <span class="flex-1 text-gray-700">Pacientes</span>
              <span class="font-semibold text-gray-900">
                {{ plan.max_pacientes || 'Ilimitado' }}
              </span>
            </div>
            
            <div class="flex items-center gap-3 text-sm">
              <i class="fas fa-user-md text-purple-600 w-5"></i>
              <span class="flex-1 text-gray-700">Profesionales</span>
              <span class="font-semibold text-gray-900">
                {{ plan.max_profesionales || 'Ilimitado' }}
              </span>
            </div>

            <div class="flex items-center gap-3 text-sm">
              <i class="fas fa-calendar text-green-600 w-5"></i>
              <span class="flex-1 text-gray-700">Citas</span>
              <span class="font-semibold text-gray-900">Ilimitado</span>
            </div>

            <div class="flex items-center gap-3 text-sm">
              <i class="fas fa-hdd text-orange-600 w-5"></i>
              <span class="flex-1 text-gray-700">Almacenamiento</span>
              <span class="font-semibold text-gray-900">
                {{ plan.max_almacenamiento || 'Ilimitado' }} GB
              </span>
            </div>
          </div>

          <!-- Módulos -->
          <div class="border-t pt-4">
            <p class="text-xs font-semibold text-gray-500 uppercase mb-3">Módulos Incluidos</p>
            <div class="space-y-2">
              <div
                v-for="modulo in modulosDisponibles"
                :key="modulo.key"
                class="flex items-center gap-2 text-sm"
              >
                <i
                  class="text-xs"
                  :class="plan.modulos?.[modulo.key]
                    ? 'fas fa-check-circle text-green-600'
                    : 'fas fa-times-circle text-gray-300'
                  "
                ></i>
                <span
                  :class="plan.modulos?.[modulo.key] ? 'text-gray-700' : 'text-gray-400'"
                >
                  {{ modulo.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Clínicas usando este plan -->
          <div v-if="plan.clinicas_count" class="mt-6 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="fas fa-hospital"></i>
              <span>{{ plan.clinicas_count }} clínica(s) usando este plan</span>
            </div>
          </div>

        </div>

        <!-- Acciones -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
          <button
            @click="editarPlan(plan)"
            class="flex-1 px-4 py-2 text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition text-sm"
          >
            <i class="fas fa-edit mr-2"></i>
            Editar
          </button>

          <button
            v-if="plan.estado === 'activo'"
            @click="confirmarDesactivar(plan)"
            class="px-4 py-2 text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition text-sm"
          >
            <i class="fas fa-pause-circle"></i>
          </button>

          <button
            v-else
            @click="confirmarActivar(plan)"
            class="px-4 py-2 text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition text-sm"
          >
            <i class="fas fa-play-circle"></i>
          </button>

          <button
            @click="confirmarEliminar(plan)"
            class="px-4 py-2 text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition text-sm"
            :disabled="plan.clinicas_count > 0"
            :title="plan.clinicas_count > 0 ? 'No se puede eliminar un plan en uso' : 'Eliminar plan'"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>

      </div>

    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow p-12 text-center">
      <i class="fas fa-layer-group text-6xl text-gray-300 mb-4"></i>
      <p class="text-lg text-gray-500 mb-2">No hay planes configurados</p>
      <p class="text-sm text-gray-400 mb-4">Crea el primer plan para comenzar</p>
      <button
        @click="modalNuevoPlan = true"
        class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        <i class="fas fa-plus mr-2"></i>
        Crear Primer Plan
      </button>
    </div>

    <!-- Modales -->
    <PlanFormModal
      v-if="modalNuevoPlan || modalEditarPlan"
      :plan="planParaEditar"
      @close="cerrarModales"
      @saved="handlePlanSaved"
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
import { useSuperAdminPlanesStore } from '@superadmin/stores/planes'
import PlanFormModal from '@superadmin/components/PlanFormModal.vue'
import ConfirmModal from '@superadmin/components/ConfirmModal.vue'

const planesStore = useSuperAdminPlanesStore()

const modalNuevoPlan = ref(false)
const modalEditarPlan = ref(false)
const planParaEditar = ref(null)

const modalConfirm = ref({
  show: false,
  title: '',
  message: '',
  type: 'danger',
  onConfirm: null
})

// Módulos disponibles
const modulosDisponibles = [
  { key: 'agenda', label: 'Agenda y Citas' },
  { key: 'historia_clinica', label: 'Historia Clínica' },
  { key: 'facturacion', label: 'Facturación' },
  { key: 'inventario', label: 'Inventario' },
  { key: 'reportes', label: 'Reportes' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'recordatorios', label: 'Recordatorios' }
]

// Computed
const planesList = computed(() => planesStore.planes)
const planesOrdenados = computed(() => planesStore.planesOrdenados)
const loading = computed(() => planesStore.loading)

// Methods
function formatMoney(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value)
}

function calcularDescuento(plan) {
  if (!plan.precio_mensual || !plan.precio_anual) return 0
  const mensualAnualizado = plan.precio_mensual * 12
  const descuento = ((mensualAnualizado - plan.precio_anual) / mensualAnualizado) * 100
  return Math.round(descuento)
}

function editarPlan(plan) {
  planParaEditar.value = { ...plan }
  modalEditarPlan.value = true
}

function confirmarActivar(plan) {
  modalConfirm.value = {
    show: true,
    title: 'Activar Plan',
    message: `¿Estás seguro de activar el plan "${plan.nombre}"? Estará disponible para nuevas clínicas.`,
    type: 'success',
    onConfirm: async () => {
      const result = await planesStore.activarPlan(plan.id)
      
      if (result.success) {
        alert('Plan activado exitosamente')
      } else {
        alert(result.message || 'Error al activar plan')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function confirmarDesactivar(plan) {
  modalConfirm.value = {
    show: true,
    title: 'Desactivar Plan',
    message: `¿Estás seguro de desactivar el plan "${plan.nombre}"? No estará disponible para nuevas clínicas.`,
    type: 'warning',
    onConfirm: async () => {
      const result = await planesStore.desactivarPlan(plan.id)
      
      if (result.success) {
        alert('Plan desactivado exitosamente')
      } else {
        alert(result.message || 'Error al desactivar plan')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function confirmarEliminar(plan) {
  if (plan.clinicas_count > 0) {
    alert('No se puede eliminar un plan que está siendo usado por clínicas')
    return
  }

  modalConfirm.value = {
    show: true,
    title: 'Eliminar Plan',
    message: `¿Estás seguro de eliminar el plan "${plan.nombre}"? Esta acción no se puede deshacer.`,
    type: 'danger',
    onConfirm: async () => {
      const result = await planesStore.eliminarPlan(plan.id)
      
      if (result.success) {
        alert('Plan eliminado exitosamente')
      } else {
        alert(result.message || 'Error al eliminar plan')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function cerrarModales() {
  modalNuevoPlan.value = false
  modalEditarPlan.value = false
  planParaEditar.value = null
}

async function handlePlanSaved() {
  cerrarModales()
  await planesStore.fetchPlanes()
}

// Lifecycle
onMounted(() => {
  planesStore.fetchPlanes()
})
</script>