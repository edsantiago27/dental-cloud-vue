<!-- components/admin/Sidebar.vue -->
<template>
  <aside 
    :class="[
      'bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300',
      isOpen ? 'w-64' : 'w-20'
    ]"
  >
  <!-- Logo Dinámico -->
    <div class="logo-section">
     <!-- CON LOGO -->
<div v-if="configuracionStore.hasLogo" class="text-center">
  <img 
    :src="configuracionStore.logoUrl" 
    :alt="configuracionStore.configuracion.nombre"
    class="h-16 mx-auto object-contain"
  >
  <p class="text-sm font-semibold mt-2">
    {{ configuracionStore.configuracion.nombre || 'DentalCloud' }}
  </p>
</div>

<!-- SIN LOGO - Default -->
<div v-else class="text-center">
  <div class="h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2">
    <i class="fas fa-tooth text-white text-3xl"></i>
  </div>
  <p class="text-sm font-semibold">
    {{ configuracionStore.configuracion.nombre || 'DentalCloud' }}
  </p>
</div>
      
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-6 px-3 overflow-y-auto">
      
      <!-- Dashboard -->
      <MenuItem
        to="/dashboard"
        icon="fas fa-home"
        label="Dashboard"
        :is-open="isOpen"
      />

      <!-- Sección: Gestión de Pacientes -->
      <div v-if="isOpen" class="px-3 py-2 mt-6">
        <p class="text-xs font-semibold text-blue-300 uppercase tracking-wider">
          Gestión
        </p>
      </div>

      <MenuItem
        to="/pacientes"
        icon="fas fa-users"
        label="Pacientes"
        :is-open="isOpen"
        :badge="newPatientsCount"
      />

      <MenuItem
        to="/profesionales"
        icon="fas fa-user-md"
        label="Profesionales"
        :is-open="isOpen"
      />

      <MenuItem
        to="/tratamientos"
        icon="fas fa-tooth"
        label="Tratamientos"
        :is-open="isOpen"
      />

      <!-- Sección: Agenda -->
      <div v-if="isOpen" class="px-3 py-2 mt-6">
        <p class="text-xs font-semibold text-blue-300 uppercase tracking-wider">
          Agenda
        </p>
      </div>

      <MenuItem
        to="/citas"
        icon="fas fa-calendar-alt"
        label="Citas"
        :is-open="isOpen"
        :badge="todayAppointments"
      />

      <MenuItem
        to="/calendario"
        icon="fas fa-calendar"
        label="Calendario"
        :is-open="isOpen"
      />

      <!-- Sección: Finanzas -->
      <div v-if="isOpen" class="px-3 py-2 mt-6">
        <p class="text-xs font-semibold text-blue-300 uppercase tracking-wider">
          Finanzas
        </p>
      </div>

      <MenuItem
        to="/facturacion"
        icon="fas fa-file-invoice-dollar"
        label="Facturación y Pagos"
        :is-open="isOpen"
      />

      <!-- <MenuItem
        to="/pagos"
        icon="fas fa-credit-card"
        label="Pagos"
        :is-open="isOpen"
      /> -->

      <MenuItem
        to="/reportes"
        icon="fas fa-chart-line"
        label="Reportes"
        :is-open="isOpen"
      />

      <!-- Sección: Configuración -->
      <div v-if="isOpen" class="px-3 py-2 mt-6">
        <p class="text-xs font-semibold text-blue-300 uppercase tracking-wider">
          Sistema
        </p>
      </div>

      <MenuItem
        to="/configuracion"
        icon="fas fa-cog"
        label="Configuración"
        :is-open="isOpen"
      />

      <MenuItem
        to="/usuarios"
        icon="fas fa-user-cog"
        label="Usuarios"
        :is-open="isOpen"
        v-if="authStore.isAdmin"
      />

    </nav>

  
    <!-- Collapse Button - SIEMPRE VISIBLE -->
<div class="p-4 border-t border-blue-700 flex-shrink-0">
  <button
    @click="handleToggle"
    :title="isOpen ? 'Contraer menú' : 'Expandir menú'"
    class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
  >
    <i 
      :class="isOpen ? 'fas fa-chevron-left' : 'fas fa-chevron-right'" 
      class="text-lg"
    ></i>
    <span v-if="isOpen" class="text-sm font-medium">Contraer Menú</span>
  </button>
</div>

  </aside>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@shared/stores/auth'
import MenuItem from './MenuItem.vue'
import { useConfiguracionStore } from '@clinica/stores/configuracion'

const configuracionStore = useConfiguracionStore()

// Cargar configuración al iniciar
onMounted(async () => {
  if (!configuracionStore.configuracion.nombre) {
    await configuracionStore.fetchConfiguracion()
  }
})

const authStore = useAuthStore()

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle'])

function handleToggle() {
  console.log('🔄 Toggle sidebar clicked')
  emit('toggle')
}

// Datos de ejemplo para badges
// TODO: Conectar con API real
const newPatientsCount = computed(() => 5)
const todayAppointments = computed(() => 8)
</script>
