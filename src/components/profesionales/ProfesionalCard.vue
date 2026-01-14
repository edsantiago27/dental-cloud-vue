<!-- components/profesionales/ProfesionalCard.vue -->
<template>
  <div 
    class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
    @click="$emit('click', profesional)"
  >
    <!-- Header con color del profesional -->
    <div 
      class="h-2"
      :style="{ backgroundColor: profesional.color_agenda || '#3B82F6' }"
    ></div>

    <div class="p-6">
      
      <!-- Avatar y nombre -->
      <div class="flex items-start gap-4 mb-4">
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
          :style="{ backgroundColor: profesional.color_agenda || '#3B82F6' }"
        >
          {{ getInitials() }}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition">
            Dr. {{ profesional.nombre }} {{ profesional.apellido }}
          </h3>
          <p class="text-sm text-gray-600 truncate">
            {{ profesional.especialidad || 'Odontología General' }}
          </p>
        </div>
      </div>

      <!-- Info rápida -->
      <div class="space-y-2 mb-4">
        
        <!-- Email -->
        <div v-if="profesional.email" class="flex items-center gap-2 text-sm text-gray-600">
          <i class="fas fa-envelope text-gray-400 w-4"></i>
          <span class="truncate">{{ profesional.email }}</span>
        </div>

        <!-- Teléfono -->
        <div v-if="profesional.telefono" class="flex items-center gap-2 text-sm text-gray-600">
          <i class="fas fa-phone text-gray-400 w-4"></i>
          <span>{{ profesional.telefono }}</span>
        </div>

        <!-- Registro Profesional -->
        <div v-if="profesional.registro_profesional" class="flex items-center gap-2 text-sm text-gray-600">
          <i class="fas fa-certificate text-gray-400 w-4"></i>
          <span>Reg. {{ profesional.registro_profesional }}</span>
        </div>

      </div>

      <!-- Horarios -->
      <div class="mb-4 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-gray-500">Horarios:</span>
          <span class="text-xs font-semibold text-gray-700">
            {{ horariosActivos.length }} días configurados
          </span>
        </div>
        
        <!-- Días de la semana (badges) -->
        <div class="flex flex-wrap gap-1">
          <span
            v-for="dia in diasSemana"
            :key="dia.value"
            :class="[
              'px-2 py-1 rounded text-xs font-medium',
              tieneHorario(dia.value)
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-400'
            ]"
          >
            {{ dia.short }}
          </span>
        </div>
      </div>

      <!-- Footer con estado y acciones -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        
        <!-- Estado -->
        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            profesional.estado === 'activo' 
              ? 'bg-green-100 text-green-800'
              : profesional.estado === 'licencia'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-gray-100 text-gray-800'
          ]"
        >
          <i :class="getEstadoIcon()" class="mr-1"></i>
          {{ getEstadoLabel() }}
        </span>

        <!-- Botones de acción -->
        <div class="flex items-center gap-1">
          <button
            @click.stop="$emit('edit', profesional)"
            class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Editar"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button
            @click.stop="$emit('delete', profesional)"
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Eliminar"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  profesional: {
    type: Object,
    required: true
  }
})

defineEmits(['click', 'edit', 'delete'])

const diasSemana = [
  { value: 1, label: 'Lunes', short: 'L' },
  { value: 2, label: 'Martes', short: 'M' },
  { value: 3, label: 'Miércoles', short: 'X' },
  { value: 4, label: 'Jueves', short: 'J' },
  { value: 5, label: 'Viernes', short: 'V' },
  { value: 6, label: 'Sábado', short: 'S' },
  { value: 0, label: 'Domingo', short: 'D' }
]

const horariosActivos = computed(() => {
  return (props.profesional.horarios || []).filter(h => h.estado === 'activo')
})

function getInitials() {
  const n = props.profesional.nombre?.[0] || ''
  const a = props.profesional.apellido?.[0] || ''
  return (n + a).toUpperCase() || '?'
}

function tieneHorario(dia) {
  return horariosActivos.value.some(h => h.dia_semana === dia)
}

function getEstadoIcon() {
  switch (props.profesional.estado) {
    case 'activo':
      return 'fas fa-check-circle'
    case 'licencia':
      return 'fas fa-umbrella-beach'
    case 'inactivo':
      return 'fas fa-times-circle'
    default:
      return 'fas fa-circle'
  }
}

function getEstadoLabel() {
  switch (props.profesional.estado) {
    case 'activo':
      return 'Activo'
    case 'licencia':
      return 'Licencia'
    case 'inactivo':
      return 'Inactivo'
    default:
      return props.profesional.estado
  }
}
</script>