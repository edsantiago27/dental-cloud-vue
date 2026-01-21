<template>
  <div class="periodonto-diente flex flex-col items-center p-2 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow relative" :class="{'ring-2 ring-indigo-500': isSelected}">
    <!-- Número del Diente -->
    <div class="font-bold text-gray-700 mb-2">{{ numero }}</div>

    <!-- Inputs Vestibular (Superior o Inferior según posición) -->
    <div class="grid grid-cols-3 gap-1 mb-1 w-full text-center">
      <!-- Distal, Central, Mesial -->
      <div v-for="pos in ['distal', 'central', 'mesial']" :key="'v-'+pos" class="flex flex-col items-center">
        <input 
          type="number" 
          v-model="mediciones.vestibular[pos].ps" 
          class="w-8 h-6 text-xs text-center border rounded p-0 focus:ring-1 focus:ring-indigo-500" 
          placeholder="PS"
          max="15" min="0"
          :class="{'bg-red-50 text-red-600 font-bold': mediciones.vestibular[pos].ps > 3}"
        >
        <div class="flex gap-0.5 mt-0.5">
          <button 
            @click="toggleSangrado('vestibular', pos)"
            class="w-3 h-3 rounded-full border border-gray-300"
            :class="mediciones.vestibular[pos].sangrado ? 'bg-red-500 border-red-600' : 'bg-white'"
            title="Sangrado"
          ></button>
          <button 
            @click="togglePlaca('vestibular', pos)"
            class="w-3 h-3 rounded-full border border-gray-300"
            :class="mediciones.vestibular[pos].placa ? 'bg-yellow-400 border-yellow-500' : 'bg-white'"
            title="Placa"
          ></button>
        </div>
      </div>
    </div>

    <!-- Representación Visual (Simplificada por ahora) -->
    <div 
      class="tooth-visual w-12 h-16 bg-gray-100 rounded-b-lg border border-gray-300 relative my-1 cursor-pointer"
      @click="$emit('select')"
    >
      <!-- Raíces (Visual simple) -->
      <div class="absolute -top-2 left-0 w-full h-2 flex justify-center gap-1">
         <div class="w-1 bg-gray-300 h-full"></div>
         <div class="w-1 bg-gray-300 h-full"></div>
      </div>
      
      <!-- Corona -->
      <div class="w-full h-full bg-white rounded-b-lg flex items-center justify-center text-xs text-gray-300">
        {{ numero }}
      </div>
      
      <!-- Línea de Encía (Canvas overlay sería ideal, aquí indicativo) -->
      <div class="absolute bottom-0 w-full h-1 bg-pink-300 opacity-50"></div>
    </div>

    <!-- Inputs Palatino/Lingual -->
    <div class="grid grid-cols-3 gap-1 mt-1 w-full text-center">
      <div v-for="pos in ['distal', 'central', 'mesial']" :key="'p-'+pos" class="flex flex-col items-center">
        <input 
          type="number" 
          v-model="mediciones.palatino[pos].ps" 
          class="w-8 h-6 text-xs text-center border rounded p-0 focus:ring-1 focus:ring-indigo-500" 
          placeholder="PS"
          max="15" min="0"            
          :class="{'bg-red-50 text-red-600 font-bold': mediciones.palatino[pos].ps > 3}"
        >
        <div class="flex gap-0.5 mt-0.5">
          <button 
            @click="toggleSangrado('palatino', pos)"
            class="w-3 h-3 rounded-full border border-gray-300"
            :class="mediciones.palatino[pos].sangrado ? 'bg-red-500 border-red-600' : 'bg-white'"
            title="Sangrado"
          ></button>
           <button 
            @click="togglePlaca('palatino', pos)"
            class="w-3 h-3 rounded-full border border-gray-300"
            :class="mediciones.palatino[pos].placa ? 'bg-yellow-400 border-yellow-500' : 'bg-white'"
            title="Placa"
          ></button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  numero: {
    type: Number,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  isSelected: Boolean
})

const emit = defineEmits(['update:modelValue', 'select'])

// Estructura de datos por defecto
const defaultStructure = {
  vestibular: {
    distal: { ps: null, mg: 0, sangrado: false, placa: false },
    central: { ps: null, mg: 0, sangrado: false, placa: false },
    mesial: { ps: null, mg: 0, sangrado: false, placa: false }
  },
  palatino: {
    distal: { ps: null, mg: 0, sangrado: false, placa: false },
    central: { ps: null, mg: 0, sangrado: false, placa: false },
    mesial: { ps: null, mg: 0, sangrado: false, placa: false }
  },
  movilidad: 0,
  furca: 0
}

// Inicializar mediciones con props o default
const mediciones = reactive({ ...defaultStructure, ...props.modelValue })

function toggleSangrado(cara, pos) {
  mediciones[cara][pos].sangrado = !mediciones[cara][pos].sangrado
  emitChange()
}

function togglePlaca(cara, pos) {
  mediciones[cara][pos].placa = !mediciones[cara][pos].placa
  emitChange()
}

function emitChange() {
  emit('update:modelValue', mediciones)
}

// Watch profundo para emitir cambios en valores numéricos
watch(mediciones, () => {
  emitChange()
}, { deep: true })

</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
