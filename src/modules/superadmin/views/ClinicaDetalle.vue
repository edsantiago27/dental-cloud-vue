<!-- views/superadmin/ClinicaDetalle.vue -->
<template>
  <div v-if="loading && !clinica" class="flex items-center justify-center h-64">
    <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
  </div>

  <div v-else-if="clinica" class="space-y-6">

    <!-- Header -->
    <div class="flex items-center gap-4">
      <button
        @click="$router.back()"
        class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
      >
        <i class="fas fa-arrow-left"></i>
      </button>
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900">{{ clinica.nombre }}</h2>
        <p class="text-sm text-gray-500">{{ clinica.slug }}</p>
      </div>
      <span
        class="px-3 py-1 text-sm font-medium rounded-full"
        :class="{
          'bg-green-100 text-green-800': clinica.estado === 'activa',
          'bg-red-100 text-red-800': clinica.estado === 'suspendida',
          'bg-gray-100 text-gray-800': clinica.estado === 'inactiva'
        }"
      >
        {{ clinica.estado }}
      </span>
    </div>

    <!-- Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Info General -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-info-circle text-blue-600 mr-2"></i>
          Información General
        </h3>
        
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <i class="fas fa-envelope text-gray-400 mt-1"></i>
            <div class="flex-1">
              <p class="text-xs text-gray-500">Email</p>
              <p class="text-sm font-medium text-gray-900">{{ clinica.email }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <i class="fas fa-phone text-gray-400 mt-1"></i>
            <div class="flex-1">
              <p class="text-xs text-gray-500">Teléfono</p>
              <p class="text-sm font-medium text-gray-900">{{ clinica.telefono || '-' }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <i class="fas fa-map-marker-alt text-gray-400 mt-1"></i>
            <div class="flex-1">
              <p class="text-xs text-gray-500">Dirección</p>
              <p class="text-sm font-medium text-gray-900">
                {{ clinica.direccion || '-' }}<br>
                {{ clinica.ciudad }}, {{ clinica.region }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <i class="fas fa-calendar text-gray-400 mt-1"></i>
            <div class="flex-1">
              <p class="text-xs text-gray-500">Registro</p>
              <p class="text-sm font-medium text-gray-900">{{ formatDate(clinica.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Plan y Suscripción -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-credit-card text-purple-600 mr-2"></i>
          Plan y Suscripción
        </h3>

        <div v-if="clinica.plan" class="space-y-3">
          <div>
            <p class="text-xs text-gray-500 mb-1">Plan Actual</p>
            <span
              class="inline-flex px-3 py-1 text-sm font-medium rounded-full"
              :class="{
                'bg-purple-100 text-purple-800': clinica.plan.nombre === 'Enterprise',
                'bg-blue-100 text-blue-800': clinica.plan.nombre === 'Profesional',
                'bg-green-100 text-green-800': clinica.plan.nombre === 'Básico'
              }"
            >
              {{ clinica.plan.nombre }}
            </span>
          </div>

          <div v-if="suscripcionActual">
            <p class="text-xs text-gray-500 mb-1">Tipo</p>
            <p class="text-sm font-medium text-gray-900">{{ suscripcionActual.tipo }}</p>
          </div>

          <div v-if="suscripcionActual">
            <p class="text-xs text-gray-500 mb-1">Monto</p>
            <p class="text-sm font-medium text-gray-900">
              {{ formatMoney(suscripcionActual.monto) }} / {{ suscripcionActual.tipo === 'mensual' ? 'mes' : 'año' }}
            </p>
          </div>

          <div v-if="suscripcionActual && suscripcionActual.es_trial" class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-xs font-medium text-yellow-800">
              <i class="fas fa-clock mr-1"></i>
              Trial - Vence {{ formatDate(suscripcionActual.fecha_fin) }}
            </p>
          </div>
        </div>

        <div v-else class="text-center text-gray-400 py-4">
          <i class="fas fa-inbox text-3xl mb-2"></i>
          <p class="text-sm">Sin plan asignado</p>
        </div>
      </div>

      <!-- Datos Fiscales -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fas fa-file-invoice text-green-600 mr-2"></i>
          Datos Fiscales
        </h3>

        <div class="space-y-3">
          <div>
            <p class="text-xs text-gray-500 mb-1">RUT</p>
            <p class="text-sm font-medium text-gray-900">{{ clinica.rut || '-' }}</p>
          </div>

          <div>
            <p class="text-xs text-gray-500 mb-1">Razón Social</p>
            <p class="text-sm font-medium text-gray-900">{{ clinica.razon_social || '-' }}</p>
          </div>
        </div>
      </div>

    </div>

    <!-- Uso de Recursos -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        <i class="fas fa-chart-bar text-blue-600 mr-2"></i>
        Uso de Recursos
      </h3>

      <div v-if="uso" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600 mb-1">
            {{ uso.pacientes || 0 }}
          </div>
          <p class="text-sm text-gray-500">Pacientes</p>
          <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-blue-600 transition-all"
              :style="{ width: calcularPorcentaje(uso.pacientes, clinica.plan?.max_pacientes) + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-400 mt-1">
            {{ clinica.plan?.max_pacientes ? `de ${clinica.plan.max_pacientes}` : 'Ilimitado' }}
          </p>
        </div>

        <div class="text-center">
          <div class="text-3xl font-bold text-green-600 mb-1">
            {{ uso.citas_mes || 0 }}
          </div>
          <p class="text-sm text-gray-500">Citas este mes</p>
          <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-green-600 transition-all" style="width: 100%"></div>
          </div>
          <p class="text-xs text-gray-400 mt-1">Ilimitado</p>
        </div>

        <div class="text-center">
          <div class="text-3xl font-bold text-purple-600 mb-1">
            {{ uso.profesionales || 0 }}
          </div>
          <p class="text-sm text-gray-500">Profesionales</p>
          <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-purple-600 transition-all"
              :style="{ width: calcularPorcentaje(uso.profesionales, clinica.plan?.max_profesionales) + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-400 mt-1">
            {{ clinica.plan?.max_profesionales ? `de ${clinica.plan.max_profesionales}` : 'Ilimitado' }}
          </p>
        </div>

        <div class="text-center">
          <div class="text-3xl font-bold text-orange-600 mb-1">
            {{ formatBytes(uso.almacenamiento || 0) }}
          </div>
          <p class="text-sm text-gray-500">Almacenamiento</p>
          <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-orange-600 transition-all"
              :style="{ width: calcularPorcentaje(uso.almacenamiento, (clinica.plan?.max_almacenamiento || 0) * 1024 * 1024 * 1024) + '%' }"
            ></div>
          </div>
          <p class="text-xs text-gray-400 mt-1">
            {{ clinica.plan?.max_almacenamiento ? `de ${clinica.plan.max_almacenamiento}GB` : 'Ilimitado' }}
          </p>
        </div>

      </div>

      <div v-else class="text-center text-gray-400 py-8">
        <i class="fas fa-spinner fa-spin text-2xl"></i>
      </div>
    </div>

    <!-- Acciones -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        <i class="fas fa-cog text-gray-600 mr-2"></i>
        Acciones
      </h3>

      <div class="flex flex-wrap gap-3">
        <button
          v-if="clinica.estado === 'activa'"
          @click="confirmarSuspender"
          class="px-4 py-2 text-orange-700 bg-orange-50 border border-orange-300 rounded-lg hover:bg-orange-100 transition"
        >
          <i class="fas fa-pause-circle mr-2"></i>
          Suspender Clínica
        </button>

        <button
          v-if="clinica.estado === 'suspendida'"
          @click="confirmarActivar"
          class="px-4 py-2 text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition"
        >
          <i class="fas fa-play-circle mr-2"></i>
          Activar Clínica
        </button>

        <button
          @click="editarClinica"
          class="px-4 py-2 text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition"
        >
          <i class="fas fa-edit mr-2"></i>
          Editar Información
        </button>

        <button
          @click="verSuscripcion"
          class="px-4 py-2 text-purple-700 bg-purple-50 border border-purple-300 rounded-lg hover:bg-purple-100 transition"
        >
          <i class="fas fa-credit-card mr-2"></i>
          Gestionar Suscripción
        </button>

        <button
          @click="confirmarEliminar"
          class="px-4 py-2 text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition"
        >
          <i class="fas fa-trash mr-2"></i>
          Eliminar Clínica
        </button>
      </div>
    </div>

    <!-- Modales -->
    <ClinicaFormModal
      v-if="modalEditar"
      :clinica="clinica"
      @close="modalEditar = false"
      @saved="handleClinicaActualizada"
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

  <div v-else class="text-center py-12">
    <i class="fas fa-exclamation-circle text-6xl text-gray-300 mb-4"></i>
    <p class="text-lg text-gray-500">Clínica no encontrada</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSuperAdminClinicasStore } from '@superadmin/stores/clinicas'
import { clinicasService } from '@superadmin/services'
import ClinicaFormModal from '@superadmin/components/ClinicaFormModal.vue'
import ConfirmModal from '@superadmin/components/ConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const clinicasStore = useSuperAdminClinicasStore()

const clinica = ref(null)
const uso = ref(null)
const suscripcionActual = ref(null)
const loading = ref(false)
const modalEditar = ref(false)

const modalConfirm = ref({
  show: false,
  title: '',
  message: '',
  type: 'danger',
  onConfirm: null
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
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

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function calcularPorcentaje(usado, limite) {
  if (!limite || limite === 0) return 100
  return Math.min((usado / limite) * 100, 100)
}

async function cargarDatos() {
  loading.value = true
  const id = route.params.id

  try {
    // Cargar clínica
    const result = await clinicasStore.fetchClinica(id)
    if (result.success) {
      clinica.value = result.data

      // Cargar uso de recursos
      const usoRes = await clinicasService.getUso(id)
      if (usoRes.success) {
        uso.value = usoRes.data
      }

      // Suscripción actual
      if (clinica.value.suscripcion_actual) {
        suscripcionActual.value = clinica.value.suscripcion_actual
      }
    }
  } catch (error) {
    console.error('Error loading clinica:', error)
  } finally {
    loading.value = false
  }
}

function editarClinica() {
  modalEditar.value = true
}

function verSuscripcion() {
  router.push('/superadmin/suscripciones?clinica=' + clinica.value.id)
}

function confirmarSuspender() {
  modalConfirm.value = {
    show: true,
    title: 'Suspender Clínica',
    message: `¿Estás seguro de suspender "${clinica.value.nombre}"? La clínica no podrá acceder al sistema.`,
    type: 'warning',
    onConfirm: async () => {
      const motivo = prompt('Motivo de suspensión (opcional):')
      const result = await clinicasStore.suspenderClinica(clinica.value.id, motivo || '')
      
      if (result.success) {
        clinica.value.estado = 'suspendida'
        alert('Clínica suspendida exitosamente')
      } else {
        alert(result.message || 'Error al suspender clínica')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function confirmarActivar() {
  modalConfirm.value = {
    show: true,
    title: 'Activar Clínica',
    message: `¿Estás seguro de activar "${clinica.value.nombre}"?`,
    type: 'success',
    onConfirm: async () => {
      const result = await clinicasStore.activarClinica(clinica.value.id)
      
      if (result.success) {
        clinica.value.estado = 'activa'
        alert('Clínica activada exitosamente')
      } else {
        alert(result.message || 'Error al activar clínica')
      }
      
      modalConfirm.value.show = false
    }
  }
}

function confirmarEliminar() {
  modalConfirm.value = {
    show: true,
    title: 'Eliminar Clínica',
    message: `¿Estás seguro de eliminar "${clinica.value.nombre}"? Esta acción no se puede deshacer y eliminará todos los datos asociados.`,
    type: 'danger',
    onConfirm: async () => {
      const result = await clinicasStore.eliminarClinica(clinica.value.id)
      
      if (result.success) {
        alert('Clínica eliminada exitosamente')
        router.push('/superadmin/clinicas')
      } else {
        alert(result.message || 'Error al eliminar clínica')
      }
      
      modalConfirm.value.show = false
    }
  }
}

async function handleClinicaActualizada() {
  modalEditar.value = false
  await cargarDatos()
}

onMounted(() => {
  cargarDatos()
})
</script>