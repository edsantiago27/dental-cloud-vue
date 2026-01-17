<template>
  <div class="flex flex-wrap items-center gap-3">
    
    <!-- Selector de Período -->
    <div class="flex items-center gap-2 bg-white rounded-lg shadow-md px-4 py-2">
      <i class="fas fa-calendar text-gray-600"></i>
      <select 
        v-model="localFiltros.periodo"
        @change="handlePeriodoChange"
        class="border-0 focus:ring-0 text-sm font-medium text-gray-700 cursor-pointer"
      >
        <option value="semana">Esta Semana</option>
        <option value="mes">Este Mes</option>
        <option value="ano">Este Año</option>
        <option value="personalizado">Personalizado</option>
      </select>
    </div>

    <!-- Fechas Personalizadas (solo si periodo = personalizado) -->
    <template v-if="localFiltros.periodo === 'personalizado'">
      <div class="flex items-center gap-2 bg-white rounded-lg shadow-md px-4 py-2">
        <i class="fas fa-calendar-alt text-gray-600"></i>
        <input 
          v-model="localFiltros.fecha_inicio"
          type="date"
          class="border-0 focus:ring-0 text-sm text-gray-700"
          placeholder="Fecha inicio"
        >
      </div>

      <div class="flex items-center gap-2 bg-white rounded-lg shadow-md px-4 py-2">
        <i class="fas fa-calendar-alt text-gray-600"></i>
        <input 
          v-model="localFiltros.fecha_fin"
          type="date"
          class="border-0 focus:ring-0 text-sm text-gray-700"
          placeholder="Fecha fin"
        >
      </div>
    </template>

    <!-- Filtro por Profesional (opcional) -->
    <div class="flex items-center gap-2 bg-white rounded-lg shadow-md px-4 py-2">
      <i class="fas fa-user-md text-gray-600"></i>
      <select 
        v-model="localFiltros.profesional_id"
        class="border-0 focus:ring-0 text-sm text-gray-700 cursor-pointer"
      >
        <option :value="null">Todos los profesionales</option>
        <option 
          v-for="prof in profesionales" 
          :key="prof.id" 
          :value="prof.id"
        >
          {{ prof.nombre }} {{ prof.apellido }}
        </option>
      </select>
    </div>

    <!-- Botón Aplicar -->
    <button
      @click="aplicarFiltros"
      :disabled="!canApply"
      class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition"
    >
      <i class="fas fa-filter"></i>
      <span>Aplicar</span>
    </button>

    <!-- Botón Resetear -->
    <button
      @click="resetearFiltros"
      class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition"
    >
      <i class="fas fa-redo"></i>
      <span>Resetear</span>
    </button>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      periodo: 'mes',
      fecha_inicio: null,
      fecha_fin: null,
      profesional_id: null
    })
  },
  profesionales: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'change'])

// State
const localFiltros = ref({ ...props.modelValue })

// Computed
const canApply = computed(() => {
  if (localFiltros.value.periodo === 'personalizado') {
    return localFiltros.value.fecha_inicio && localFiltros.value.fecha_fin
  }
  return true
})

// Methods
function handlePeriodoChange() {
  // Si cambia el período y no es personalizado, limpiar fechas
  if (localFiltros.value.periodo !== 'personalizado') {
    localFiltros.value.fecha_inicio = null
    localFiltros.value.fecha_fin = null
  }
}

function aplicarFiltros() {
  if (!canApply.value) return
  
  emit('update:modelValue', { ...localFiltros.value })
  emit('change', { ...localFiltros.value })
}

function resetearFiltros() {
  localFiltros.value = {
    periodo: 'mes',
    fecha_inicio: null,
    fecha_fin: null,
    profesional_id: null
  }
  aplicarFiltros()
}

// Watch para sincronizar con props
watch(() => props.modelValue, (newVal) => {
  localFiltros.value = { ...newVal }
}, { deep: true })
</script>