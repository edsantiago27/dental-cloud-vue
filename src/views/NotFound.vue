<!-- views/NotFound.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="text-center">
      
      <!-- Icono -->
      <div class="mb-8">
        <i class="fas fa-tooth text-9xl text-gray-300"></i>
      </div>

      <!-- Mensaje -->
      <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Página No Encontrada</h2>
      <p class="text-gray-600 mb-8">
        La página que buscas no existe o fue movida.
      </p>

      <!-- Botones -->
      <div class="flex gap-4 justify-center">
        <button
          @click="$router.back()"
          class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Volver Atrás
        </button>
        
        <button
          @click="$router.push('/dashboard')"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <i class="fas fa-home mr-2"></i>
          Ir al Dashboard
        </button>
      </div>

    </div>
  </div>
</template>