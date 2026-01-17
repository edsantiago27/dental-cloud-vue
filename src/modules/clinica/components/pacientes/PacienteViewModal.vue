<!-- components/pacientes/PacienteViewModal.vue - CON BOTÓN AGENDAR -->
<template>
  <!-- Backdrop -->
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue && paciente"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="handleClose"
    ></div>
  </transition>

  <!-- Modal -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="modelValue && paciente"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 rounded-t-xl">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                  {{ getInitials() }}
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">
                    {{ paciente.nombre }} {{ paciente.apellido }}
                  </h3>
                  <p class="text-blue-100 mt-1">
                    {{ calculateAge() }} años • {{ paciente.rut }}
                  </p>
                </div>
              </div>
              <button
                @click="handleClose"
                class="text-white hover:text-gray-200 transition"
              >
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            
            <!-- Estado -->
            <div class="mb-6">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  paciente.estado === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                <i :class="paciente.estado === 'activo' ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="mr-1"></i>
                {{ paciente.estado === 'activo' ? 'Activo' : 'Inactivo' }}
              </span>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-envelope text-blue-600 mr-2"></i>
                  Email
                </label>
                <p class="text-gray-900">{{ paciente.email || '-' }}</p>
              </div>

              <!-- Teléfono -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-phone text-blue-600 mr-2"></i>
                  Teléfono
                </label>
                <p class="text-gray-900">{{ paciente.telefono || '-' }}</p>
              </div>

              <!-- Fecha de Nacimiento -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-birthday-cake text-blue-600 mr-2"></i>
                  Fecha de Nacimiento
                </label>
                <p class="text-gray-900">{{ formatDate(paciente.fecha_nacimiento) }}</p>
              </div>

              <!-- Género -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-venus-mars text-blue-600 mr-2"></i>
                  Género
                </label>
                <p class="text-gray-900">{{ formatGenero(paciente.genero) }}</p>
              </div>

              <!-- Dirección -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-map-marker-alt text-blue-600 mr-2"></i>
                  Dirección
                </label>
                <p class="text-gray-900">{{ paciente.direccion || '-' }}</p>
              </div>

            </div>

            <!-- KPIs Section -->
            <div class="border-t border-gray-200 pt-6 mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-chart-line text-blue-600 mr-2"></i>
                Resumen
              </h4>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <!-- Próximas Citas -->
                <div class="bg-blue-50 rounded-lg p-4 text-center">
                  <div class="text-blue-600 mb-2">
                    <i class="fas fa-calendar-day text-2xl"></i>
                  </div>
                  <p class="text-2xl font-bold text-blue-900">{{ proximasCitas }}</p>
                  <p class="text-xs text-blue-700 mt-1">Próximas citas</p>
                </div>

                <!-- Tratamientos Activos -->
                <div class="bg-green-50 rounded-lg p-4 text-center">
                  <div class="text-green-600 mb-2">
                    <i class="fas fa-tooth text-2xl"></i>
                  </div>
                  <p class="text-2xl font-bold text-green-900">{{ tratamientosActivos }}</p>
                  <p class="text-xs text-green-700 mt-1">Tratamientos activos</p>
                </div>

                <!-- Total Pagado -->
                <div class="bg-purple-50 rounded-lg p-4 text-center">
                  <div class="text-purple-600 mb-2">
                    <i class="fas fa-dollar-sign text-2xl"></i>
                  </div>
                  <p class="text-xl font-bold text-purple-900">{{ formatMonto(totalPagado) }}</p>
                  <p class="text-xs text-purple-700 mt-1">Total pagado</p>
                </div>

                <!-- Saldo Pendiente -->
                <div class="bg-orange-50 rounded-lg p-4 text-center">
                  <div class="text-orange-600 mb-2">
                    <i class="fas fa-exclamation-circle text-2xl"></i>
                  </div>
                  <p class="text-xl font-bold text-orange-900">{{ formatMonto(saldoPendiente) }}</p>
                  <p class="text-xs text-orange-700 mt-1">Por cobrar</p>
                </div>

              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-between border-t border-gray-200">
            
           <!-- Botones Izquierda -->
            <div class="flex items-center gap-3">
              <button
                @click="handleAgendar"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                <i class="fas fa-calendar-plus mr-2"></i>
                Agendar Cita
              </button>
              <button
                @click="handleVerFinanzas"
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                <i class="fas fa-dollar-sign mr-2"></i>
                Ver Finanzas
              </button>
            </div>

            <!-- Botones Derecha -->
            <div class="flex items-center gap-3">
              <button
                @click="handleClose"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition"
              >
                Cerrar
              </button>
              <button
                @click="handleEdit"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                <i class="fas fa-edit mr-2"></i>
                Editar Perfil
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </transition>
  <!-- Modal de Finanzas -->
  <FinanzasPacienteModal
    v-model="showFinanzasModal"
    :paciente="paciente"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFacturacionStore } from '@clinica/stores/facturacion'
