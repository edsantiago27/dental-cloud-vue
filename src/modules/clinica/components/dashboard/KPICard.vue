<!-- components/dashboard/KPICard.vue -->
<template>
  <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden">
    <!-- Decoración sutil -->
    <div class="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700" :style="{ backgroundColor: color }"></div>

    <div class="flex items-start justify-between relative z-10">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <div 
            class="w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-sm"
            :style="{ backgroundColor: `${color}10`, color: color }"
          >
            <i :class="icon"></i>
          </div>
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {{ title }}
          </p>
        </div>
        
        <h3 class="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none mt-4">
          {{ formatValue(value) }}
        </h3>
        
        <!-- Subtítulo / Cambio porcentual -->
        <div v-if="subtitle || change !== null" class="mt-4 flex items-center gap-3">
          <div v-if="change !== null" 
            class="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
            :class="change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'"
          >
            <i :class="change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ Math.abs(change) }}%
          </div>
          <p v-if="subtitle" class="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
            {{ subtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Barra de progreso (Bento Style) -->
    <div v-if="progress !== null" class="mt-6">
      <div class="flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
        <span>Rendimiento</span>
        <span :style="{ color: color }">{{ progress }}%</span>
      </div>
      <div class="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden border border-gray-100">
        <div 
          class="h-full transition-all duration-1000 ease-out rounded-full"
          :style="{ 
            width: `${progress}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], required: true },
  subtitle: { type: String, default: null },
  icon: { type: String, required: true },
  color: { type: String, default: '#7c3aed' },
  change: { type: Number, default: null },
  progress: { type: Number, default: null },
  format: { type: String, default: 'number' }
})

function formatValue(value) {
  if (typeof value === 'string') return value
  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value)
    case 'percentage':
      return `${value}%`
    default:
      return new Intl.NumberFormat('es-CL').format(value)
  }
}
</script>