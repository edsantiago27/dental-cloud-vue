<!-- views/Configuracion-View.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-gray-900">
        <i class="fas fa-cog text-blue-600 mr-3"></i>
        Configuración de la Clínica
      </h2>
      <p class="text-gray-600 mt-1">Personaliza tu clínica y ajusta las preferencias del sistema</p>
    </div>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-xl shadow-md mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="configuracionStore.loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Cargando configuración...</p>
    </div>

    <!-- Tabs Content -->
    <div v-else>
      
      <!-- Datos Generales -->
      <DatosGeneralesTab v-show="activeTab === 'general'" />

      <!-- Logo y Branding -->
      <LogoBrandingTab v-show="activeTab === 'branding'" />

      <!-- Horarios y Preferencias -->
      <HorariosPreferenciasTab v-show="activeTab === 'horarios'" />

      <!-- Datos Fiscales -->
      <DatosFiscalesTab v-show="activeTab === 'fiscales'" />

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfiguracionStore } from '@clinica/stores/configuracion'
import DatosGeneralesTab from '@clinica/components/configuracion/DatosGeneralesTab.vue'
import LogoBrandingTab from '@clinica/components/configuracion/LogoBrandingTab.vue'
import HorariosPreferenciasTab from '@clinica/components/configuracion/HorariosPreferenciasTab.vue'
import DatosFiscalesTab from '@clinica/components/configuracion/DatosFiscalesTab.vue'

const configuracionStore = useConfiguracionStore()

const activeTab = ref('general')

const tabs = [
  { id: 'general', label: 'Datos Generales', icon: 'fas fa-building' },
  { id: 'branding', label: 'Logo y Branding', icon: 'fas fa-palette' },
  { id: 'horarios', label: 'Horarios y Preferencias', icon: 'fas fa-clock' },
  { id: 'fiscales', label: 'Datos Fiscales', icon: 'fas fa-file-invoice' }
]

onMounted(async () => {
  // Cargar configuración actual
  await configuracionStore.fetchConfiguracion()
})
</script>