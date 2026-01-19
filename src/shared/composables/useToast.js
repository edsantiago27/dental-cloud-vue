import { ref } from 'vue'

const toast = ref(null)

export function useToast() {
  const showSuccess = (message) => {
    // Implementa tu sistema de notificaciones
    // Por ejemplo con vue-toastification, sweetalert2, etc.
    console.log('✅ Success:', message)
    // O si usas tu propio sistema:
    // toast.value = { type: 'success', message }
  }

  const showError = (message) => {
    console.error('❌ Error:', message)
    // toast.value = { type: 'error', message }
  }

  const showInfo = (message) => {
    console.info('ℹ️ Info:', message)
  }

  return {
    showSuccess,
    showError,
    showInfo,
    toast
  }
}
