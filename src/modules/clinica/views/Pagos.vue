<!-- views/admin/Placeholder.vue -->
<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center">
      <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <i :class="icon" class="text-4xl text-blue-600"></i>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ title }}</h2>
      <p class="text-gray-600 mb-6">Este módulo estará disponible próximamente</p>
      <router-link 
        to="/dashboard" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Volver al Dashboard</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Módulo en Desarrollo'
  },
  icon: {
    type: String,
    default: 'fas fa-invoice-dollar'
  }
})
</script>