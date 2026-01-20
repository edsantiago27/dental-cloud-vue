<template>
  <div class="fixed inset-0 z-[60] overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl w-full max-w-md transform transition-all border border-gray-100 dark:border-white/5 overflow-hidden">
        
        <!-- Premium Header/Art -->
        <div class="h-32 bg-gradient-to-br from-violet-600 to-indigo-900 relative overflow-hidden flex items-center justify-center">
          <div class="absolute inset-0 bg-[url('/img/pattern.png')] opacity-20"></div>
          <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full"></div>
          
          <div class="relative z-10 flex flex-col items-center">
            <div class="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-2 shadow-xl">
              <i class="fas fa-crown text-3xl text-yellow-300"></i>
            </div>
          </div>
        </div>

        <div class="p-8 text-center">
          <h3 class="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
            Función Premium
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
            El módulo <span class="text-violet-600 dark:text-violet-400 font-black">{{ featureName }}</span> no está incluido en tu plan actual. Actualiza tu suscripción para desbloquear esta y otras herramientas avanzadas.
          </p>

          <div class="space-y-3">
            <button
              @click="$emit('upgrade')"
              class="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Mejorar mi Plan
            </button>
            
            <button
              @click="$emit('close')"
              class="w-full py-4 bg-transparent text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Quizás después
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  featureName: {
    type: String,
    default: 'Seleccionado'
  }
})

defineEmits(['close', 'upgrade'])
</script>
