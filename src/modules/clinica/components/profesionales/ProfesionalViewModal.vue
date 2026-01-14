<!-- components/profesionales/ProfesionalViewModal.vue -->
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
      v-if="modelValue && profesional"
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
      v-if="modelValue && profesional"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl">
          
          <!-- Header con color del profesional -->
          <div 
            class="px-6 py-6 rounded-t-xl"
            :style="{ background: `linear-gradient(135deg, ${profesional.color_agenda || '#3B82F6'} 0%, ${profesional.color_agenda || '#3B82F6'}dd 100%)` }"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold"
                     :style="{ color: profesional.color_agenda || '#3B82F6' }">
                  {{ getInitials() }}
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">
                    Dr. {{ profesional.nombre }} {{ profesional.apellido }}
                  </h3>
                  <p class="text-white text-opacity-90 mt-1">
                    {{ profesional.especialidad || 'Odontología General' }}
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
                :style="{ backgroundColor: getEstadoColor(profesional.estado) }"
              >
                <i :class="getEstadoIcon(profesional.estado)" class="mr-2"></i>
                {{ getEstadoLabel(profesional.estado) }}
              </span>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              <!-- RUT -->
              <div v-if="profesional.rut">
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-id-card text-blue-600 mr-2"></i>
                  RUT
                </label>
                <p class="text-gray-900">{{ profesional.rut }}</p>
              </div>

              <!-- Email -->
              <div v-if="profesional.email">
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-envelope text-blue-600 mr-2"></i>
                  Email
                </label>
                <p class="text-gray-900">{{ profesional.email }}</p>
              </div>

              <!-- Teléfono -->
              <div v-if="profesional.telefono">
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-phone text-blue-600 mr-2"></i>
                  Teléfono
                </label>
                <p class="text-gray-900">{{ profesional.telefono }}</p>
              </div>

              <!-- Registro Profesional -->
              <div v-if="profesional.registro_profesional">
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-certificate text-blue-600 mr-2"></i>
                  Registro Profesional
                </label>
                <p class="text-gray-900">{{ profesional.registro_profesional }}</p>
              </div>

              <!-- Duración Cita Default -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-clock text-blue-600 mr-2"></i>
                  Duración de Cita
                </label>
                <p class="text-gray-900">{{ profesional.duracion_cita_default || 30 }} minutos</p>
              </div>

              <!-- Color Agenda -->
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  <i class="fas fa-palette text-blue-600 mr-2"></i>
                  Color en Agenda
                </label>
                <div class="flex items-center gap-2">
                  <div 
                    class="w-8 h-8 rounded-lg border-2 border-gray-300"
                    :style="{ backgroundColor: profesional.color_agenda || '#3B82F6' }"
                  ></div>
                  <p class="text-gray-900">{{ profesional.color_agenda || '#3B82F6' }}</p>
                </div>
              </div>

            </div>

            <!-- Horarios de Atención -->
            <div class="border-t border-gray-200 pt-6 mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-calendar-alt text-blue-600 mr-2"></i>
                Horarios de Atención
              </h4>

              <div v-if="horariosPorDia.length > 0" class="space-y-2">
                <div
                  v-for="horario in horariosPorDia"
                  :key="horario.dia_semana"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-24 font-medium text-gray-700">
                      {{ getDiaNombre(horario.dia_semana) }}
                    </div>
                    <div class="text-gray-600">
                      {{ horario.hora_inicio }} - {{ horario.hora_fin }}
                    </div>
                  </div>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      horario.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ horario.estado === 'activo' ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>

              <div v-else class="text-center py-6 text-gray-500">
                <i class="fas fa-calendar-times text-3xl mb-2"></i>
                <p>No hay horarios configurados</p>
              </div>
            </div>

            <!-- Estadísticas (si están disponibles) -->
            <div v-if="stats" class="border-t border-gray-200 pt-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-chart-line text-blue-600 mr-2"></i>
                Estadísticas
              </h4>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div class="bg-blue-50 rounded-lg p-4 text-center">
                  <div class="text-blue-600 mb-2">
                    <i class="fas fa-calendar-check text-2xl"></i>
                  </div>
                  <p class="text-2xl font-bold text-blue-900">{{ stats.citas_totales || 0 }}</p>
                  <p class="text-xs text-blue-700 mt-1">Citas Totales</p>
                </div>

                <div class="bg-green-50 rounded-lg p-4 text-center">
                  <div class="text-green-600 mb-2">
                    <i class="fas fa-calendar-day text-2xl"></i>
                  </div>
                  <p class="text-2xl font-bold text-green-900">{{ stats.citas_mes_actual || 0 }}</p>
                  <p class="text-xs text-green-700 mt-1">Este Mes</p>
                </div>

                <div class="bg-purple-50 rounded-lg p-4 text-center">
                  <div class="text-purple-600 mb-2">
                    <i class="fas fa-users text-2xl"></i>
                  </div>
                  <p class="text-2xl font-bold text-purple-900">{{ stats.pacientes_atendidos || 0 }}</p>
                  <p class="text-xs text-purple-700 mt-1">Pacientes</p>
                </div>

                <div class="bg-orange-50 rounded-lg p-4 text-center">
                  <div class="text-orange-600 mb-2">
                    <i class="fas fa-clock text-2xl"></i>
                  </div>
                  <p class="text-2xl font-bold text-orange-900">{{ stats.proximas_citas || 0 }}</p>
                  <p class="text-xs text-orange-700 mt-1">Próximas</p>
                </div>

              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-between border-t border-gray-200">
            <button
              v-if="profesional.estado === 'activo'"
              @click="handleCambiarEstado('inactivo')"
              class="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <i class="fas fa-pause-circle mr-2"></i>
              Inactivar
            </button>
            <button
              v-else-if="profesional.estado === 'inactivo'"
              @click="handleCambiarEstado('activo')"
              class="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition"
            >
              <i class="fas fa-play-circle mr-2"></i>
              Activar
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
import { ref, computed, watch } from 'vue'
import { useProfesionalesStore } from '../stores/profesionales'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  profesional: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'edit', 'estado-changed'])

