<!-- components/citas/CitasCalendarSimple.vue -->
<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    
    <!-- Header con Stats -->
    <div class="mb-6 pb-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Citas</h2>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">
            <i class="fas fa-calendar-check text-blue-600 mr-1"></i>
            {{ citasDelMes.length }} citas este mes
          </span>
          <span class="text-sm text-gray-600">
            <i class="fas fa-clock text-yellow-600 mr-1"></i>
            {{ citasPendientes.length }} pendientes
          </span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="citasStore.loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando citas...</p>
    </div>

    <!-- Sin citas -->
    <div v-else-if="citasStore.citas.length === 0" class="text-center py-12">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-calendar-alt text-4xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800 mb-2">No hay citas</h3>
      <p class="text-gray-600">No se encontraron citas para mostrar</p>
    </div>

    <!-- Contenido -->
    <div v-else class="space-y-6">
      
      <!-- Citas de Hoy -->
      <div v-if="citasHoy.length > 0">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-800">
            <i class="fas fa-calendar-day text-blue-600 mr-2"></i>
            Citas de Hoy
          </h3>
          <span class="text-sm text-gray-600">{{ citasHoy.length }} cita{{ citasHoy.length !== 1 ? 's' : '' }}</span>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="cita in citasHoy" 
            :key="cita.id"
            class="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition"
            :style="{ borderColor: getEstadoColor(cita.estado) }"
            @click="handleCitaClick(cita)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg font-bold text-gray-900">{{ formatHora(cita.hora) }}</span>
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium text-white"
                    :style="{ backgroundColor: getEstadoColor(cita.estado) }"
                  >
                    {{ getEstadoLabel(cita.estado) }}
                  </span>
                </div>
                <p class="font-semibold text-gray-900">
                  <i class="fas fa-user text-gray-400 mr-2"></i>
                  {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}
                </p>
                <p class="text-sm text-gray-600 mt-1">
                  <i class="fas fa-tooth text-gray-400 mr-2"></i>
                  {{ cita.tratamiento?.nombre }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  <i class="fas fa-user-md text-gray-400 mr-2"></i>
                  {{ cita.profesional?.nombre }} {{ cita.profesional?.apellido }}
                </p>
              </div>
              <div class="text-right flex flex-col items-end justify-between">
                <p class="text-sm text-gray-600">
                  <i class="fas fa-clock mr-1"></i>
                  {{ cita.duracion_minutos || cita.tratamiento?.duracion_estimada || 30 }} min
                </p>
                <button 
                  @click.stop="emit('reagendar', cita)"
                  class="mt-2 px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
                >
                  <i class="fas fa-calendar-alt"></i>
                  Reagendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Próximas Citas -->
      <div v-if="proximasCitas.length > 0">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-800">
            <i class="fas fa-calendar-alt text-green-600 mr-2"></i>
            Próximas Citas
          </h3>
          <span class="text-sm text-gray-600">{{ proximasCitas.length }} cita{{ proximasCitas.length !== 1 ? 's' : '' }}</span>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="cita in proximasCitas" 
            :key="cita.id"
            class="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer hover:shadow-sm transition"
            @click="handleCitaClick(cita)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-sm font-medium text-gray-700">
                    {{ formatFechaCorta(cita.fecha) }}
                  </span>
                  <span class="text-sm font-semibold text-gray-900">{{ formatHora(cita.hora) }}</span>
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium text-white"
                    :style="{ backgroundColor: getEstadoColor(cita.estado) }"
                  >
                    {{ getEstadoLabel(cita.estado) }}
                  </span>
                </div>
                <p class="font-medium text-gray-900">
                  {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}
                </p>
                <p class="text-sm text-gray-600 mt-1">
                  {{ cita.tratamiento?.nombre }}
                </p>
                <button 
                  @click.stop="emit('reagendar', cita)"
                  class="mt-2 px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
                >
                  <i class="fas fa-calendar-alt"></i>
                  Reagendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Citas Pasadas (últimas 10) -->
      <div v-if="citasPasadas.length > 0">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-800">
            <i class="fas fa-history text-gray-600 mr-2"></i>
            Citas Anteriores
          </h3>
          <span class="text-sm text-gray-600">Últimas {{ Math.min(citasPasadas.length, 10) }}</span>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="cita in citasPasadas.slice(0, 10)" 
            :key="cita.id"
            class="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition"
            @click="handleCitaClick(cita)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs text-gray-600">{{ formatFechaCorta(cita.fecha) }}</span>
                  <span class="text-xs text-gray-900">{{ formatHora(cita.hora) }}</span>
                  <span 
                    class="px-2 py-0.5 rounded text-xs text-white"
                    :style="{ backgroundColor: getEstadoColor(cita.estado) }"
                  >
                    {{ getEstadoLabel(cita.estado) }}
                  </span>
                </div>
                <p class="text-sm font-medium text-gray-900">
                  {{ cita.paciente?.nombre }} {{ cita.paciente?.apellido }}
                </p>
                <p class="text-xs text-gray-600">{{ cita.tratamiento?.nombre }}</p>
              </div>
              <button 
                @click.stop="emit('reagendar', cita)"
                class="px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition"
              >
                Reagendar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Leyenda de Estados -->
    <div class="mt-8 pt-4 border-t border-gray-200">
      <p class="text-sm font-medium text-gray-700 mb-3">Estados:</p>
      <div class="flex flex-wrap gap-4">
        <div v-for="estado in citasStore.estados" :key="estado.value" class="flex items-center gap-2">
          <div 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: estado.color }"
          ></div>
          <span class="text-sm text-gray-700">{{ estado.label }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCitasStore } from '@clinica/stores/citas'

