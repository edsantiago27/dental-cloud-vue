<!-- src/modules/demo/views/DemoLogin.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">
    <!-- Decoraciones de fondo -->
    <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>

    <div class="w-full max-w-md p-8 relative z-10">
      <!-- Logo & Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-violet-800 shadow-2xl shadow-violet-500/20 mb-6 group transition-transform hover:scale-110">
          <i class="fas fa-tooth text-3xl text-white"></i>
        </div>
        <h1 class="text-4xl font-black text-white tracking-tighter mb-2 uppercase">DentalCloud</h1>
        <div class="flex items-center justify-center gap-2">
          <span class="h-[1px] w-8 bg-gray-800"></span>
          <span class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">Demo Interactive Tour</span>
          <span class="h-[1px] w-8 bg-gray-800"></span>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
        <div class="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
        
        <div class="relative z-10 text-center space-y-6">
          <div class="space-y-2">
            <h2 class="text-xl font-black text-white uppercase tracking-tight">Bienvenido al Tour</h2>
            <p class="text-xs text-gray-400 font-medium leading-relaxed">
              Explora todas las capacidades de DentalCloud en un entorno seguro. Los cambios realizados se guardarán localmente en tu navegador.
            </p>
          </div>

          <div class="py-4 space-y-3">
            <div class="flex items-center gap-3 text-[10px] font-black uppercase text-gray-400 tracking-widest bg-white/5 p-3 rounded-2xl border border-white/5">
              <i class="fas fa-check-circle text-violet-500"></i>
              <span>Pacientes & Historias</span>
            </div>
            <div class="flex items-center gap-3 text-[10px] font-black uppercase text-gray-400 tracking-widest bg-white/5 p-3 rounded-2xl border border-white/5">
              <i class="fas fa-check-circle text-violet-500"></i>
              <span>Agenda Inteligente</span>
            </div>
            <div class="flex items-center gap-3 text-[10px] font-black uppercase text-gray-400 tracking-widest bg-white/5 p-3 rounded-2xl border border-white/5">
              <i class="fas fa-check-circle text-violet-500"></i>
              <span>Control de Inventario</span>
            </div>
          </div>

          <button 
            @click="handleStartTour"
            :disabled="loading"
            class="w-full py-5 bg-white text-black rounded-[1.5rem] text-xs font-black uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 flex items-center justify-center gap-3"
          >
            <span v-if="!loading">Comenzar Experiencia</span>
            <i v-else class="fas fa-spinner fa-spin"></i>
            <i v-if="!loading" class="fas fa-chevron-right text-[10px]"></i>
          </button>

          <p class="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-4">
            No requiere registro · Sin compromiso
          </p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center mt-8 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
        &copy; 2026 DentalCloud Intelligent Systems
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDemoAuthStore } from '../stores/demoAuth'

const router = useRouter()
const authStore = useDemoAuthStore()
const loading = ref(false)

async function handleStartTour() {
  loading.value = true
  // Simular pequeña carga para efecto dramático
  setTimeout(() => {
    authStore.login({ email: 'visitante@demo.com' })
    router.push('/demo-tour/dashboard')
    loading.value = false
  }, 1200)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');

.font-sans {
  font-family: 'Outfit', sans-serif;
}
</style>
