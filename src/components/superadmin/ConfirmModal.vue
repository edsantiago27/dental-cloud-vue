<!-- components/superadmin/ConfirmModal.vue -->
<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('cancel')"></div>

    <!-- Modal -->
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        
        <!-- Icon -->
        <div class="p-6 text-center">
          <div
            class="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
            :class="{
              'bg-red-100': type === 'danger',
              'bg-yellow-100': type === 'warning',
              'bg-green-100': type === 'success',
              'bg-blue-100': type === 'info'
            }"
          >
            <i
              class="text-3xl"
              :class="{
                'fas fa-exclamation-triangle text-red-600': type === 'danger',
                'fas fa-exclamation-circle text-yellow-600': type === 'warning',
                'fas fa-check-circle text-green-600': type === 'success',
                'fas fa-info-circle text-blue-600': type === 'info'
              }"
            ></i>
          </div>

          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ title }}
          </h3>
          <p class="text-gray-600">
            {{ message }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 text-white rounded-lg transition"
            :class="{
              'bg-red-600 hover:bg-red-700': type === 'danger',
              'bg-yellow-600 hover:bg-yellow-700': type === 'warning',
              'bg-green-600 hover:bg-green-700': type === 'success',
              'bg-blue-600 hover:bg-blue-700': type === 'info'
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