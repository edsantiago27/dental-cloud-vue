<script setup>
import { ref } from 'vue'

const props = defineProps({
  clinicas: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const selectedClinicaId = ref(null)

function selectClinica(clinicaId) {
  selectedClinicaId.value = clinicaId
  emit('select', clinicaId)
}
</script>

<template>
  <div class="clinica-selector">
    <div class="max-w-2xl mx-auto p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2 text-center">
        Selecciona tu Clínica
      </h2>
      <p class="text-gray-600 mb-6 text-center">
        Tienes acceso a {{ clinicas.length }} clínicas dentales
      </p>

      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="clinica in clinicas"
          :key="clinica.id"
          @click="selectClinica(clinica.id)"
          class="clinica-card"
          :class="{ 
            'selected': selectedClinicaId === clinica.id,
            'cursor-not-allowed opacity-50': loading
          }"
        >
          <div class="flex items-center gap-4">
            <!-- Logo o ícono -->
            <div class="flex-shrink-0">
              <div v-if="clinica.logo" class="w-16 h-16 rounded-lg overflow-hidden">
                <img :src="clinica.logo" :alt="clinica.nombre" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                <i class="fas fa-tooth text-blue-600 text-2xl"></i>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800">
                {{ clinica.nombre }}
              </h3>
              <p v-if="clinica.direccion" class="text-sm text-gray-600 mt-1">
                <i class="fas fa-map-marker-alt mr-1"></i>
                {{ clinica.direccion }}
              </p>
              <p v-if="clinica.telefono" class="text-sm text-gray-600">
                <i class="fas fa-phone mr-1"></i>
                {{ clinica.telefono }}
              </p>
            </div>

            <!-- Flecha -->
            <div class="flex-shrink-0">
              <i class="fas fa-chevron-right text-gray-400"></i>
            </div>
          </div>

          <!-- Loading spinner si está seleccionada -->
          <div v-if="loading && selectedClinicaId === clinica.id" class="mt-4 text-center">
            <i class="fas fa-spinner fa-spin text-blue-600"></i>
            <span class="ml-2 text-sm text-gray-600">Cargando...</span>
          </div>
        </div>
      </div>

      <div v-if="clinicas.length === 0" class="text-center py-8">
        <i class="fas fa-exclamation-circle text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-600">No tienes clínicas asignadas</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clinica-card {
  @apply bg-white rounded-lg border-2 border-gray-200 p-4 cursor-pointer transition-all;
  @apply hover:border-blue-500 hover:shadow-md;
}

.clinica-card.selected {
  @apply border-blue-600 bg-blue-50;
}
</style>
