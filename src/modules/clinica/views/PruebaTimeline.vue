<!-- views/admin/PruebaTimeline.vue -->
<template>
  <div class="max-w-7xl mx-auto">
    
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Timeline de Tratamientos - Prueba</h1>
          <p class="text-gray-600 mt-1">Paciente de prueba: Juan Pérez (ID: 1)</p>
        </div>
        <router-link
          to="/pacientes"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Volver
        </router-link>
      </div>
    </div>

    <!-- Timeline -->
    <TimelineTratamientos :paciente-id="3" />

    <!-- Información de Prueba -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
      <div class="flex items-start gap-3">
        <i class="fas fa-info-circle text-blue-600 text-xl mt-1"></i>
        <div>
          <h3 class="font-semibold text-blue-900 mb-2">Modo Prueba</h3>
          <p class="text-blue-800 text-sm mb-3">
            Esta es una vista de prueba del Timeline de Tratamientos/Entradas Clínicas.
          </p>
          <div class="space-y-2 text-sm text-blue-700">
            <p><strong>✅ Características:</strong></p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>Timeline cronológico agrupado por años</li>
              <li>5 tipos de entradas (Consulta, Diagnóstico, Tratamiento, Control, Emergencia)</li>
              <li>Filtros por tipo, profesional y fechas</li>
              <li>Modal de creación con todos los campos</li>
              <li>Modal de vista de detalles completo</li>
              <li>Estadísticas en tiempo real</li>
              <li>Costo total de procedimientos</li>
              <li>Integración con tratamientos y profesionales</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import TimelineTratamientos from '@clinica/components/historiaClinica/TimelineTratamientos.vue'
</script>