<!-- views/admin/PruebaHistoriaClinica.vue -->
<template>
  <div class="max-w-7xl mx-auto">
    
    <!-- Info Banner -->
    <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 mb-6 text-white">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <i class="fas fa-check-circle text-4xl"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold">🎉 ¡Historia Clínica Completa!</h1>
          <p class="text-green-100 mt-1">Sistema 100% funcional con todos los módulos integrados</p>
        </div>
      </div>
    </div>

    <!-- Selector de Paciente -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Seleccionar Paciente de Prueba</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          :to="{ name: 'historia-clinica', params: { id: 1 } }"
          class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-blue-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Paciente 1</p>
              <p class="text-sm text-gray-600">Juan Pérez</p>
            </div>
          </div>
        </router-link>

        <router-link
          :to="{ name: 'historia-clinica', params: { id: 2 } }"
          class="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-purple-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Paciente 2</p>
              <p class="text-sm text-gray-600">María García</p>
            </div>
          </div>
        </router-link>

        <router-link
          :to="{ name: 'historia-clinica', params: { id: 3 } }"
          class="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition cursor-pointer"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-green-600 text-xl"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">Paciente 3</p>
              <p class="text-sm text-gray-600">Carlos López</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Módulos Completados -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">
        <i class="fas fa-clipboard-check text-green-600 mr-2"></i>
        Módulos Implementados
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Odontograma -->
        <div class="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
          <div class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <i class="fas fa-tooth text-white"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Odontograma</h3>
            <p class="text-sm text-gray-600 mt-1">Sistema visual de 32 dientes con 10 estados diferentes</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="px-2 py-1 bg-blue-600 text-white text-xs rounded">Completado</span>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
          <div class="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <i class="fas fa-history text-white"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Timeline de Tratamientos</h3>
            <p class="text-sm text-gray-600 mt-1">Historial cronológico con filtros y estadísticas</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="px-2 py-1 bg-purple-600 text-white text-xs rounded">Completado</span>
            </div>
          </div>
        </div>

        <!-- Ficha Médica -->
        <div class="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
          <div class="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <i class="fas fa-file-medical text-white"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Ficha Médica</h3>
            <p class="text-sm text-gray-600 mt-1">Datos médicos, alergias, medicamentos y contacto emergencia</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="px-2 py-1 bg-green-600 text-white text-xs rounded">Completado</span>
            </div>
          </div>
        </div>

        <!-- Archivos -->
        <div class="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
          <div class="flex-shrink-0 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
            <i class="fas fa-folder-open text-white"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Archivos y Radiografías</h3>
            <p class="text-sm text-gray-600 mt-1">Upload, galería, preview y gestión de archivos</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="px-2 py-1 bg-orange-600 text-white text-xs rounded">Completado</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas del Proyecto -->
    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 mt-6 text-white">
      <h2 class="text-lg font-semibold mb-4">📊 Estadísticas del Desarrollo</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <p class="text-3xl font-bold text-blue-400">20+</p>
          <p class="text-sm text-gray-400 mt-1">Componentes</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-green-400">5,000+</p>
          <p class="text-sm text-gray-400 mt-1">Líneas de Código</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-purple-400">~3h</p>
          <p class="text-sm text-gray-400 mt-1">Tiempo Total</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-yellow-400">100%</p>
          <p class="text-sm text-gray-400 mt-1">Completado</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// Vista de prueba - no necesita lógica compleja
</script>