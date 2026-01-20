<!-- components/shared/Sidebar.vue -->
<template>
  <aside 
    :class="[
      'bg-[#0a0a0a] text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col border-r border-white/5 relative z-40',
      isOpen ? 'w-72' : 'w-24'
    ]"
  >
    <!-- Logo Section (Bento Style) -->
    <div class="p-8">
      <div v-if="configuracionStore.hasLogo" class="flex items-center gap-4 group cursor-pointer transition-transform hover:scale-105">
        <div class="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-center overflow-hidden shadow-2xl">
          <img 
            :src="configuracionStore.logoUrl" 
            :alt="configuracionStore.configuracion.nombre"
            class="w-full h-full object-contain"
          >
        </div>
        <div v-if="isOpen" class="flex flex-col">
          <span class="text-[11px] font-black uppercase tracking-widest text-white leading-none mb-1">
            {{ configuracionStore.configuracion.nombre || 'DentalCloud' }}
          </span>
          <span class="text-[8px] font-bold text-violet-500 uppercase tracking-widest">Medical Center</span>
        </div>
      </div>

      <div v-else class="flex items-center gap-4 group cursor-pointer">
        <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-500">
          <i class="fas fa-tooth text-white text-xl"></i>
        </div>
        <div v-if="isOpen" class="flex flex-col">
          <span class="text-[11px] font-black uppercase tracking-widest text-white leading-none mb-1">
            {{ configuracionStore.configuracion.nombre || 'DentalCloud' }}
          </span>
          <span class="text-[8px] font-bold text-violet-500 uppercase tracking-widest">Intelligent Platform</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 px-4 overflow-y-auto custom-scrollbar space-y-2">
      
      <!-- Dashboard -->
      <MenuItem
        to="/dashboard"
        icon="fas fa-th-large"
        label="Dashboard"
        :is-open="isOpen"
      />

      <!-- Sección: Gestión -->
      <div v-if="isOpen" class="px-5 py-6">
        <p class="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Gestión Clínica</p>
      </div>
      <div v-else class="h-px bg-white/5 mx-6 my-6"></div>

      <MenuItem
        to="/pacientes"
        icon="fas fa-users"
        label="Pacientes"
        :is-open="isOpen"
        :badge="newPatientsCount"
      />

      <MenuItem
        to="/citas"
        icon="fas fa-list-ul"
        label="Listado Citas"
        :is-open="isOpen"
      />

      <MenuItem
        to="/calendario"
        icon="fas fa-calendar-alt"
        label="Calendario"
        :is-open="isOpen"
        :badge="todayAppointments"
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

      <MenuItem
        to="/presupuestos"
        icon="fas fa-file-invoice"
        label="Presupuestos"
        :is-open="isOpen"
      />

      <!-- Sección: Administración -->
      <div v-if="isOpen" class="px-5 py-6">
        <p class="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Administración</p>
      </div>
      <div v-else class="h-px bg-white/5 mx-6 my-6"></div>

      <MenuItem
        to="/facturacion"
        icon="fas fa-file-invoice-dollar"
        label="Finanzas"
        :is-open="isOpen"
      />

      <MenuItem
        to="/reportes"
        icon="fas fa-chart-pie"
        label="Reportes"
        :is-open="isOpen"
      />

      <!-- Sector inferior: Configuración -->
      <div class="pt-8 mt-auto px-1">
         <MenuItem
          to="/configuracion"
          icon="fas fa-cog"
          label="Ajustes"
          :is-open="isOpen"
        />
        <MenuItem
          v-if="authStore.isAdmin"
          to="/usuarios"
          icon="fas fa-shield-alt"
          label="Seguridad"
          :is-open="isOpen"
        />
      </div>
    </nav>

    <!-- Bottom Actions / Collapse -->
    <div class="p-6">
      <button
        @click="handleToggle"
        class="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group overflow-hidden"
      >
        <i 
          :class="isOpen ? 'fas fa-chevron-left' : 'fas fa-chevron-right'" 
          class="text-xs text-gray-400 group-hover:text-white transition-transform group-hover:scale-110"
        ></i>
        <span v-if="isOpen" class="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">CONTRAER MENÚ</span>
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
const authStore = useAuthStore()

// Props
defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle'])

// Methods
function handleToggle() {
  emit('toggle')
}

// Stats / Badges
const newPatientsCount = computed(() => 5)
const todayAppointments = computed(() => 8)

onMounted(async () => {
  if (!configuracionStore.configuracion.nombre) {
    await configuracionStore.fetchConfiguracion()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
</style>
