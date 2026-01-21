<template>
  <div class="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
    <!-- Chat Panel -->
    <transition
      enter-active-class="transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0 translate-y-12 scale-90 blur-lg"
      enter-to-class="opacity-100 translate-y-0 scale-100 blur-0"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-12 scale-90 blur-lg"
    >
      <div v-if="isOpen" class="w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden pointer-events-auto shadow-violet-500/10">
        <!-- Panel Header -->
        <div class="bg-gradient-to-br from-violet-600 to-indigo-800 p-6 text-white">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span class="text-[8px] font-black uppercase tracking-[0.3em]">Soporte Priority</span>
          </div>
          <h3 class="text-lg font-black tracking-tight uppercase leading-none mb-1">Estamos en línea</h3>
          <p class="text-[10px] font-bold opacity-70 uppercase tracking-widest">Atención directa para planes Premium</p>
        </div>

        <!-- Panel Body -->
        <div class="p-6 space-y-4">
          <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
             <div class="flex gap-3">
                <div class="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-headset text-violet-600 text-[10px]"></i>
                </div>
                <p class="text-[10px] font-bold text-gray-600 leading-relaxed uppercase tracking-tight">
                  Hola {{ authStore.userName }}, ¿en qué podemos ayudarte hoy? Resolvemos tus dudas de inmediato.
                </p>
             </div>
          </div>

          <button 
            @click="openWhatsApp"
            class="w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <i class="fab fa-whatsapp text-lg"></i>
            CONECTAR POR WHATSAPP
          </button>
        </div>
      </div>
    </transition>

    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      :class="[
        'h-16 flex items-center gap-4 px-6 rounded-full transition-all duration-500 pointer-events-auto group',
        isOpen 
          ? 'bg-white border border-gray-100 text-gray-500 shadow-xl' 
          : 'bg-gradient-to-br from-violet-600 to-indigo-800 text-white shadow-2xl shadow-violet-500/30 ring-4 ring-violet-500/10'
      ]"
    >
      <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
        <i :class="isOpen ? 'fas fa-times' : 'fas fa-headset'" class="text-sm"></i>
      </div>
      <span v-if="!isOpen" class="text-[10px] font-black uppercase tracking-[0.2em]">Chat Soporte</span>
      <span v-else class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Cerrar</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@shared/stores/auth'

const authStore = useAuthStore()
const isOpen = ref(false)

// Número de soporte por defecto (configurable por el usuario)
const SUPPORT_NUMBER = '56935307601' // Ejemplo Chile, cambiar por el real

function openWhatsApp() {
  const clinica = authStore.clinica?.nombre || 'Mi Clínica'
  const message = `Hola equipo de soporte, necesito ayuda profesional con mi clínica: *${clinica}*.`
  const encodedMessage = encodeURIComponent(message)
  window.open(`https://api.whatsapp.com/send?phone=${SUPPORT_NUMBER}&text=${encodedMessage}`, '_blank')
}
</script>

<style scoped>
/* Transiciones sutiles */
</style>
