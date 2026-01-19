<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
        <i class="fas fa-user-md text-blue-600"></i>
        Rendimiento por Profesional
      </h3>
    </div>

    <!-- Tabla -->
    <div v-if="hasData" class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profesional
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Citas Completadas
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Citas Canceladas
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tasa de Completación
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ingresos Generados
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="(prof, index) in sortedData" 
            :key="prof.id || index"
            class="hover:bg-gray-50 transition"
          >
            <!-- Profesional -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div 
                    class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                    :style="{ backgroundColor: prof.color || getColorForProfesional(prof.nombre) }"
                  >
                    {{ getInitials(prof.nombre) }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ prof.nombre }}
                  </div>
                  <div v-if="prof.especialidad" class="text-xs text-gray-500">
                    {{ prof.especialidad }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Citas Completadas -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <i class="fas fa-check-circle mr-1"></i>
                {{ prof.completadas || 0 }}
              </span>
            </td>

            <!-- Citas Canceladas -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <i class="fas fa-times-circle mr-1"></i>
                {{ prof.canceladas || 0 }}
              </span>
            </td>

            <!-- Tasa de Completación -->
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="flex items-center justify-center gap-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all"
                    :class="getTasaColor(prof.tasa_completacion)"
                    :style="{ width: `${prof.tasa_completacion || 0}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-700">
                  {{ prof.tasa_completacion || 0 }}%
                </span>
              </div>
            </td>

            <!-- Ingresos -->
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <div class="text-sm font-bold text-gray-900">
                {{ formatCurrency(prof.ingresos || 0) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sin datos -->
    <div v-else class="p-12 text-center text-gray-400">
      <i class="fas fa-user-md text-4xl mb-3"></i>
      <p class="text-lg">No hay datos de profesionales disponibles</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Computed
const hasData = computed(() => {
  return Array.isArray(props.data) && props.data.length > 0
})

const sortedData = computed(() => {
  if (!Array.isArray(props.data)) return []
  
  // Ordenar por ingresos (de mayor a menor)
  return [...props.data].sort((a, b) => {
    const ingresosA = a.ingresos || 0
    const ingresosB = b.ingresos || 0
    return ingresosB - ingresosA
  })
})

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value || 0)
}

function getInitials(name) {
  if (!name) return '?'
  
  const parts = name.trim().split(' ')
  
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  
  return name.slice(0, 2).toUpperCase()
}

function getColorForProfesional(name) {
  // Colores predefinidos
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4'  // cyan
  ]
  
  // Validación
  if (!name || typeof name !== 'string') {
    return colors[0]
  }
  
  // Hash simple basado en el nombre
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

function getTasaColor(tasa) {
  const tasaNum = Number(tasa) || 0
  
  if (tasaNum >= 90) return 'bg-green-600'
  if (tasaNum >= 75) return 'bg-blue-600'
  if (tasaNum >= 60) return 'bg-yellow-600'
  return 'bg-red-600'
}
</script>