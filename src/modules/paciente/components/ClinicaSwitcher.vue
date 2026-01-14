<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@shared/stores/auth'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const toast = useToast()
const showDropdown = ref(false)

const currentClinica = computed(() => authStore.clinica)
const otherClinics = computed(() => 
  authStore.clinicas.filter(c => c.id !== currentClinica.value?.id)
)

async function switchTo(clinicaId) {
  showDropdown.value = false
  
  const result = await authStore.switchClinica(clinicaId)
  
  if (result.success) {
    toast.success('Clínica cambiada exitosamente')
    window.location.reload() // Recargar para actualizar datos
  } else {
    toast.error('Error al cambiar de clínica')
  }
}
</script>

<template>
  <div v-if="authStore.hasMultipleClinics" class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      <i class="fas fa-hospital text-blue-600"></i>
      <span class="text-sm font-medium">{{ currentClinica?.nombre }}</span>
      <i class="fas fa-chevron-down text-xs"></i>
    </button>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
    >
      <div class="px-4 py-2 border-b border-gray-200">
        <p class="text-xs text-gray-500 uppercase font-semibold">Cambiar a:</p>
      </div>
      
      <button
        v-for="clinica in otherClinics"
        :key="clinica.id"
        @click="switchTo(clinica.id)"
        class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3"
      >
        <i class="fas fa-hospital text-gray-400"></i>
        <span class="text-sm">{{ clinica.nombre }}</span>
      </button>
    </div>
  </div>
</template>
