<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <router-link
          to="/paciente/citas"
          class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Volver a Mis Citas
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900">Detalle de Cita</h1>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
    </div>

    <!-- Contenido -->
    <div v-else-if="cita" class="bg-white rounded-lg shadow-sm p-6">
      <div class="space-y-4">
        <div>
          <h3 class="text-sm text-gray-600">Fecha</h3>
          <p class="text-lg font-semibold">{{ formatFecha(cita.fecha) }}</p>
        </div>
        <div>
          <h3 class="text-sm text-gray-600">Hora</h3>
          <p class="text-lg font-semibold">{{ cita.hora }}</p>
        </div>
        <div>
          <h3 class="text-sm text-gray-600">Profesional</h3>
          <p class="text-lg font-semibold">{{ cita.profesional?.nombre }}</p>
        </div>
        <div>
          <h3 class="text-sm text-gray-600">Estado</h3>
          <span :class="getEstadoClass(cita.estado)">
            {{ cita.estado }}
          </span>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600">No se encontró la cita</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { citasService } from '../services'

const route = useRoute()
const props = defineProps({
  id: [String, Number]
})

const loading = ref(false)
const cita = ref(null)

function formatFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getEstadoClass(estado) {
  const classes = {
    confirmada: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
    pendiente: 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm',
    cancelada: 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm',
    completada: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm'
}

async function cargarCita() {
  loading.value = true
  try {
    const response = await citasService.getMisCitas()
    if (response.success) {
      const citas = response.data?.data || response.data || []
      cita.value = citas.find(c => c.id == props.id || c.id == route.params.id)
    }
  } catch (error) {
    console.error('Error cargar cita:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarCita()
})
</script>