const citasStore = useCitasStore()
const emit = defineEmits(['event-click', 'reagendar'])

// Computed
const citasHoy = computed(() => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyStr = hoy.toISOString().split('T')[0]
  
  return citasStore.citas
    .filter(cita => {
      const fechaCita = cita.fecha.split('T')[0]
      return fechaCita === hoyStr
    })
    .sort((a, b) => {
      const horaA = a.hora.substring(0, 5)
      const horaB = b.hora.substring(0, 5)
      return horaA.localeCompare(horaB)
    })
})

const proximasCitas = computed(() => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyStr = hoy.toISOString().split('T')[0]
  
  return citasStore.citas
    .filter(cita => {
      const fechaCita = cita.fecha.split('T')[0]
      return fechaCita > hoyStr
    })
    .sort((a, b) => {
      const fechaA = a.fecha.split('T')[0]
      const fechaB = b.fecha.split('T')[0]
      if (fechaA !== fechaB) {
        return fechaA.localeCompare(fechaB)
      }
      const horaA = a.hora.substring(0, 5)
      const horaB = b.hora.substring(0, 5)
      return horaA.localeCompare(horaB)
    })
    .slice(0, 20) // Máximo 20 próximas citas
})

const citasPasadas = computed(() => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyStr = hoy.toISOString().split('T')[0]
  
  return citasStore.citas
    .filter(cita => {
      const fechaCita = cita.fecha.split('T')[0]
      return fechaCita < hoyStr
    })
    .sort((a, b) => {
      const fechaA = a.fecha.split('T')[0]
      const fechaB = b.fecha.split('T')[0]
      if (fechaA !== fechaB) {
        return fechaB.localeCompare(fechaA) // Descendente
      }
      const horaA = a.hora.substring(0, 5)
      const horaB = b.hora.substring(0, 5)
      return horaB.localeCompare(horaA) // Descendente
    })
})

const citasDelMes = computed(() => {
  const hoy = new Date()
  const mesActual = hoy.getMonth()
  const añoActual = hoy.getFullYear()
  
  return citasStore.citas.filter(cita => {
    const fechaCita = new Date(cita.fecha.split('T')[0])
    return fechaCita.getMonth() === mesActual && fechaCita.getFullYear() === añoActual
  })
})

const citasPendientes = computed(() => {
  return citasStore.citas.filter(cita => cita.estado === 'pendiente')
})

// Methods
function handleCitaClick(cita) {
  emit('event-click', cita)
}

function getEstadoColor(estado) {
  const estadoObj = citasStore.estados.find(e => e.value === estado)
  return estadoObj ? estadoObj.color : '#6B7280'
}

function getEstadoLabel(estado) {
  const estadoObj = citasStore.estados.find(e => e.value === estado)
  return estadoObj ? estadoObj.label : estado
}

function formatFechaCorta(fecha) {
  if (!fecha) return '-'
  
  const fechaLimpia = fecha.split('T')[0]
  const d = new Date(fechaLimpia + 'T00:00:00')
  
  if (isNaN(d.getTime())) return fecha
  
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const mañana = new Date(hoy)
  mañana.setDate(mañana.getDate() + 1)
  
  const fechaCita = new Date(d)
  fechaCita.setHours(0, 0, 0, 0)
  
  if (fechaCita.getTime() === hoy.getTime()) {
    return 'Hoy'
  } else if (fechaCita.getTime() === mañana.getTime()) {
    return 'Mañana'
  } else {
    return d.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short'
    })
  }
}

function formatHora(hora) {
  if (!hora) return '-'
  return hora.substring(0, 5)
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