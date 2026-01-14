<!-- components/pacientes/HistoriaClinicaButton.vue -->
<template>
  <!-- Versión Botón con Icono (para tabla) -->
  <router-link
    v-if="variant === 'icon'"
    :to="{ name: 'paciente-historia-clinica', params: { id: pacienteId } }"
    class="inline-flex items-center justify-center w-8 h-8 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition"
    :title="title"
  >
    <i class="fas fa-file-medical"></i>
  </router-link>

  <!-- Versión Botón Completo (para vista de detalles) -->
  <router-link
    v-else-if="variant === 'button'"
    :to="{ name: 'paciente-historia-clinica', params: { id: pacienteId } }"
    class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium"
  >
    <i class="fas fa-file-medical"></i>
    <span>{{ label }}</span>
  </router-link>

  <!-- Versión Card (para dashboard) -->
  <router-link
    v-else-if="variant === 'card'"
    :to="{ name: 'paciente-historia-clinica', params: { id: pacienteId } }"
    class="block p-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition"
  >
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
        <i class="fas fa-file-medical text-2xl"></i>
      </div>
      <div>
        <p class="font-semibold">{{ label }}</p>
        <p class="text-sm text-purple-100">{{ subtitle }}</p>
      </div>
    </div>
  </router-link>

  <!-- Versión Link Simple -->
  <router-link
    v-else
    :to="{ name: 'paciente-historia-clinica', params: { id: pacienteId } }"
    class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition"
  >
    <i class="fas fa-file-medical"></i>
    <span>{{ label }}</span>
  </router-link>
</template>

<script setup>
const props = defineProps({
  pacienteId: {
    type: [Number, String],
    required: true
  },
  variant: {
    type: String,
    default: 'link',
    validator: (value) => ['icon', 'button', 'card', 'link'].includes(value)
  },
  label: {
    type: String,
    default: 'Historia Clínica'
  },
  subtitle: {
    type: String,
    default: 'Ver registro completo'
  },
  title: {
    type: String,
    default: 'Ver Historia Clínica'
  }
})
</script>