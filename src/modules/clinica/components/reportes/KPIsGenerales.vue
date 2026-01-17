<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    
    <!-- KPI 1: Citas Hoy -->
    <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm font-medium mb-1">Citas Hoy</p>
          <h3 class="text-3xl font-bold text-gray-800">{{ data.citas_hoy || 0 }}</h3>
        </div>
        <div class="bg-blue-100 p-3 rounded-lg">
          <i class="fas fa-calendar-day text-2xl text-blue-600"></i>
        </div>
      </div>
    </div>

    <!-- KPI 2: Citas del Mes -->
    <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="text-gray-600 text-sm font-medium mb-1">Citas del Mes</p>
          <h3 class="text-3xl font-bold text-gray-800">{{ data.citas_mes || 0 }}</h3>
        </div>
        <div class="bg-green-100 p-3 rounded-lg">
          <i class="fas fa-calendar-check text-2xl text-green-600"></i>
        </div>
      </div>
      <div class="flex items-center gap-1 text-sm">
        <i 
          :class="[
            'fas', 
            data.variacion_citas >= 0 ? 'fa-arrow-up text-green-600' : 'fa-arrow-down text-red-600'
          ]"
        ></i>
        <span :class="data.variacion_citas >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ Math.abs(data.variacion_citas || 0) }}%
        </span>
        <span class="text-gray-500">vs mes anterior</span>
      </div>
    </div>

    <!-- KPI 3: Pacientes Totales -->
    <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="text-gray-600 text-sm font-medium mb-1">Pacientes Totales</p>
          <h3 class="text-3xl font-bold text-gray-800">{{ data.total_pacientes || 0 }}</h3>
        </div>
        <div class="bg-purple-100 p-3 rounded-lg">
          <i class="fas fa-users text-2xl text-purple-600"></i>
        </div>
      </div>
      <div class="flex items-center gap-1 text-sm">
        <i class="fas fa-plus-circle text-purple-600"></i>
        <span class="text-purple-600 font-medium">{{ data.pacientes_nuevos_mes || 0 }}</span>
        <span class="text-gray-500">nuevos este mes</span>
      </div>
    </div>

    <!-- KPI 4: Ingresos del Mes -->
    <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="text-gray-600 text-sm font-medium mb-1">Ingresos del Mes</p>
          <h3 class="text-3xl font-bold text-gray-800">{{ formatCurrency(data.ingresos_mes || 0) }}</h3>
        </div>
        <div class="bg-yellow-100 p-3 rounded-lg">
          <i class="fas fa-dollar-sign text-2xl text-yellow-600"></i>
        </div>
      </div>
      <div class="flex items-center gap-1 text-sm">
        <i 
          :class="[
            'fas', 
            data.variacion_ingresos >= 0 ? 'fa-arrow-up text-green-600' : 'fa-arrow-down text-red-600'
          ]"
        ></i>
        <span :class="data.variacion_ingresos >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ Math.abs(data.variacion_ingresos || 0) }}%
        </span>
        <span class="text-gray-500">vs mes anterior</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      citas_hoy: 0,
      citas_mes: 0,
      variacion_citas: 0,
      total_pacientes: 0,
      pacientes_nuevos_mes: 0,
      ingresos_mes: 0,
      variacion_ingresos: 0
    })
  }
})

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(value)
}
</script>