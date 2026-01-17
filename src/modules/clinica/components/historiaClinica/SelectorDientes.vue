<!-- components/historiaClinica/SelectorDientes.vue -->
<template>
  <div class="selector-dientes">
    <!-- Arcada Superior -->
    <div class="mb-4">
      <p class="text-xs font-medium text-gray-600 mb-2">Arcada Superior</p>
      <div class="grid grid-cols-8 gap-1.5">
        <button
          v-for="numero in dientesSuperioresDerechos"
          :key="numero"
          @click="toggleDiente(numero)"
          type="button"
          class="h-10 border-2 rounded-lg text-center font-bold text-sm transition-all hover:scale-105"
          :class="getDienteClasses(numero)"
          :title="`Diente ${numero}`"
        >
          {{ numero }}
        </button>
        
        <button
          v-for="numero in dientesSuperioresIzquierdos"
          :key="numero"
          @click="toggleDiente(numero)"
          type="button"
          class="h-10 border-2 rounded-lg text-center font-bold text-sm transition-all hover:scale-105"
          :class="getDienteClasses(numero)"
          :title="`Diente ${numero}`"
        >
          {{ numero }}
        </button>
      </div>
    </div>

    <!-- Arcada Inferior -->
    <div>
      <p class="text-xs font-medium text-gray-600 mb-2">Arcada Inferior</p>
      <div class="grid grid-cols-8 gap-1.5">
        <button
          v-for="numero in dientesInferioresDerechos"
          :key="numero"
          @click="toggleDiente(numero)"
          type="button"
          class="h-10 border-2 rounded-lg text-center font-bold text-sm transition-all hover:scale-105"
          :class="getDienteClasses(numero)"
          :title="`Diente ${numero}`"
        >
          {{ numero }}
        </button>
        
        <button
          v-for="numero in dientesInferioresIzquierdos"
          :key="numero"
          @click="toggleDiente(numero)"
          type="button"
          class="h-10 border-2 rounded-lg text-center font-bold text-sm transition-all hover:scale-105"
          :class="getDienteClasses(numero)"
          :title="`Diente ${numero}`"
        >
          {{ numero }}
        </button>
      </div>
    </div>

    <!-- Contador de seleccionados -->
    <div v-if="modelValue.length > 0" class="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-sm text-blue-800">
        <i class="fas fa-tooth mr-2"></i>
        {{ modelValue.length }} {{ modelValue.length === 1 ? 'diente seleccionado' : 'dientes seleccionados' }}:
        <span class="font-semibold">{{ modelValue.sort((a, b) => a - b).join(', ') }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Dientes adultos según sistema FDI
// Arcada superior derecha: 18 a 11 (derecha a izquierda)
const dientesSuperioresDerechos = [18, 17, 16, 15, 14, 13, 12, 11]
// Arcada superior izquierda: 21 a 28 (izquierda a derecha)
const dientesSuperioresIzquierdos = [21, 22, 23, 24, 25, 26, 27, 28]

// Arcada inferior derecha: 48 a 41 (derecha a izquierda)
const dientesInferioresDerechos = [48, 47, 46, 45, 44, 43, 42, 41]
// Arcada inferior izquierda: 31 a 38 (izquierda a derecha)
const dientesInferioresIzquierdos = [31, 32, 33, 34, 35, 36, 37, 38]

function isDienteSeleccionado(numero) {
  return props.modelValue.includes(numero)
}

function getDienteClasses(numero) {
  if (isDienteSeleccionado(numero)) {
    return 'border-blue-600 bg-blue-100 text-blue-800 shadow-md'
  }
  return 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
}

function toggleDiente(numero) {
  const seleccionados = [...props.modelValue]
  const index = seleccionados.indexOf(numero)

  if (index === -1) {
    // Agregar
    if (props.multiple) {
      seleccionados.push(numero)
    } else {
      // Si no es multiple, reemplazar
      seleccionados.splice(0, seleccionados.length, numero)
    }
  } else {
    // Quitar
    seleccionados.splice(index, 1)
  }

  emit('update:modelValue', seleccionados)
}
</script>

<style scoped>
.selector-dientes {
  user-select: none;
}
</style>