<!-- components/profesionales/HorariosEditor.vue -->
<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-4">
      <h4 class="text-lg font-semibold text-gray-900">
        <i class="fas fa-clock text-blue-600 mr-2"></i>
        Horarios de Atención
      </h4>
      <button
        @click="agregarTodos"
        type="button"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <i class="fas fa-calendar-plus mr-1"></i>
        Agregar todos los días
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="dia in DIAS_SEMANA"
        :key="dia.value"
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
      >
        <!-- Checkbox para activar/desactivar día -->
        <div class="flex items-center min-w-[100px]">
          <input
            type="checkbox"
            :id="`dia-${dia.value}`"
            :checked="isDiaActivo(dia.value)"
            @change="toggleDia(dia.value)"
            class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          >
          <label
            :for="`dia-${dia.value}`"
            class="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
          >
            {{ dia.label }}
          </label>
        </div>

        <!-- Inputs de hora (solo si día está activo) -->
        <template v-if="isDiaActivo(dia.value)">
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-500">Desde:</label>
              <input
                type="time"
                v-model="getHorario(dia.value).hora_inicio"
                class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>

            <span class="text-gray-400">-</span>

            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-500">Hasta:</label>
              <input
                type="time"
                v-model="getHorario(dia.value).hora_fin"
                class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>
          </div>

          <button
            @click="removerDia(dia.value)"
            type="button"
            class="text-red-500 hover:text-red-700 ml-auto"
            title="Eliminar horario"
          >
            <i class="fas fa-trash text-sm"></i>
          </button>
        </template>

        <span v-else class="text-sm text-gray-400 italic ml-auto">
          No atiende
        </span>
      </div>
    </div>

    <!-- Resumen de horarios configurados -->
    <div v-if="horariosConfigurados > 0" class="mt-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-sm text-blue-800">
        <i class="fas fa-info-circle mr-2"></i>
        {{ horariosConfigurados }} día{{ horariosConfigurados > 1 ? 's' : '' }} configurado{{ horariosConfigurados > 1 ? 's' : '' }}
      </p>
    </div>

    <!-- Mensaje si no hay horarios -->
    <div v-else class="mt-4 p-3 bg-yellow-50 rounded-lg">
      <p class="text-sm text-yellow-800">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        No hay horarios configurados. Selecciona al menos un día de atención.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const DIAS_SEMANA = [
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
  { value: 0, label: 'Domingo', short: 'Dom' }
]

// State local de horarios
const horarios = ref([])

// Inicializar con valores del prop
watch(() => props.modelValue, (newVal) => {
  if (newVal && Array.isArray(newVal)) {
    horarios.value = newVal.map(h => ({
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio || '09:00',
      hora_fin: h.hora_fin || '18:00',
      estado: h.estado || 'activo'
    }))
  }
}, { immediate: true })

// Computed
const horariosConfigurados = computed(() => {
  return horarios.value.filter(h => h.estado === 'activo').length
})

// Methods
function isDiaActivo(dia) {
  return horarios.value.some(h => h.dia_semana === dia && h.estado === 'activo')
}

function getHorario(dia) {
  let horario = horarios.value.find(h => h.dia_semana === dia)
  
  if (!horario) {
    horario = {
      dia_semana: dia,
      hora_inicio: '09:00',
      hora_fin: '18:00',
      estado: 'activo'
    }
    horarios.value.push(horario)
    emitChange()
  }
  
  return horario
}

function toggleDia(dia) {
  const index = horarios.value.findIndex(h => h.dia_semana === dia)
  
  if (index !== -1) {
    // Si existe, cambiar estado
    horarios.value[index].estado = horarios.value[index].estado === 'activo' ? 'inactivo' : 'activo'
  } else {
    // Si no existe, crear nuevo
    horarios.value.push({
      dia_semana: dia,
      hora_inicio: '09:00',
      hora_fin: '18:00',
      estado: 'activo'
    })
  }
  
  emitChange()
}

function removerDia(dia) {
  const index = horarios.value.findIndex(h => h.dia_semana === dia)
  if (index !== -1) {
    horarios.value[index].estado = 'inactivo'
  }
  emitChange()
}

function agregarTodos() {
  DIAS_SEMANA.forEach(dia => {
    const exists = horarios.value.find(h => h.dia_semana === dia.value)
    
    if (!exists) {
      horarios.value.push({
        dia_semana: dia.value,
        hora_inicio: '09:00',
        hora_fin: '18:00',
        estado: 'activo'
      })
    } else if (exists.estado !== 'activo') {
      exists.estado = 'activo'
    }
  })
  
  emitChange()
}

function emitChange() {
  // Emitir solo horarios activos
  const activos = horarios.value.filter(h => h.estado === 'activo')
  emit('update:modelValue', activos)
}
</script>