const profesionalesStore = useProfesionalesStore()
const stats = ref(null)

// Computed
const horariosPorDia = computed(() => {
  if (!props.profesional?.horarios) return []
  
  return props.profesional.horarios
    .filter(h => h.estado === 'activo')
    .sort((a, b) => a.dia_semana - b.dia_semana)
})

// Methods
function getInitials() {
  if (!props.profesional) return '?'
  const n = props.profesional.nombre?.[0] || ''
  const a = props.profesional.apellido?.[0] || ''
  return (n + a).toUpperCase() || '?'
}

function getDiaNombre(dia) {
  const dias = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado'
  }
  return dias[dia] || ''
}

function getEstadoColor(estado) {
  const estadoObj = profesionalesStore.ESTADOS.find(e => e.value === estado)
  return estadoObj ? estadoObj.color : '#6B7280'
}

function getEstadoLabel(estado) {
  const estadoObj = profesionalesStore.ESTADOS.find(e => e.value === estado)
  return estadoObj ? estadoObj.label : estado
}

function getEstadoIcon(estado) {
  const estadoObj = profesionalesStore.ESTADOS.find(e => e.value === estado)
  return estadoObj ? estadoObj.icon : 'fas fa-circle'
}

function handleClose() {
  emit('update:modelValue', false)
}

function handleEdit() {
  emit('edit', props.profesional)
}

function handleCambiarEstado(nuevoEstado) {
  emit('estado-changed', { profesional: props.profesional, nuevoEstado })
}

// Watch para cargar estadísticas cuando se abre el modal
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen && props.profesional) {
    try {
      const response = await profesionalesStore.getEstadisticas(props.profesional.id)
      if (response.success) {
        stats.value = response.data
      }
    } catch (error) {
      console.log('No hay estadísticas disponibles')
      stats.value = null
    }
  }
})
</script>