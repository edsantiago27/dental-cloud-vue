<!-- components/dashboard/KPICard.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-1">
          {{ title }}
        </p>
        <p class="text-3xl font-bold text-gray-900">
          {{ formatValue(value) }}
        </p>
        
        <!-- Subtítulo / Cambio porcentual -->
        <div v-if="subtitle || change !== null" class="mt-2">
          <p v-if="subtitle" class="text-xs text-gray-500">
            {{ subtitle }}
          </p>
          <div v-if="change !== null" class="flex items-center gap-1 mt-1">
            <i 
              :class="[
                'fas text-xs',
                change >= 0 ? 'fa-arrow-up text-green-600' : 'fa-arrow-down text-red-600'
              ]"
            ></i>
            <span 
              :class="[
                'text-xs font-medium',
                change >= 0 ? 'text-green-600' : 'text-red-600'
              ]"
            >
              {{ Math.abs(change) }}%
            </span>
            <span class="text-xs text-gray-500">vs mes anterior</span>
          </div>
        </div>
      </div>

      <!-- Ícono -->
      <div 
        class="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
        :style="{ backgroundColor: `${color}20` }"
      >
        <i 
          :class="icon" 
          class="text-2xl"
          :style="{ color: color }"
        ></i>
      </div>
    </div>

    <!-- Barra de progreso (opcional) -->
    <div v-if="progress !== null" class="mt-4">
      <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
        <span>Progreso</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-500"
          :style="{ 
            width: `${progress}%`,
            backgroundColor: color
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  subtitle: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  change: {
    type: Number,
    default: null
  },
  progress: {
    type: Number,
    default: null
  },
  format: {
    type: String,
    default: 'number' // 'number', 'currency', 'percentage'
  }
})

function formatValue(value) {
  if (typeof value === 'string') return value

  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      }).format(value)
    
    case 'percentage':
      return `${value}%`
    
    default:
      return new Intl.NumberFormat('es-CL').format(value)
  }
}
</script>