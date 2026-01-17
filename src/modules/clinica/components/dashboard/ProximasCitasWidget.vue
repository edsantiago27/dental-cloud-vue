<!-- components/dashboard/ProximasCitasWidget.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">
        <i class="fas fa-calendar-day text-blue-600 mr-2"></i>
        Próximas Citas
      </h3>
      <router-link 
        to="/citas"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Ver todas →
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
    </div>

    <!-- Lista de citas -->
    <div v-else-if="citas.length > 0" class="space-y-3">
      <div
        v-for="cita in citas"
        :key="cita.id"
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
        @click="handleViewCita(cita)"
      >
        <!-- Hora -->
        <div class="flex-shrink-0 text-center">
          <div class="text-lg font-bold text-gray-900">
            {{ formatHora(cita.hora) }}
          </div>
          <div class="text-xs text-gray-500">
            {{ formatFechaCorta(cita.fecha) }}
          </div>
        </div>

        <!-- Separador -->
        <div class="w-px h-12 bg-gray-300"></div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="font-medium text-gray-900 truncate">
            {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}
          </p>
          <p class="text-sm text-gray-600 truncate">
            {{ cita.tratamiento?.nombre || 'Consulta general' }}
          </p>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs text-gray-500">
              Dr. {{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}
            </span>
          </div>
        </div>

        <!-- Estado -->
        <div class="flex-shrink-0">
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              getEstadoClass(cita.estado)
            ]"
          >
            {{ getEstadoLabel(cita.estado) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <i class="fas fa-calendar-check text-4xl text-gray-300 mb-2"></i>
      <p class="text-gray-500">No hay citas próximas</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  citas: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['view-cita'])
const router = useRouter()

function formatHora(hora) {
  if (!hora) return '--:--'
  return hora.substring(0, 5) // "09:00:00" -> "09:00"
}

function formatFechaCorta(fecha) {
  if (!fecha) return ''
  
  const d = new Date(fecha)
  const hoy = new Date()
  const manana = new Date(hoy)
  manana.setDate(hoy.getDate() + 1)
  
  // Si es hoy
  if (d.toDateString() === hoy.toDateString()) {
    return 'Hoy'
  }
  
  // Si es mañana
  if (d.toDateString() === manana.toDateString()) {
    return 'Mañana'
  }
  
  // Día de la semana
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })
}

function getEstadoClass(estado) {
  const classes = {
    'programada': 'bg-orange-100 text-orange-800',
    'confirmada': 'bg-green-100 text-green-800',
    'en_atencion': 'bg-blue-100 text-blue-800',
    'completada': 'bg-purple-100 text-purple-800',
    'cancelada': 'bg-red-100 text-red-800',
    'no_asistio': 'bg-gray-100 text-gray-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

function getEstadoLabel(estado) {
  const labels = {
    'programada': 'Programada',
    'confirmada': 'Confirmada',
    'en_atencion': 'En Atención',
    'completada': 'Completada',
    'cancelada': 'Cancelada',
    'no_asistio': 'No Asistió'
  }
  return labels[estado] || estado
}

function handleViewCita(cita) {
  emit('view-cita', cita)
  // O navegar a citas
  // router.push('/citas')
}
</script>