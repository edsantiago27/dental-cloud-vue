<template>
  <div class="w-full max-w-2xl">
    <div class="bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-clinic-medical text-white text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Selecciona tu Clínica</h1>
        <p class="text-gray-600 mt-2">Eres paciente en múltiples clínicas</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-3xl text-blue-600"></i>
      </div>

      <!-- Lista de Clínicas -->
      <div v-else class="space-y-3">
        <button
          v-for="clinica in clinicas"
          :key="clinica.id"
          @click="$emit('select', clinica.id)"
          class="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left group"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition">
              <i class="fas fa-tooth text-2xl text-blue-600"></i>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                {{ clinica.nombre }}
              </h3>
              <p class="text-sm text-gray-600">{{ clinica.direccion }}</p>
            </div>
            <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 transition"></i>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  clinicas: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])
</script>
