<!-- components/superadmin/ConfirmModal.vue -->
<template>
  <div class="fixed inset-0 z-[100] overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="$emit('cancel')"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white dark:bg-[#111111] rounded-[2.5rem] shadow-2xl w-full max-w-sm transform transition-all border border-gray-100 dark:border-white/5 overflow-hidden">
        
        <!-- Icon & Content -->
        <div class="p-10 text-center">
          <div
            class="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform hover:scale-110"
            :class="{
              'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400': type === 'danger',
              'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400': type === 'warning',
              'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400': type === 'success',
              'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400': type === 'info'
            }"
          >
            <i
              class="text-3xl"
              :class="{
                'fas fa-exclamation-triangle': type === 'danger',
                'fas fa-exclamation-circle': type === 'warning',
                'fas fa-check-circle': type === 'success',
                'fas fa-info-circle': type === 'info'
              }"
            ></i>
          </div>

          <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight uppercase">
            {{ title }}
          </h3>
          <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
            {{ message }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-50 dark:border-white/5">
          <button
            @click="$emit('cancel')"
            class="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirm')"
            class="flex-1 py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-[0.98]"
            :class="{
              'bg-red-600 shadow-red-200 dark:shadow-red-500/20': type === 'danger',
              'bg-orange-500 shadow-orange-200 dark:shadow-orange-500/20': type === 'warning',
              'bg-green-600 shadow-green-200 dark:shadow-green-500/20': type === 'success',
              'bg-violet-600 shadow-violet-200 dark:shadow-violet-600/20': type === 'info'
            }"
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['danger', 'warning', 'success', 'info'].includes(value)
  }
})

defineEmits(['confirm', 'cancel'])
</script>