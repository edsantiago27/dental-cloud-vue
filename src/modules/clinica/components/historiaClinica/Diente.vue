<!-- components/historiaClinica/Diente.vue -->
<template>
  <div
    class="relative cursor-pointer transition-all duration-200 hover:scale-110"
    @click="$emit('click')"
  >
    <!-- SVG del Diente -->
    <svg
      width="45"
      height="65"
      viewBox="0 0 45 65"
      xmlns="http://www.w3.org/2000/svg"
      class="drop-shadow-sm"
    >
      <!-- Diente -->
      <path
        :d="pathDiente"
        :fill="estadoColor"
        stroke="#333"
        stroke-width="1.5"
        class="transition-colors duration-200"
      />
      
      <!-- Corona (si tiene) -->
      <path
        v-if="estado === 'corona'"
        d="M 15 8 L 18 5 L 22 3 L 27 5 L 30 8 L 28 12 L 17 12 Z"
        fill="#FFD700"
        stroke="#B8860B"
        stroke-width="1"
      />
      
      <!-- X para ausente -->
      <g v-if="estado === 'ausente'">
        <line x1="10" y1="10" x2="35" y2="55" stroke="#FF0000" stroke-width="3" />
        <line x1="35" y1="10" x2="10" y2="55" stroke="#FF0000" stroke-width="3" />
      </g>
      
      <!-- Indicador de problema -->
      <circle
        v-if="tieneProblema"
        cx="38"
        cy="10"
        r="5"
        fill="#FF0000"
        class="animate-pulse"
      />
    </svg>

    <!-- Número del diente -->
    <div class="text-center mt-1">
      <span class="text-xs font-bold text-gray-700">{{ numero }}</span>
    </div>

    <!-- Tooltip con notas -->
    <div
      v-if="notas"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10"
    >
      {{ notas }}
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHistoriaClinicaStore } from '../stores/historiaClinica'

const props = defineProps({
  numero: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    default: 'sano'
  },
  notas: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])

const historiaStore = useHistoriaClinicaStore()

// Path SVG del diente (forma genérica)
const pathDiente = computed(() => {
  // Corona más ancha, raíz más estrecha
  return `M 12 12 
          Q 12 8, 15 5 
          Q 18 2, 22 2 
          Q 27 2, 30 5 
          Q 33 8, 33 12 
          L 33 35 
          Q 33 45, 28 52 
          Q 25 58, 22 60 
          Q 19 58, 16 52 
          Q 12 45, 12 35 
          Z`
})

// Color según estado
const estadoColor = computed(() => {
  const estadoObj = historiaStore.estadosDiente.find(e => e.value === props.estado)
  return estadoObj ? estadoObj.color : '#FFFFFF'
})

// Indicador si tiene problema
const tieneProblema = computed(() => {
  return ['caries', 'fractura'].includes(props.estado)
})
</script>

<style scoped>
.drop-shadow-sm {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>