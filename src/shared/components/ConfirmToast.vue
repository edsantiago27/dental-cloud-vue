<!-- shared/components/ConfirmToast.vue -->
<template>
  <div class="confirm-toast">
    <div class="confirm-toast-message">
      {{ message }}
    </div>
    <div class="confirm-toast-actions">
      <button 
        @click="handleCancel"
        class="confirm-toast-btn confirm-toast-btn-cancel"
      >
        Cancelar
      </button>
      <button 
        @click="handleConfirm"
        class="confirm-toast-btn confirm-toast-btn-confirm"
      >
        Confirmar
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true
  },
  onConfirm: {
    type: Function,
    required: true
  },
  onCancel: {
    type: Function,
    default: () => {}
  },
  closeToast: {
    type: Function,
    required: true
  }
})

function handleConfirm() {
  props.onConfirm()
  props.closeToast()
}

function handleCancel() {
  props.onCancel()
  props.closeToast()
}
</script>

<style scoped>
.confirm-toast {
  padding: 4px;
}

.confirm-toast-message {
  margin-bottom: 16px;
  font-size: 15px;
  line-height: 1.5;
  color: #374151;
}

.confirm-toast-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 12px;
}

.confirm-toast-btn {
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
  border: none;
  outline: none;
}

.confirm-toast-btn-cancel {
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
}

.confirm-toast-btn-cancel:hover {
  background: #f3f4f6;
}

.confirm-toast-btn-confirm {
  background: #ef4444;
  color: white;
}

.confirm-toast-btn-confirm:hover {
  background: #dc2626;
}
</style>