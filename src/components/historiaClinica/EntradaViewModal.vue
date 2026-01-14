<!-- components/historiaClinica/EntradaViewModal.vue -->
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
      v-if="modelValue && entrada"
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
      v-if="modelValue && entrada"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleClose"
    >
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl sticky top-0 z-10">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <span class="px-3 py-1 rounded text-sm font-medium text-white bg-white bg-opacity-20">
                    {{ getTipoLabel(entrada.tipo) }}
                  </span>
                  <span class="text-blue-100 text-sm">
                    {{ formatDate(entrada.fecha_consulta) }}
                  </span>
                </div>
                <h3 class="text-xl font-bold text-white">
                  {{ entrada.titulo || getTipoLabel(entrada.tipo) }}
                </h3>
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
          <div class="p-6 space-y-6">
            
            <!-- Info Principal -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Profesional -->
              <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <i class="fas fa-user-md text-white"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Profesional</p>
                  <p class="font-semibold text-gray-900">
                    {{ entrada.profesional?.nombre }} {{ entrada.profesional?.apellido }}
                  </p>
                  <p v-if="entrada.profesional?.especialidad" class="text-sm text-gray-600">
                    {{ entrada.profesional.especialidad }}
                  </p>
                </div>
              </div>

              <!-- Tratamiento -->
              <div v-if="entrada.tratamiento" class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div class="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <i class="fas fa-tooth text-white"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-600 mb-1">Tratamiento</p>
                  <p class="font-semibold text-gray-900">
                    {{ entrada.tratamiento.nombre }}
                  </p>
                  <p v-if="entrada.tratamiento.categoria" class="text-sm text-gray-600">
                    {{ entrada.tratamiento.categoria.nombre }}
                  </p>
                </div>
              </div>

            </div>

            <!-- Dientes Relacionados -->
            <div v-if="entrada.dientes_relacionados?.length" class="p-4 bg-purple-50 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <i class="fas fa-tooth text-purple-600"></i>
                <p class="font-semibold text-gray-900">Piezas Dentales Tratadas</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="diente in entrada.dientes_relacionados"
                  :key="diente"
                  class="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium"
                >
                  {{ diente }}
                </span>
              </div>
            </div>

            <!-- Diagnóstico -->
            <div v-if="entrada.diagnostico">
              <div class="flex items-center gap-2 mb-2">
                <i class="fas fa-stethoscope text-blue-600"></i>
                <h4 class="font-semibold text-gray-900">Diagnóstico / Motivo</h4>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700 whitespace-pre-wrap">{{ entrada.diagnostico }}</p>
              </div>
            </div>

            <!-- Tratamiento Realizado -->
            <div v-if="entrada.tratamiento_realizado">
              <div class="flex items-center gap-2 mb-2">
                <i class="fas fa-file-medical text-green-600"></i>
                <h4 class="font-semibold text-gray-900">Procedimiento Realizado</h4>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700 whitespace-pre-wrap">{{ entrada.tratamiento_realizado }}</p>
              </div>
            </div>

            <!-- Observaciones -->
            <div v-if="entrada.observaciones">
              <div class="flex items-center gap-2 mb-2">
                <i class="fas fa-clipboard text-yellow-600"></i>
                <h4 class="font-semibold text-gray-900">Observaciones</h4>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700 whitespace-pre-wrap">{{ entrada.observaciones }}</p>
              </div>
            </div>

            <!-- Costo -->
            <div v-if="entrada.costo" class="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <div class="flex-shrink-0 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <i class="fas fa-dollar-sign text-white"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">Costo del Procedimiento</p>
                <p class="text-2xl font-bold text-orange-600">
                  ${{ parseFloat(entrada.costo).toLocaleString() }}
                </p>
              </div>
            </div>

            <!-- Próxima Cita -->
            <div v-if="entrada.proxima_cita" class="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
              <div class="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <i class="fas fa-calendar-plus text-white"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">Próxima Cita Sugerida</p>
                <p class="font-semibold text-gray-900">
                  {{ formatDate(entrada.proxima_cita) }}
                </p>
              </div>
            </div>

            <!-- Metadata -->
            <div class="pt-4 border-t border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <i class="fas fa-user mr-2"></i>
                  Registrado por: <span class="font-medium text-gray-900">{{ entrada.creado_por?.nombre || 'Sistema' }}</span>
                </div>
                <div>
                  <i class="fas fa-clock mr-2"></i>
                  Fecha de registro: <span class="font-medium text-gray-900">{{ formatDateTime(entrada.created_at) }}</span>
                </div>
                <div v-if="entrada.updated_at !== entrada.created_at">
                  <i class="fas fa-edit mr-2"></i>
                  Última actualización: <span class="font-medium text-gray-900">{{ formatDateTime(entrada.updated_at) }}</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer con Actions -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex items-center justify-between">
            <button
              @click="handleDelete"
              class="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <i class="fas fa-trash mr-2"></i>
              Eliminar
            </button>
            <div class="flex items-center gap-3">
              <button
                @click="handleClose"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cerrar
              </button>
              <button
                @click="handleEdit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
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
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  entrada: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'edit', 'delete'])

function handleClose() {
  emit('update:modelValue', false)
}

function handleEdit() {
  emit('edit', props.entrada)
}

function handleDelete() {
  emit('delete', props.entrada)
}

function getTipoLabel(tipo) {
  const labels = {
    consulta: 'Consulta',
    diagnostico: 'Diagnóstico',
    tratamiento: 'Tratamiento',
    control: 'Control',
    emergencia: 'Emergencia'
  }
  return labels[tipo] || tipo
}

function formatDate(date) {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    weekday: 'long'
  })
}

function formatDateTime(dateTime) {
  if (!dateTime) return '-'
  const d = new Date(dateTime)
  return d.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>