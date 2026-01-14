<!-- components/citas/CitaViewModal.vue - VERSIÓN FINAL -->
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
      v-if="modelValue && cita"
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
      v-if="modelValue && cita"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
          
          <!-- Header -->
          <div 
            class="px-6 py-6 rounded-t-xl"
            :style="{ background: `linear-gradient(135deg, ${getEstadoColor(cita.estado)} 0%, ${getEstadoColor(cita.estado)}dd 100%)` }"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl">
                  <i class="fas fa-calendar-check" :style="{ color: getEstadoColor(cita.estado) }"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">
                    Cita #{{ cita.id }}
                  </h3>
                  <p class="text-white text-opacity-90 mt-1">
                    {{ formatFecha(cita.fecha) }} a las {{ cita.hora }}
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
                class="px-4 py-2 rounded-full text-sm font-medium text-white"
                :style="{ backgroundColor: getEstadoColor(cita.estado) }"
              >
                <i :class="getEstadoIcon(cita.estado)" class="mr-2"></i>
                {{ getEstadoLabel(cita.estado) }}
              </span>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <!-- Paciente -->
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  <i class="fas fa-user text-blue-600 mr-2"></i>
                  Paciente
                </label>
                <p class="text-lg font-semibold text-gray-900">
                  {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}
                </p>
                <p class="text-sm text-gray-600 mt-1">
                  {{ cita.paciente?.rut }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ cita.paciente?.telefono }}
                </p>
              </div>

              <!-- Profesional -->
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  <i class="fas fa-user-md text-blue-600 mr-2"></i>
                  Profesional
                </label>
                <p class="text-lg font-semibold text-gray-900">
                  {{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ cita.profesional?.especialidad }}
                </p>
              </div>

              <!-- Tratamiento -->
              <div v-if="cita.tratamiento" class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  <i class="fas fa-tooth text-blue-600 mr-2"></i>
                  Tratamiento
                </label>
                <p class="text-lg font-semibold text-gray-900">{{ cita.tratamiento?.nombre }}</p>
                <p class="text-sm text-gray-600">{{ formatPrice(cita.tratamiento?.precio) }}</p>
              </div>

              <!-- Duración y Motivo -->
              <div class="bg-gray-50 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-500 mb-2">
                  <i class="fas fa-clock text-blue-600 mr-2"></i>
                  Duración / Motivo
                </label>
                <p class="text-sm text-gray-900">{{ cita.duracion || 30 }} minutos</p>
                <p class="text-sm text-gray-600 mt-1">{{ cita.motivo || 'No especificado' }}</p>
              </div>

              <!-- Notas -->
              <div v-if="cita.notas" class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-sticky-note text-blue-600 mr-2"></i>
                  Notas
                </label>
                <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ cita.notas }}</p>
              </div>

              <!-- Fechas de creación/actualización -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-calendar-plus text-blue-600 mr-2"></i>
                  Creada
                </label>
                <p class="text-sm text-gray-900">{{ formatDateTime(cita.created_at) }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-edit text-blue-600 mr-2"></i>
                  Última actualización
                </label>
                <p class="text-sm text-gray-900">{{ formatDateTime(cita.updated_at) }}</p>
              </div>

            </div>

            <!-- Cambiar Estado -->
            <div v-if="cita.estado !== 'completada' && cita.estado !== 'cancelada'" 
                 class="border-t border-gray-200 pt-6 mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Cambiar Estado:
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="estado in estadosDisponibles"
                  :key="estado.value"
                  @click="handleCambiarEstado(estado.value)"
                  class="px-4 py-2 rounded-lg text-white hover:opacity-90 transition"
                  :style="{ backgroundColor: estado.color }"
                >
                  <i :class="estado.icon" class="mr-2"></i>
                  {{ estado.label }}
                </button>
              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-between border-t border-gray-200">
            <button
              v-if="cita.estado !== 'completada' && cita.estado !== 'cancelada'"
              @click="handleCancelar"
              class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <i class="fas fa-times-circle mr-2"></i>
              Cancelar Cita
            </button>
            <div v-else></div>
            
            <div class="flex items-center gap-3">
              <button
                @click="handleClose"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition"
              >
                Cerrar
              </button>
              <button
                v-if="cita.estado !== 'completada'"
                @click="handleEdit"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <i class="fas fa-edit mr-2"></i>
                Editar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useCitasStore } from '../stores/citas'

const citasStore = useCitasStore()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  cita: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'edit', 'estado-changed', 'cancelar'])

// Computed
const estadosDisponibles = computed(() => {
  if (!props.cita) return []
  
  const estado = props.cita.estado
  
  // Estados disponibles según el estado actual (usando nombres del backend)
  if (estado === 'programada') {
    return citasStore.estados.filter(e => ['confirmada', 'en_atencion', 'no_asistio'].includes(e.value))
  } else if (estado === 'confirmada') {
    return citasStore.estados.filter(e => ['en_atencion', 'completada', 'no_asistio'].includes(e.value))
  } else if (estado === 'en_atencion') {
    return citasStore.estados.filter(e => ['completada'].includes(e.value))
  }
  
  return []
})

// Methods
function handleClose() {
  emit('update:modelValue', false)
}

function handleEdit() {
  emit('edit', props.cita)
}

function handleCambiarEstado(nuevoEstado) {
  emit('estado-changed', { cita: props.cita, nuevoEstado })
}

function handleCancelar() {
  emit('cancelar', props.cita)
}

function getEstadoColor(estado) {
  const estadoObj = citasStore.estados.find(e => e.value === estado)
  return estadoObj ? estadoObj.color : '#6B7280'
}

function getEstadoLabel(estado) {
  const estadoObj = citasStore.estados.find(e => e.value === estado)
  return estadoObj ? estadoObj.label : estado
}

function getEstadoIcon(estado) {
  const icons = {
    'programada': 'fas fa-clock',
    'confirmada': 'fas fa-check-circle',
    'en_atencion': 'fas fa-hourglass-half',
    'completada': 'fas fa-check-double',
    'cancelada': 'fas fa-times-circle',
    'no_asistio': 'fas fa-user-slash'
  }
  return icons[estado] || 'fas fa-calendar'
}

function formatFecha(fecha) {
  if (!fecha) return '-'
  
  // Limpiar timestamp de Laravel: "2025-12-29T00:00:00.000000Z" → "2025-12-29"
  const fechaLimpia = fecha.split('T')[0]
  
  const d = new Date(fechaLimpia + 'T00:00:00')
  
  // Verificar fecha válida
  if (isNaN(d.getTime())) {
    console.warn('⚠️ Fecha inválida en modal:', fecha)
    return fecha // Mostrar fecha original si falla
  }
  
  const opciones = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
  return d.toLocaleDateString('es-ES', opciones)
}

function formatDateTime(dateTime) {
  if (!dateTime) return '-'
  
  const d = new Date(dateTime)
  
  // Verificar fecha válida
  if (isNaN(d.getTime())) {
    console.warn('⚠️ DateTime inválido en modal:', dateTime)
    return dateTime
  }
  
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatPrice(price) {
  if (!price) return '-'
  return '$' + new Intl.NumberFormat('es-CL').format(price)
}
</script>