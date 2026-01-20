<!-- src/modules/demo/layouts/DemoLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Banner de Modo Demo -->
    <div class="bg-gradient-to-r from-violet-600 to-indigo-700 text-white px-6 py-2 flex items-center justify-between shadow-lg relative z-50">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-6 h-6 bg-white/20 rounded-lg animate-pulse">
          <i class="fas fa-rocket text-[10px]"></i>
        </div>
        <span class="text-[10px] font-black uppercase tracking-[0.2em]">Usted está en Modo Demo Interactiva</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-[9px] font-bold opacity-70 uppercase tracking-widest hidden md:inline">Los datos no se guardan en el servidor</span>
        <button 
          @click="resetDemo"
          class="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-white/10"
        >
          Reiniciar Demo
        </button>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar (Simplificado para Demo) -->
      <aside class="w-64 bg-[#0a0a0a] text-white flex flex-col border-r border-white/5">
        <div class="p-8">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center">
              <i class="fas fa-tooth text-xs"></i>
            </div>
            <span class="font-black text-xs uppercase tracking-widest">DentalCloud</span>
          </div>

          <nav class="space-y-1">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 px-4 py-3 text-gray-500 rounded-xl transition-all hover:bg-white/5 hover:text-white group"
              active-class="bg-white/5 text-white shadow-sm ring-1 ring-white/10 font-bold"
            >
              <i :class="[item.icon, 'text-xs transition-transform group-hover:scale-110']"></i>
              <span class="text-[10px] uppercase tracking-widest">{{ item.label }}</span>
            </router-link>
          </nav>
        </div>

        <div class="mt-auto p-6">
          <button 
            @click="handleLogout"
            class="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
          >
            Finalizar Tour
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <h2 class="text-sm font-black text-gray-900 uppercase tracking-tight">{{ routeName }}</h2>
          <div class="flex items-center gap-4">
            <div class="flex flex-col text-right">
              <span class="text-[10px] font-black text-gray-900 uppercase tracking-tight">{{ authStore.user?.nombre }}</span>
              <span class="text-[8px] font-bold text-violet-600 uppercase tracking-widest">{{ authStore.user?.clinica?.nombre }}</span>
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDemoAuthStore } from '../stores/demoAuth'
import { demoStorageService } from '../services/demoStorageService'

const route = useRoute()
const router = useRouter()
const authStore = useDemoAuthStore()

const routeName = computed(() => route.meta.title || 'Panel de Control')

const navItems = [
  { path: '/demo-tour/dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
  { path: '/demo-tour/pacientes', label: 'Pacientes', icon: 'fas fa-users' },
  { path: '/demo-tour/agenda', label: 'Agenda', icon: 'fas fa-calendar-alt' },
  { path: '/demo-tour/inventario', label: 'Inventario', icon: 'fas fa-box' }
]

function handleLogout() {
  authStore.logout()
  router.push('/demo-tour/login')
}

function resetDemo() {
  if (confirm('¿Seguro que deseas reiniciar todos los datos de la demo?')) {
    demoStorageService.clearAll()
    window.location.reload()
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
</style>
