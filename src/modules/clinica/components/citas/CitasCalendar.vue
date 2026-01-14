<!-- components/citas/CitasCalendarSimple.vue -->
<!-- VERSIÓN SIMPLIFICADA SIN FULLCALENDAR - PLAN B -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    
    <div class="text-center py-12">
      <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-calendar-alt text-4xl text-blue-600"></i>
      </div>
      
      <h3 class="text-xl font-bold text-gray-800 mb-2">
        Calendario Simplificado (Plan B)
      </h3>
      
      <p class="text-gray-600 mb-6">
        Vista temporal mientras se soluciona el problema del calendario completo
      </p>

      <div class="max-w-2xl mx-auto">
        
        <!-- Lista de Citas del Día -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 class="font-semibold text-gray-700 mb-3">
            Citas de Hoy ({{ citasHoy.length }})
          </h4>
          
          <div v-if="citasHoy.length === 0" class="text-gray-500 text-sm">
            No hay citas programadas para hoy
          </div>
          
          <div v-else class="space-y-2">
            <div 
              v-for="cita in citasHoy" 
              :key="cita.id"
              class="bg-white p-3 rounded border-l-4 cursor-pointer hover:bg-gray-50"
              :style="{ borderColor: getEstadoColor(cita.estado) }"
              @click="$emit('event-click', cita)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">
                    {{ cita.hora }} - {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ cita.tratamiento?.nombre }}
                  </p>
                </div>
                <span 
                  class="px-2 py-1 rounded text-xs text-white"
                  :style="{ backgroundColor: getEstadoColor(cita.estado) }"
                >
                  {{ getEstadoLabel(cita.estado) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Todas las Citas -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-700 mb-3">
            Todas las Citas ({{ citasStore.citas.length }})
          </h4>
          
          <div v-if="citasStore.loading" class="text-center py-4">
            <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
          </div>
          
          <div v-else-if="citasStore.citas.length === 0" class="text-gray-500 text-sm">
            No hay citas programadas
          </div>
          
          <div v-else class="space-y-2 max-h-96 overflow-y-auto">
            <div 
              v-for="cita in citasStore.citas" 
              :key="cita.id"
              class="bg-white p-3 rounded border-l-4 cursor-pointer hover:bg-gray-50"
              :style="{ borderColor: getEstadoColor(cita.estado) }"
              @click="$emit('event-click', cita)"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">
                    {{ formatFecha(cita.fecha) }} {{ cita.hora }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ cita.tratamiento?.nombre }}
                  </p>
                </div>
                <span 
                  class="px-2 py-1 rounded text-xs text-white"
                  :style="{ backgroundColor: getEstadoColor(cita.estado) }"
                >
                  {{ getEstadoLabel(cita.estado) }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCitasStore } from '../stores/citas'

const citasStore = useCitasStore()

defineEmits(['event-click'])

// Computed
const citasHoy = computed(() => {
  const hoy = new Date().toISOString().split('T')[0]
  return citasStore.citas
    .filter(cita => cita.fecha === hoy)
    .sort((a, b) => a.hora.localeCompare(b.hora))
})

// Methods
function getEstadoColor(estado) {
  const estadoObj = citasStore.estados.find(e => e.value === estado)
  return estadoObj ? estadoObj.color : '#6B7280'
}

function getEstadoLabel(estado) {
  const estadoObj = citasStore.estados.find(e => e.value === estado)
  return estadoObj ? estadoObj.label : estado
}

function formatFecha(fecha) {
  if (!fecha) return '-'
  const d = new Date(fecha + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
  })
}

// Lifecycle - Cargar citas del mes actual
onMounted(async () => {
  const hoy = new Date()
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
  
  await citasStore.fetchCitas(
    inicio.toISOString().split('T')[0],
    fin.toISOString().split('T')[0]
  )
})
</script>