import FinanzasPacienteModal from './FinanzasPacienteModal.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  paciente: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'edit', 'agendar', 'ver-finanzas'])

const facturacionStore = useFacturacionStore()

// State
const loading = ref(false)
const cuentasPaciente = ref([])
const showFinanzasModal = ref(false)
// Computed - KPIs
const proximasCitas = computed(() => {
  // TODO: Implementar cuando esté listo el módulo de citas
  return 0
})

const tratamientosActivos = computed(() => {
  // Contar cuentas con tratamiento activo (pendiente o parcial)
  return cuentasPaciente.value.filter(c => 
    c.tratamiento_id && (c.estado === 'pendiente' || c.estado === 'parcial')
  ).length
})

const totalPagado = computed(() => {
  // Sumar todos los pagos del paciente
  return cuentasPaciente.value.reduce((total, cuenta) => {
    return total + parseFloat(cuenta.monto_pagado || 0)
  }, 0)
})

const saldoPendiente = computed(() => {
  // Sumar todos los saldos pendientes
  return cuentasPaciente.value.reduce((total, cuenta) => {
    if (cuenta.estado === 'pendiente' || cuenta.estado === 'parcial') {
      return total + parseFloat(cuenta.saldo || 0)
    }
    return total
  }, 0)
})

// Methods
async function loadCuentasPaciente() {
  if (!props.paciente?.id) return
  
  loading.value = true
  try {
    // Cargar cuentas del paciente
    const response = await facturacionStore.fetchCuentas({ 
      paciente_id: props.paciente.id 
    })
    
    if (response.success) {
      cuentasPaciente.value = response.data.data || response.data || []
      console.log('📊 Cuentas del paciente cargadas:', cuentasPaciente.value.length)
    }
  } catch (error) {
    console.error('Error al cargar cuentas:', error)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  emit('update:modelValue', false)
}

function handleEdit() {
  emit('edit', props.paciente)
}

function handleAgendar() {
  // Emitir evento para abrir modal de crear cita con paciente pre-seleccionado
  emit('agendar', props.paciente)
}
function handleVerFinanzas() {
  showFinanzasModal.value = true
}
function getInitials() {
  if (!props.paciente) return '?'
  const n = props.paciente.nombre?.[0] || ''
  const a = props.paciente.apellido?.[0] || ''
  return (n + a).toUpperCase() || '?'
}

function calculateAge() {
  if (!props.paciente?.fecha_nacimiento) return '-'
  
  const birth = new Date(props.paciente.fecha_nacimiento)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

function formatDate(date) {
  if (!date) return '-'
  
  const d = new Date(date)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return d.toLocaleDateString('es-ES', options)
}

function formatGenero(genero) {
  if (!genero) return '-'
  
  const generos = {
    'masculino': 'Masculino',
    'femenino': 'Femenino',
    'otro': 'Otro'
  }
  
  return generos[genero] || genero
}

function formatMonto(monto) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(monto || 0)
}

// Watch
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.paciente) {
    loadCuentasPaciente()
  }
})
</script>